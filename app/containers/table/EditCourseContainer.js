import React, {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableNativeFeedback
} from 'react-native';
import { connect } from 'react-redux/native';
import _ from 'underscore';

import {
  doSyncUserCourses,
  doLoadTableCourses,
  doRemoveCourse
} from '../../actions/tableActions';

import TitleBarView from '../../components/TitleBarView';
import TitleBarIconButton from '../../components/TitleBarIconButton';
import CourseCard from '../../components/CourseCard';

var TableContainer = React.createClass({

  componentWillMount() {
    this.props.dispatch(doSyncUserCourses(this.props.userId, this.props.organizationCode));
    this.props.dispatch(doLoadTableCourses(this.props.userId, this.props.organizationCode));
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

    return (
      <TitleBarView
        enableOffsetTop={this.props.translucentStatusBar}
        offsetTop={this.props.statusBarHeight}
        title="已選課程"
        leftAction={
          <TitleBarIconButton
            onPress={this._handleBack}
            icon={require('../../assets/images/icon_arrow_back_white.png')}
          />
        }
        rightAction={
          <TitleBarIconButton
            onPress={this._handleAdd}
            icon={require('../../assets/images/icon_add_white.png')}
          />
        }
      >
        <ScrollView>
          {_.values(courses).map((course) => {
            return (
              <CourseCard
                key={course.code}
                course={course}
                actionName="刪除"
                onPress={this._handleCoursePress}
                onActionPress={() => {
                  this.props.dispatch(
                    doRemoveCourse(
                      course,
                      this.props.userId,
                      this.props.organizationCode
                    )
                  );
                }}
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
    flex: 1
  }
});

export default connect((state) => ({
  tableStatus: state.table.tableStatus,
  userId: state.colorgyAPI.me && state.colorgyAPI.me.id,
  organizationCode: state.colorgyAPI.me && state.colorgyAPI.me.possibleOrganizationCode,
  courses: state.table.tableCourses,
  translucentStatusBar: state.uiEnvironment.translucentStatusBar,
  statusBarHeight: state.uiEnvironment.statusBarHeight
}))(TableContainer);
