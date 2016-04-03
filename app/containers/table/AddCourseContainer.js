import React, {
  InteractionManager,
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableNativeFeedback,
  ProgressBarAndroid
} from 'react-native';
import { connect } from 'react-redux/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import _ from 'underscore';

import THEME from '../../constants/THEME';

import courseDatabase from '../../databases/courseDatabase';

import Text from '../../components/Text';
import TextInput from '../../components/TextInput';
import TitleBarLayout from '../../components/TitleBarLayout';
import TitleBarActionIcon from '../../components/TitleBarActionIcon';
import CourseCard from '../../components/CourseCard';
import GhostButton from '../../components/GhostButton';
import Button from '../../components/Button';

import {
  doLoadTableCourses,
  doAddCourse,
  doRemoveCourse,
  doSyncUserCourses
} from '../../actions/tableActions';

var AddCourseContainer = React.createClass({

  getInitialState() {
    return {
      searchQuery: null,
      courses: {}
    };
  },

  componentWillMount() {
    this.props.dispatch(doLoadTableCourses(this.props.userId, this.props.organizationCode));
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedCourses != nextProps.selectedCourses) {
      this._handleSearch(true);
    }
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

  _handleSearch(query) {
    if (query === true) query = this.state.searchQuery;
    this.setState({ searchQuery: query });
    courseDatabase.searchCourse(this.props.organizationCode, (query || '')).then((courses) => {
      this.setState({ courses });
    });
  },

  _handleCoursePress(payload) {
    this.props.navigator.push({ name: 'course', code: payload.courseCode });
  },

  _handleCreateCourse() {
    this.props.navigator.push({ name: 'createCourse', courseName: this.state.searchQuery });
  },

  render() {
    var { courses } = this.state;
    var { selectedCourses } = this.props;
    var selectedCourseCodes = Object.keys(selectedCourses);

    return (
      <TitleBarLayout
        enableOffsetTop={this.props.translucentStatusBar}
        offsetTop={this.props.statusBarHeight}
        style={this.props.style}
        title="加選課程"
        actions={[
          { title: '返回', icon: require('../../assets/images/icon_arrow_back_white.png'), onPress: this._handleBack, show: 'always' }
        ]}
      >
        <View style={styles.searchBar}>
          <TextInput
            placeholder="搜尋課名、老師姓名或課程代碼"
            autoFocus={true}
            underlineColorAndroid="transparent"
            underlineColor="transparent"
            onChangeText={this._handleSearch}
            value={this.state.searchQuery}
          />
        </View>
        <ScrollView>
          {(()=> {
            if (this.state.searchQuery && this.state.searchQuery.length > 0) {
              return (
                <Button
                  style={styles.manuallyCreateCourseButton}
                  value={`手動新增「${this.state.searchQuery}」課程`}
                  onPress={this._handleCreateCourse}
                />
              );
            }
          })()}
          {_.values(courses).map((course) => {
            var selected = selectedCourseCodes.indexOf(course.code) >= 0;
            return (
              <CourseCard
                key={course.code}
                course={course}
                onPress={this._handleCoursePress}
                action={selected ?
                  <GhostButton
                    type="tiny"
                    key="remove"
                    value="移除"
                    confirmValue="確認移除"
                    setLoadingAfterPress={true}
                    confirmColor={THEME.DANGER_COLOR}
                    initialWidth={48}
                    confirmWidth={78}
                    touchAreaIncreaseHorizontal={2}
                    touchAreaIncreaseVertical={12}
                    onPress={() => {
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
                  />
                :
                  <GhostButton
                    type="tiny"
                    key="add"
                    value="加選課程"
                    confirmValue="確認加選"
                    setLoadingAfterPress={true}
                    confirmColor={THEME.SUCCESS_COLOR}
                    initialWidth={78}
                    confirmWidth={78}
                    touchAreaIncreaseHorizontal={2}
                    touchAreaIncreaseVertical={12}
                    onPress={() => {
                      InteractionManager.runAfterInteractions(() => {
                        this.props.dispatch(
                          doAddCourse(
                            course,
                            this.props.userId,
                            this.props.organizationCode
                          )
                        );
                      });
                    }}
                  />
                }
              />
            );
          })}
        </ScrollView>
      </TitleBarLayout>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingLeft: 12,
    paddingRight: 12
  },
  manuallyCreateCourseButton: {
    margin: 12
  }
});

export default connect((state) => ({
  tableStatus: state.table.tableStatus,
  userId: state.colorgyAPI.me && state.colorgyAPI.me.id,
  organizationCode: state.colorgyAPI.me && state.colorgyAPI.me.possibleOrganizationCode,
  selectedCourses: state.table.tableCourses,
  networkConnectivity: state.deviceInfo.networkConnectivity,
  translucentStatusBar: state.deviceInfo.translucentStatusBar,
  statusBarHeight: state.deviceInfo.statusBarHeight
}))(AddCourseContainer);
