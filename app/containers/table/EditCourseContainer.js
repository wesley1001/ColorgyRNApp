import React, {
  InteractionManager,
  StyleSheet,
  View,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import _ from 'underscore';

import THEME from '../../constants/THEME';

import Text from '../../components/Text';
import TitleBarView from '../../components/TitleBarView';
import TitleBarActionIcon from '../../components/TitleBarActionIcon';
import CourseCard from '../../components/CourseCard';
import GhostButton from '../../components/GhostButton';

import {
  doSyncUserCourses,
  doLoadTableCourses,
  doRemoveCourse
} from '../../actions/tableActions';

var TableContainer = React.createClass({

  getInitialState() {
    return {
      renderPlaceholderOnly: true
    };
  },

  componentWillMount() {
  },

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ renderPlaceholderOnly: false });
      this.props.dispatch(doLoadTableCourses(this.props.userId, this.props.organizationCode));
    });
  },

  componentWillUnmount() {
    InteractionManager.runAfterInteractions(() => {
      if (this.props.networkConnectivity) {
        this.props.dispatch(doSyncUserCourses(this.props.userId, this.props.organizationCode));
      }
    });
  },

  _handleBack() {
    this.props.navigator.pop();
  },

  _handleAdd() {
    this.props.navigator.push({ name: 'addCourse' });
  },

  _handleCoursePress(payload) {
    this.props.navigator.push({ name: 'course', code: payload.courseCode });
  },

  render() {
    var courses = this.props.courses;
    var coursesArray = _.values(courses);

    if (this.state.renderPlaceholderOnly) {
      var renderCount = parseInt(this.props.windowHeight / 100);
      var coursesArray = _.first(coursesArray, renderCount);
    }

    return (
      <TitleBarView
        enableOffsetTop={this.props.translucentStatusBar}
        offsetTop={this.props.statusBarHeight}
        style={this.props.style}
        title="已選課程"
        leftAction={
          <TitleBarActionIcon onPress={this._handleBack}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TitleBarActionIcon>
        }
        rightAction={
          <TitleBarActionIcon onPress={this._handleAdd}>
            <Icon name="add" size={24} color="#FFFFFF" />
          </TitleBarActionIcon>
        }
      >
        <ScrollView
          contentContainerStyle={styles.container}
        >
          {coursesArray.map((course) => {
            return (
              <CourseCard
                key={course.code}
                course={course}
                onPress={this._handleCoursePress}
                action={<GhostButton
                  type="tiny"
                  value="移除"
                  confirmValue="確認移除"
                  setLoadingAfterPress={true}
                  confirmColor={THEME.DANGER_COLOR}
                  initialWidth={48}
                  confirmWidth={78}
                  onPress={() => {
                    this.props.dispatch(
                      doRemoveCourse(
                        course,
                        this.props.userId,
                        this.props.organizationCode
                      )
                    );
                  }}
                />}
              />
            );
          })}
        </ScrollView>
      </TitleBarView>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    paddingVertical: 7,
    paddingHorizontal: 5
  }
});

export default connect((state) => ({
  tableStatus: state.table.tableStatus,
  userId: state.colorgyAPI.me && state.colorgyAPI.me.id,
  organizationCode: state.colorgyAPI.me && state.colorgyAPI.me.possibleOrganizationCode,
  courses: state.table.tableCourses,
  windowHeight: state.deviceInfo.windowHeight,
  networkConnectivity: state.deviceInfo.networkConnectivity,
  translucentStatusBar: state.deviceInfo.translucentStatusBar,
  statusBarHeight: state.deviceInfo.statusBarHeight
}))(TableContainer);
