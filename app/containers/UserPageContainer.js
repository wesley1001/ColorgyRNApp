import React, {
  InteractionManager,
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableNativeFeedback
} from 'react-native';
import { connect } from 'react-redux/native';

import _ from 'underscore';

import LOADING_STATE from '../constants/LOADING_STATE';
import THEME from '../constants/THEME';

import ga from '../utils/ga';

import courseDatabase from '../databases/courseDatabase';

import UserPage from '../components/UserPage';

var UserPageContainer = React.createClass({

  getInitialState() {
    return {
      loading: LOADING_STATE.PENDING,
      loadingStartedAt: (new Date()).getTime()
    };
  },

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this._fetchUserData();
    });
  },

  _getUserId() {
    return (this.props.user && this.props.user.id || this.props.userId || this.state.user && this.state.user.id);
  },

  _getUser() {
    return (this.state.user || this.props.user);
  },

  _fetchUserData() {
    this.setState({ loading: LOADING_STATE.LOADING });

    var fetchData = colorgyAPI.fetch(`/v1/users/${this._getUserId()}.json`).then((response) => {
      if (parseInt(response.status / 100) !== 2) {
        throw response.status;
      }

      return response.json();
    }).then((json) => {
      var user = json;
      this.setState({ user });
    });

    var fetchUserSettings = colorgyAPI.fetch(`/v1/user_table_settings/${this._getUserId()}.json`).then((response) => {
      if (parseInt(response.status) === 404) {

      } else if (parseInt(response.status / 100) !== 2) {
        throw response.status;
      } else {
        return response.json();
      }
    }).then((json) => {
      this.setState({ userSettings: { table: json } });
    });

    var fetchCourse = new Promise((resolve, reject) => {
      colorgyAPI.fetch(`/v1/user_courses.json?filter[user_id]=${this._getUserId()}&filter[year]=${colorgyAPI.getCurrentYear()}&filter[term]=${colorgyAPI.getCurrentTerm()}`).then((response) => {
        if (parseInt(response.status / 100) !== 2) {
          throw [response.status, `/v1/users/user_courses.json?filter[user_id]=${this._getUserId()}&filter[year]=${colorgyAPI.getCurrentYear()}&filter[term]=${colorgyAPI.getCurrentTerm()}`];
        }

        return response.json();
      }).then((json) => {
        var userCourses = json;

        if (userCourses.length > 0) {
          var courseOrg = userCourses[0].course_organization_code;
          var courseCodes = userCourses.map((uc) => uc.course_code);

          return colorgyAPI.fetch(`/v1/${courseOrg.toLowerCase()}/period_data.json`).then((response) => {
            if (parseInt(response.status / 100) !== 2) {
              throw [response.status, `/v1/${courseOrg.toLowerCase()}/period_data.json`];
            }

            return response.json();

          }).then((json) => {
            var periodDataArray = json;

            if (periodDataArray.length > 0) {
              var periodData = periodDataArray.reduce((obj, data, i) => {
                obj[data['order']] = data;
                return obj;
              }, {});

              return colorgyAPI.fetch(`/v1/${courseOrg.toLowerCase()}/courses/${courseCodes.join(',')}.json`).then((response) => {
                if (parseInt(response.status / 100) !== 2) {
                  throw [response.status, `/v1/${courseOrg.toLowerCase()}/courses/${courseCodes.join(',')}.json`];
                }

                return response.json();
              }).then((json) => {
                var coursesArray = json;

                if (coursesArray.length > 0) {

                  var courses = courseDatabase.parseCourseRows(coursesArray, periodData);

                  this.setState({
                    courses,
                    periodData
                  });
                }

                resolve();

              }).catch((e) => {
                console.error(e);
                reject(e);
              });
            }

          }).catch((e) => {
            console.error(e);
            reject(e);
          });
        } else {
          resolve();
        }

      });
    });

    Promise.all([fetchData, fetchUserSettings, fetchCourse]).then(() => {
      this.setState({ loading: LOADING_STATE.DONE });
      var loadingTime = (new Date()).getTime() - this.state.loadingStartedAt;
      ga.sendTiming('PageLoad', loadingTime, 'UserPageLoad', 'page-load');

    }).catch((e) => {
      console.error(e);
      this.setState({ loading: LOADING_STATE.ERROR });
    });
  },

  _handleBack() {
    this.props.navigator.pop();
  },

  _handleCoursePress(payload) {
    this.props.navigator.push({ name: 'course', code: payload.courseCode });
  },

  render() {
    return (
      <UserPage
        user={this._getUser()}
        userSettings={this.state.userSettings}
        userCourses={this.state.courses}
        periodData={this.state.periodData}
        translucentStatusBar={this.props.translucentStatusBar}
        statusBarHeight={this.props.statusBarHeight}
        windowWidth={this.props.windowWidth}
        userLoading={this.state.loading}
        handleBack={this._handleBack}
        handleCoursePress={this._handleCoursePress}
      />
    );
  }
});

export default connect((state) => ({
  networkConnectivity: state.deviceInfo.networkConnectivity,
  windowWidth: state.deviceInfo.windowWidth,
  translucentStatusBar: state.deviceInfo.translucentStatusBar,
  statusBarHeight: state.deviceInfo.statusBarHeight
}))(UserPageContainer);
