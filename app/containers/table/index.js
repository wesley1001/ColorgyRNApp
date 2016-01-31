import React, {
  Navigator,
  ProgressBarAndroid
} from 'react-native';
import { connect } from 'react-redux/native';

import Text from '../../components/Text';
import TitleBarLayout from '../../components/TitleBarLayout';

import TableContainer from './TableContainer';
import CoursePageContainer from './CoursePageContainer';
import EditCourseContainer from './EditCourseContainer';
import AddCourseContainer from './AddCourseContainer';
import CreateCourseContainer from './CreateCourseContainer';
import UserPageContainer from '../UserPageContainer';
import FeedbackContainer from '../FeedbackContainer';

import { doLoadCourseDatabase, doSyncUserCourses } from '../../actions/tableActions';

import ga from '../../utils/ga';

var Table = React.createClass({

  componentWillMount() {
    this.props.dispatch(doLoadCourseDatabase(this.props.organizationCode));

    if (this.props.networkConnectivity) {
      this.props.dispatch(doSyncUserCourses(this.props.userId, this.props.organizationCode));
    }
  },

  componentDidMount() {
    // this.navigator.navigationContext.addListener('didfocus', (e) => {
    //   this._reportRouteUpdate();
    // });

    // this._reportRouteUpdate();
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.navigateBackCount !== this.props.navigateBackCount) {
      this.navigator.pop();
    } else if (nextProps.tabRePressCount !== this.props.tabRePressCount) {
      if (this.navigator) this.navigator.popToTop();
    }
  },

  _registerNavigator(navigator) {
    if (!navigator) return;
    this.navigator = navigator;

    navigator.navigationContext.addListener('didfocus', (e) => {
      this._reportRouteUpdate();
    });

    this._reportRouteUpdate();
  },

  _reportRouteUpdate() {
    var currentRouteStack = this.navigator.state.routeStack;
    var currentRoute = currentRouteStack[currentRouteStack.length - 1];
    var currentRouteString = JSON.stringify(currentRoute);

    ga.sendScreenView(`Table:${currentRouteString}`);
  },

  render() {
    if (this.props.courseDatabaseUpdatedTime &&
        this.props.courseDatabaseUpdatedTime[this.props.organizationCode]) {
      return (
        <Navigator
          ref={(navigator) => this._registerNavigator(navigator)}
          initialRoute={{ name: 'index' }}
          renderScene={(route, navigator) => {
            switch(route.name) {
              case 'index':
                return (
                  <TableContainer navigator={navigator} />
                );
                break;
              case 'course':
                return (
                  <CoursePageContainer courseCode={route.code} navigator={navigator} />
                );
                break;
              case 'editCourse':
                return (
                  <EditCourseContainer navigator={navigator} />
                );
                break;
              case 'addCourse':
                return (
                  <AddCourseContainer navigator={navigator} />
                );
                break;
              case 'createCourse':
                return (
                  <CreateCourseContainer navigator={navigator} courseName={route.courseName} />
                );
                break;
              case 'user':
                return (
                  <UserPageContainer userId={route.id} navigator={navigator} />
                );
                break;
              case 'feedback':
                return (
                  <FeedbackContainer navigator={navigator} />
                );
                break;
            }
          }}
          configureScene={(route) => {
            switch(route.name) {
              case 'index':
              case 'editCourse':
              case 'addCourse':
              case 'createCourse':
                return Navigator.SceneConfigs.FloatFromBottom;
                break;
              default:
                return Navigator.SceneConfigs.FloatFromRight;
                break;
            }
          }}
        />
      );

    } else {
      return (
        <TitleBarLayout
          title="Table"
          enableOffsetTop={this.props.translucentStatusBar}
          offsetTop={this.props.statusBarHeight}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'stretch',
            padding: 64
          }}
        >
          <ProgressBarAndroid
            styleAttr="Horizontal"
            indeterminate={!this.props.courseDatabaseLoadingProgress}
            progress={this.props.courseDatabaseLoadingProgress}
          />
          <Text style={{ textAlign: 'center' }}>正在為您下載課程資料，請稍候⋯⋯</Text>
        </TitleBarLayout>
      );
    }
  }
});

export default connect((state) => ({
  userId: state.colorgyAPI.me && state.colorgyAPI.me.id,
  organizationCode: state.colorgyAPI.me && state.colorgyAPI.me.possibleOrganizationCode,
  courseDatabaseUpdatedTime: state.table.courseDatabaseUpdatedTime,
  courseDatabaseLoadingProgress: state.table.courseDatabaseLoadingProgress,
  navigateBackCount: state.table.navigateBackCount,
  tabRePressCount: state.appTab.rePressCountOnTab['0'],
  networkConnectivity: state.deviceInfo.networkConnectivity,
  translucentStatusBar: state.deviceInfo.translucentStatusBar,
  statusBarHeight: state.deviceInfo.statusBarHeight
}))(Table);
