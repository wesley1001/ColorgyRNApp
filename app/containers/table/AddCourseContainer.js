import React, {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableNativeFeedback
} from 'react-native';
import { connect } from 'react-redux/native';
import _ from 'underscore';

import {
  doLoadTableCourses,
  doAddCourse,
  doRemoveCourse
} from '../../actions/tableActions';

import courseDatabase from '../../databases/courseDatabase';

import TitleBarView from '../../components/TitleBarView';
import TitleBarIconButton from '../../components/TitleBarIconButton';
import CourseCard from '../../components/CourseCard';

var TableContainer = React.createClass({

  componentWillMount() {
    this.props.dispatch(doLoadTableCourses(this.props.userId, this.props.organizationCode));
  },

  getInitialState() {
    return {
      searchQuery: null,
      courses: {}
    };
  },

  _handleBack() {
    this.props.navigator.pop();
  },

  _handleSearch(query) {
    this.setState({ searchQuery: query });
    courseDatabase.searchCourse(this.props.organizationCode, (query || '')).then((courses) => {
      this.setState({ courses });
    });
  },

  _handleCoursePress(payload) {
    this.props.navigator.push({ name: 'course', code: payload.courseCode });
  },

  render() {
    var { courses } = this.state;
    var { selectedCourses } = this.props;
    var selectedCourseCodes = Object.keys(selectedCourses);

    return (
      <TitleBarView
        enableOffsetTop={this.props.translucentStatusBar}
        offsetTop={this.props.statusBarHeight}
        title="加選課程"
        leftAction={
          <TitleBarIconButton
            onPress={this._handleBack}
            icon={require('../../assets/images/icon_arrow_back_white.png')}
          />
        }
      >
        <View style={styles.searchBar}>
          <TextInput
            placeholder="搜尋課名、老師姓名或課程代碼"
            underlineColorAndroid="transparent"
            underlineColor="transparent"
            onChangeText={this._handleSearch}
            value={this.state.searchQuery}
          />
        </View>
        <ScrollView>
          {_.values(courses).map((course) => {
            var selected = selectedCourseCodes.indexOf(course.code) > 0;
            return (
              <CourseCard
                key={course.code}
                course={course}
                onPress={this._handleCoursePress}
                actionName={selected ? '刪除' : '選擇'}
                onActionPress={() => {
                  if (selected) {
                    this.props.dispatch(
                      doRemoveCourse(
                        course,
                        this.props.userId,
                        this.props.organizationCode
                      )
                    );
                  } else {
                    this.props.dispatch(
                      doAddCourse(
                        course,
                        this.props.userId,
                        this.props.organizationCode
                      )
                    );
                  }
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
  },
  searchBar: {
    backgroundColor: '#CCCCCC',
    paddingLeft: 12,
    paddingRight: 12
  }
});

export default connect((state) => ({
  tableStatus: state.table.tableStatus,
  userId: state.colorgyAPI.me && state.colorgyAPI.me.id,
  organizationCode: state.colorgyAPI.me && state.colorgyAPI.me.possibleOrganizationCode,
  selectedCourses: state.table.tableCourses,
  translucentStatusBar: state.uiEnvironment.translucentStatusBar,
  statusBarHeight: state.uiEnvironment.statusBarHeight
}))(TableContainer);
