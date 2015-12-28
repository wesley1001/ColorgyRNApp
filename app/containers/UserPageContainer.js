import React, {
  InteractionManager,
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableNativeFeedback
} from 'react-native';
import { connect } from 'react-redux/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import _ from 'underscore';

import LOADING_STATE from '../constants/LOADING_STATE';
import THEME from '../constants/THEME';

import courseDatabase from '../databases/courseDatabase';

import Text from '../components/Text';
import TitleBarScrollView from '../components/TitleBarScrollView';
import TitleBarActionIcon from '../components/TitleBarActionIcon';
import ScrollableTabView from '../components/ScrollableTabView';
import CourseTable from '../components/CourseTable';
import FadeInView from '../components/FadeInView';

var UserPageContainer = React.createClass({

  getInitialState() {
    return {
      loading: LOADING_STATE.PENDING
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

    }).catch((e) => {
      this.setState({ loading: LOADING_STATE.ERROR });
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

      }).catch((e) => {
        console.error(e);
        reject(e);
      });
    });

    Promise.all([fetchData, fetchCourse]).then(() => {
      this.setState({ loading: LOADING_STATE.DONE });
    }).catch((e) => {
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
    var user = this._getUser();

    if (user) {
      return (
        <TitleBarScrollView
          enableOffsetTop={this.props.translucentStatusBar}
          offsetTop={this.props.statusBarHeight}
          style={[this.props.style, { backgroundColor: THEME.BACKGROUND_COLOR }]}
          title={user.name}
          leftAction={
            <TitleBarActionIcon onPress={this._handleBack}>
              <Icon name="arrow-back" size={24} color="#FFFFFF" />
            </TitleBarActionIcon>
          }
          background={<View style={{ backgroundColor: '#333333', height: 450 }}>
            {(() => {
              if (user.cover_photo_url) {
                return (
                  <Image
                    source={user.cover_photo_url ? { uri: user.cover_photo_url } : require('../assets/images/defaults/users/cover_photo.jpg')}
                    style={{
                      width: this.props.deviceWidth,
                      height: 450,
                      opacity: 0.8
                    }}
                  />
                );
              }
            })()}
          </View>}
          hideTitleInitially={true}
        >
          <View style={styles.container}>
            <LinearGradient
              colors={['#00000000', '#00000077', '#000000AA']}
              style={{
                position: 'absolute',
                top: 60,
                left: 0,
                right: 0,
                height: 400
              }}
            />
            <FadeInView>
              <View style={styles.head}>
                <View style={styles.headBackground} />
                <Image
                  style={styles.headAvatar}
                  source={user.avatar_url ? { uri: user.avatar_url } : require('../assets/images/defaults/users/avatar.jpg')}
                />
                <View style={styles.headInfo}>
                  <View style={styles.headName}>
                    <Text style={styles.headNameText}>{user.name}</Text>
                  </View>
                  <View style={styles.headData}>
                  </View>
                </View>
              </View>
            </FadeInView>

            <View style={styles.containerBackground} />

            {(() => {
              switch (this.state.loading) {
                case LOADING_STATE.DONE:
                  return (
                    <FadeInView>
                      <ScrollableTabView
                        autoHeight={true}
                        edgeHitWidth={1200}
                        color="#FFFFFF"
                        backgroundColor="transparent"
                        activeColor="#FFFFFFAA"
                        style={{ marginHorizontal: 0, height: 60 }}
                        tabUnderlineStyle={{ height: 4 }}
                        textStyle={{ fontSize: 16 }}
                      >
                        <View tabLabel="課表">
                          <View style={styles.card}>
                            {(() => {
                              var { courses, periodData } = this.state;
                              if (courses && periodData) {
                                return (
                                  <CourseTable
                                    width={this.props.windowWidth - 32 - 4}
                                    height={720}
                                    style={{ marginRight: 4 }}
                                    courses={courses}
                                    periodData={periodData}
                                    onCoursePress={this._handleCoursePress}
                                  />
                                );
                              }
                            })()}
                          </View>
                        </View>
                        <View tabLabel="基本資料">
                          <View style={styles.card}>
                            <Text>{user.cover_photo_url}</Text>
                            <Text style={{ fontSize: 24 }}>{JSON.stringify(user, null, 2)}</Text>
                          </View>
                        </View>
                      </ScrollableTabView>
                    </FadeInView>
                  );
                  break;
                default:
                  return (
                    <View
                      style={[styles.card, {
                        marginTop: 76,
                        height: 200
                      }]}
                    >
                    </View>
                  );
              }
            })()}
          </View>
        </TitleBarScrollView>
      );
    } else {
      return (
        <TitleBarScrollView
          enableOffsetTop={this.props.translucentStatusBar}
          offsetTop={this.props.statusBarHeight}
          style={[this.props.style, { backgroundColor: THEME.BACKGROUND_COLOR }]}
          title={''}
          leftAction={
            <TitleBarActionIcon onPress={this._handleBack}>
              <Icon name="arrow-back" size={24} color="#FFFFFF" />
            </TitleBarActionIcon>
          }
          background={<View style={{ backgroundColor: '#333333', height: 450 }}>
          </View>}
          hideTitleInitially={true}
        >
          <View style={styles.container}>
            <View style={styles.head}>
              <View style={styles.headBackground} />
              <Image
                style={styles.headAvatar}
              />
              <View style={styles.headInfo}>
                <View style={styles.headName}>
                  <Text style={styles.headNameText}>{' '}</Text>
                </View>
                <View style={styles.headData}>
                </View>
              </View>
            </View>

            <View style={styles.containerBackground} />

            <View
              style={[styles.card, {
                marginTop: 76,
                height: 200
              }]}
            >
            </View>
          </View>
        </TitleBarScrollView>
      );
    }
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerBackground: {
    position: 'absolute',
    backgroundColor: THEME.BACKGROUND_COLOR,
    top: 380,
    left: 0,
    right: 0,
    bottom: 0
  },
  head: {
    marginTop: 80,
    height: 180,
    flexDirection: 'column',
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 0,
    backgroundColor: THEME.BACKGROUND_COLOR
  },
  headAvatar: {
    margin: 4,
    height: 120,
    width: 120,
    borderRadius: 120,
    borderWidth: 4,
    borderColor: '#FFFFFF'
  },
  headInfo: {
    flexDirection: 'column'
  },
  headName: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 4
  },
  headNameText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700'
  },
  headData: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 0
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 12,
    elevation: 3
  }
});

export default connect((state) => ({
  networkConnectivity: state.deviceInfo.networkConnectivity,
  windowWidth: state.deviceInfo.windowWidth,
  translucentStatusBar: state.deviceInfo.translucentStatusBar,
  statusBarHeight: state.deviceInfo.statusBarHeight
}))(UserPageContainer);
