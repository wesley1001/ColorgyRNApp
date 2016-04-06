import React, {
  InteractionManager,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import _ from 'underscore';
import moment from 'moment';
require('moment/locale/zh-tw');

import THEME from '../../constants/THEME';

import Text from '../../components/Text';
import TitleBarLayout from '../../components/TitleBarLayout';
import TitleBarActionIcon from '../../components/TitleBarActionIcon';
import CourseCard from '../../components/CourseCard';
import GhostButton from '../../components/GhostButton';

import {
  doSyncUserCourses,
  doLoadTableCourses,
  doRemoveCourse,
  doForceUpdateCourseDatabase
} from '../../actions/tableActions';

var TableContainer = React.createClass({
  courseRefs: {},

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
      <TitleBarLayout
        enableOffsetTop={this.props.translucentStatusBar}
        offsetTop={this.props.statusBarHeight}
        style={this.props.style}
        title="已選課程"
        actions={[
          { title: '返回', icon: require('../../assets/images/icon_arrow_back_white.png'), onPress: this._handleBack, show: 'always' },
          { title: '加選課程', icon: require('../../assets/images/icon_add_white.png'), onPress: this._handleAdd, show: 'always' }
        ]}
      >
        <ScrollView
          contentContainerStyle={styles.container}
        >
          {coursesArray.map((course) => {
            return (
              <CourseCard
                ref={(ref) => this.courseRefs[course.code] = ref}
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
                  touchAreaIncreaseHorizontal={2}
                  touchAreaIncreaseVertical={12}
                  onPress={() => {
                    this.courseRefs[course.code].remove();
                    InteractionManager.runAfterInteractions(() => {
                      this.props.dispatch(
                        doRemoveCourse(
                          course,
                          this.props.userId,
                          this.props.organizationCode
                        )
                      );
                    });
                  }}
                />}
              />
            );
          })}
          <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 16, paddingHorizontal: 12 }}>
            <Text>資料最後更新：{moment(this.props.courseDatabaseUpdatedTime[this.props.organizationCode]).locale('zh-tw').fromNow()} (</Text>
            <TouchableOpacity onPress={() => this.props.dispatch(doForceUpdateCourseDatabase(this.props.organizationCode))}>
              <View style={{ backgroundColor: 'transparent', borderBottomWidth: 1, borderBottomColor: '#F89680' }}>
                <Text style={{ color: '#F89680' }}>
                  立即更新
                </Text>
              </View>
            </TouchableOpacity>
            <Text>)</Text>
          </View>
        </ScrollView>
      </TitleBarLayout>
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
  courseDatabaseUpdatedTime: state.table.courseDatabaseUpdatedTime,
  courseDatabaseLoadingProgress: state.table.courseDatabaseLoadingProgress,
  courses: state.table.tableCourses,
  windowHeight: state.deviceInfo.windowHeight,
  networkConnectivity: state.deviceInfo.networkConnectivity,
  translucentStatusBar: state.deviceInfo.translucentStatusBar,
  statusBarHeight: state.deviceInfo.statusBarHeight
}))(TableContainer);
