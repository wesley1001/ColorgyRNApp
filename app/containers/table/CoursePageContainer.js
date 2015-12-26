import React, {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableNativeFeedback,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux/native';
import _ from 'underscore';

import LOADING_STATE from '../../constants/LOADING_STATE';

import colorgyAPI from '../../utils/colorgyAPI';

import {
  doSyncUserCourses,
  doLoadTableCourses,
  doRemoveCourse
} from '../../actions/tableActions';

import TitleBarScrollView from '../../components/TitleBarScrollView';
import TitleBarIconButton from '../../components/TitleBarIconButton';
import UserAvatar from '../../components/UserAvatar';

import courseDatabase from '../../databases/courseDatabase';

var deviceWidth = Dimensions.get('window').width;

var CoursePageContainer = React.createClass({

  getInitialState() {
    return {
      classmateIdsLoading: LOADING_STATE.PENDING
    };
  },

  componentWillMount() {
    if (!this._getCourse()) this._fetchCourseData();
    if (this.props.networkConnectivity) this._fetchOnlineData();
  },

  componentWillReceiveProps(nextProps) {
    if (!this.props.networkConnectivity && nextProps.networkConnectivity) {
      this._fetchOnlineData();
    }
  },

  _fetchCourseData() {
    var { orgCode, courseCode } = this.props;

    courseDatabase.findCourses(orgCode, courseCode).then((courses) => {
      var course = courses[courseCode];

      this.setState({ course });
    });

  },

  _fetchOnlineData() {
    var { orgCode, courseCode } = this.props;
    var course = this._getCourse();
    if (course) {
      orgCode = course.organization_code;
      courseCode = course.code;
    }

    this.setState({ classmateIdsLoading: LOADING_STATE.LOADING });

    colorgyAPI.fetch(`/v1/user_courses.json?filter[organization_code]=${orgCode}&filter[course_code]=${courseCode}`).then((response) => {
      if (parseInt(response.status / 100) !== 2) {
        throw response.status;
      }

      return response.json();
    }).then((json) => {
      var classmateIds = json.map((data) => (data.user_id));
      this.setState({
        classmateIds,
        classmateIdsLoading: LOADING_STATE.DONE
      });

    }).catch((e) => {
      this.setState({ classmateIdsLoading: LOADING_STATE.ERROR });
      console.error(e)
    });
  },

  _getCourse() {
    return (this.props.course || this.state.course);
  },

  _handleBack() {
    this.props.navigator.pop();
  },

  _handleUserPress(payload) {
    this.props.navigator.push({ name: 'user', id: payload.userId });
  },

  render() {
    var course = this._getCourse();
    var { networkConnectivity, windowWidth } = this.props;
    var { classmateIds } = this.state;

    if (course) {
      return (
        <TitleBarScrollView
          enableOffsetTop={this.props.translucentStatusBar}
          offsetTop={this.props.statusBarHeight}
          title={course.name}
          leftAction={
            <TitleBarIconButton
              onPress={this._handleBack}
              icon={require('../../assets/images/icon_arrow_back_white.png')}
            />
          }
          background={<View>
            <Image source={require('../../assets/images/bg_1.jpg')} style={{ width: deviceWidth }} />
          </View>}
        >
          <View style={[styles.container]}>
            <View style={styles.infoBlock}>
              <View style={styles.infoBox}>
                <Image style={styles.infoBoxIcon} source={require('../../assets/images/icon_lecturer_grey.png')} />
                <Text>{course.lecturer}</Text>
              </View>
              <View style={styles.infoBox}>
                <Image style={styles.infoBoxIcon} source={require('../../assets/images/icon_code_grey.png')} />
                <Text>{course.code}</Text>
              </View>
              <View style={styles.infoBox}>
                <Image style={styles.infoBoxIcon} source={require('../../assets/images/icon_credit_grey.png')} />
                <Text>{course.credits} 學分</Text>
              </View>
              <View style={styles.infoBox}>
                <Image style={styles.infoBoxIcon} source={require('../../assets/images/icon_time_grey.png')} />
                <Text>{course.timeLocations}</Text>
              </View>
            </View>
            <View style={styles.classmates}>
              {(() => {
                switch (this.state.classmateIdsLoading) {
                  case LOADING_STATE.ERROR:
                      return (
                        <View>
                          {/* TODO */}
                        </View>
                      );
                    break;
                  case LOADING_STATE.DONE:
                    return (
                      classmateIds.map((userId) => <UserAvatar
                        key={userId}
                        userId={userId}
                        onPress={this._handleUserPress}
                        style={{
                          width: windowWidth / 5 * 0.8,
                          height: windowWidth / 5 * 0.8,
                          margin: windowWidth / 5 * 0.1,
                          borderRadius: 1000,
                          backgroundColor: '#BBBBBB'
                        }}
                      />)
                    );
                    break;
                  case LOADING_STATE.PENDING:
                  case LOADING_STATE.LOADING:
                    if (networkConnectivity) {
                      return (
                        <View>
                          {/* TODO */}
                        </View>
                      );
                    } else {
                      return (
                        <View>
                          {/* TODO */}
                        </View>
                      );
                    }
                    break;
                }
              })()}
            </View>
          </View>
        </TitleBarScrollView>
      );
    } else {
      return (
        <Text>Loading</Text>
      );
    }
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
    marginTop: 120
  },
  infoBlock: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderBottomWidth: 2,
    borderBottomColor: '#FAF7F5',
    backgroundColor: 'white'
  },
  infoBox: {
    width: (deviceWidth / 2),
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoBoxIcon: {
    width: 20,
    height: 20,
    marginRight: 8
  },
  menu: {
    backgroundColor: 'white',
    marginTop: 10
  },
  classmates: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
});

export default connect((state) => ({
  tableStatus: state.table.tableStatus,
  userId: state.colorgyAPI.me && state.colorgyAPI.me.id,
  organizationCode: state.colorgyAPI.me && state.colorgyAPI.me.possibleOrganizationCode,
  courses: state.table.tableCourses,
  networkConnectivity: state.deviceInfo.networkConnectivity,
  windowWidth: state.deviceInfo.windowWidth,
  translucentStatusBar: state.deviceInfo.translucentStatusBar,
  statusBarHeight: state.deviceInfo.statusBarHeight
}))(CoursePageContainer);
