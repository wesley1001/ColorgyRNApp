import React, {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableNativeFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import LOADING_STATE from '../constants/LOADING_STATE';
import THEME from '../constants/THEME';

import Text from './Text';
import TitleBarParallaxScrollingLayout from './TitleBarParallaxScrollingLayout';
import ScrollableTab from './ScrollableTab';
import CourseTable from './CourseTable';
import FadeInAnimation from './FadeInAnimation';

let UserPage = React.createClass({

  render() {
    // Data
    var { user, userSettings, userCourses, periodData } = this.props;
    // UI Props
    var { translucentStatusBar, statusBarHeight, windowWidth } = this.props;
    // UI State
    var { userLoading } = this.props;
    // Action Handlers
    var { handleBack, handleCoursePress } = this.props;

    if (user) {
      return (
        <TitleBarParallaxScrollingLayout
          enableOffsetTop={translucentStatusBar}
          offsetTop={statusBarHeight}
          style={{ backgroundColor: THEME.BACKGROUND_COLOR }}
          title={user.name}
          actions={[{ title: '返回', icon: require('../assets/images/icon_arrow_back_white.png'), onPress: handleBack, show: 'always' }]}
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
            <FadeInAnimation>
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
            </FadeInAnimation>

            <View style={styles.containerBackground} />

            {(() => {
              switch (userLoading) {
                case LOADING_STATE.DONE:
                  return (
                    <FadeInAnimation>
                      <ScrollableTab
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
                              if (userCourses && periodData && userSettings && userSettings.table && userSettings.table.courses_table_visibility) {
                                return (
                                  <CourseTable
                                    width={windowWidth - 32 - 4}
                                    height={720}
                                    style={{ marginRight: 4 }}
                                    courses={userCourses}
                                    periodData={periodData}
                                    onCoursePress={handleCoursePress}
                                  />
                                );
                              } else {
                                return (
                                  <View style={{ paddingVertical: 64, paddingHorizontal: 32, alignSelf: 'center' }}>
                                    <Text>無資料</Text>
                                  </View>
                                );
                              }
                            })()}
                          </View>
                        </View>
                        <View tabLabel="基本資料">
                          <View style={styles.card}>
                            <View style={{ paddingVertical: 64, paddingHorizontal: 32, alignSelf: 'center' }}>
                              <Text>無資料</Text>
                            </View>
                          </View>
                        </View>
                      </ScrollableTab>
                    </FadeInAnimation>
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
        </TitleBarParallaxScrollingLayout>
      );
    } else {
      return (
        <TitleBarParallaxScrollingLayout
          enableOffsetTop={translucentStatusBar}
          offsetTop={statusBarHeight}
          style={{ backgroundColor: THEME.BACKGROUND_COLOR }}
          title={''}
          actions={[{ title: '返回', icon: require('../assets/images/icon_arrow_back_white.png'), onPress: this._handleBack, show: 'always' }]}
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
        </TitleBarParallaxScrollingLayout>
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
    elevation: 3,
    justifyContent: 'center'
  }
});

export default UserPage;
