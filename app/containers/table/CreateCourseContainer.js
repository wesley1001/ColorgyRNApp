import React, {
  InteractionManager,
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableNativeFeedback
} from 'react-native';
import { connect } from 'react-redux/native';
import _ from 'underscore';
import Icon from 'react-native-vector-icons/MaterialIcons';

import THEME from '../../constants/THEME';

import courseDatabase from '../../databases/courseDatabase';
import colorgyAPI from '../../utils/colorgyAPI';
import notify from '../../utils/notify';

import { setOverlayElement } from '../../actions/appActions';
import { doCreateAndAddCourse } from '../../actions/tableActions';

import Text from '../../components/Text';
import TextInput from '../../components/TextInput';
import TitleBarLayout from '../../components/TitleBarLayout';
import GhostButton from '../../components/GhostButton';
import Button from '../../components/Button';
import TableCreateCoursePage from '../../components/TableCreateCoursePage';

import { hideAppTabBar, showAppTabBar } from '../../actions/appTabActions';
import {
  doLoadTableCourses,
  doAddCourse,
  doRemoveCourse,
  doSyncUserCourses
} from '../../actions/tableActions';

var CreateCourseContainer = React.createClass({

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      courseName: this.props.courseName,
      courseLecturer: null,
      courseTimes: [this._getInitialCourseTime()]
    };
  },

  componentWillMount() {
    this.props.dispatch(hideAppTabBar());
  },

  componentWillUnmount() {
    this.props.dispatch(showAppTabBar());

    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch(doSyncUserCourses(this.props.userId, this.props.organizationCode));
    });
  },

  _handleBack() {
    // TODO: Confirm before this
    this.props.navigator.pop();
  },

  handleBack() {

  },

  _handleCourseTimeChange(index, data) {
    var courseTimes = this.state.courseTimes;
    var oldCourseTime = courseTimes[index] || {};
    var courseTime = {
      ...oldCourseTime,
      ...data
    };
    courseTimes[index] = courseTime;
    this.setState({ courseTimes });
  },

  _getInitialCourseTime() {
    return {
      location: '',
      day: 1,
      periodStart: 1,
      periodEnd: 1
    };
  },

  _addCourseTime() {
    var courseTimes = this.state.courseTimes;
    courseTimes.push(this._getInitialCourseTime());
    this.setState({ courseTimes });
  },

  _deleteCourseTime(i) {
    var courseTimes = this.state.courseTimes;
    courseTimes.splice(i, 1);
    this.setState({ courseTimes });
  },

  _handleSave() {
    this.setState({ saving: true });

    var course = {};
    course.name = this.state.courseName;
    course.lecturer = this.state.courseLecturer;
    course.year = colorgyAPI.getCurrentYear();
    course.term = colorgyAPI.getCurrentTerm();

    var courseTimeIndex = 1;

    _.each(this.state.courseTimes, (courseTime) => {
      for (let i=courseTime.periodStart; i<=courseTime.periodEnd; i++) {
        course[`day_${courseTimeIndex}`] = courseTime.day;
        course[`period_${courseTimeIndex}`] = i;
        course[`location_${courseTimeIndex}`] = courseTime.location;
        courseTimeIndex++;
      }
    });

    this.props.dispatch(doCreateAndAddCourse(this.props.userId, this.props.organizationCode, course, () => {
      this.setState({ saving: false });
      notify('已儲存');
      this.props.navigator.pop();
    }, () => {
      this.setState({ saving: false });
      notify('儲存失敗');
    }));
  },

  render() {

    return (
      <TableCreateCoursePage
        periodData={this.props.periodData}
        courseName={this.state.courseName}
        courseLecturer={this.state.courseLecturer}
        courseTimes={this.state.courseTimes}
        saving={this.state.saving}
        handleSave={this._handleSave}
        handleCourseNameChange={(t) => this.setState({ courseName: t })}
        handleCourseLecturerChange={(t) => this.setState({ courseLecturer: t })}
        handleCourseTimeChange={this._handleCourseTimeChange}
        handleAddCourseTime={this._addCourseTime}
        handleDeleteCourseTime={this._deleteCourseTime}
        handleBack={this._handleBack}
        onSetOverlayElement={(element) => {
          this.props.dispatch(setOverlayElement(element))
        }}
        translucentStatusBar={this.props.translucentStatusBar}
        statusBarHeight={this.props.statusBarHeight}
      />
    );
  }
});

export default connect((state) => ({
  tableStatus: state.table.tableStatus,
  userId: state.colorgyAPI.me && state.colorgyAPI.me.id,
  organizationCode: state.colorgyAPI.me && state.colorgyAPI.me.possibleOrganizationCode,
  periodData: state.table.tablePeriodData,
  networkConnectivity: state.deviceInfo.networkConnectivity,
  translucentStatusBar: state.deviceInfo.translucentStatusBar,
  statusBarHeight: state.deviceInfo.statusBarHeight
}))(CreateCourseContainer);
