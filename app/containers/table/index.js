import React, {
  Navigator,
  ProgressBarAndroid
} from 'react-native';
import { connect } from 'react-redux/native';

import Text from '../../components/Text';
import TitleBarView from '../../components/TitleBarView';

import TableContainer from './TableContainer';
import CoursePageContainer from './CoursePageContainer';
import EditCourseContainer from './EditCourseContainer';
import AddCourseContainer from './AddCourseContainer';
import UserPageContainer from '../UserPageContainer';

import { doLoadCourseDatabase, doSyncUserCourses } from '../../actions/tableActions';

var Table = React.createClass({

  componentWillMount() {
    this.props.dispatch(doLoadCourseDatabase(this.props.organizationCode));

    if (this.props.networkConnectivity) {
      this.props.dispatch(doSyncUserCourses(this.props.userId, this.props.organizationCode));
    }
  },

  render() {
    if (this.props.courseDatabaseUpdatedTime &&
        this.props.courseDatabaseUpdatedTime[this.props.organizationCode]) {
      return (
        <Navigator
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
              case 'user':
                return (
                  <UserPageContainer userId={route.id} navigator={navigator} />
                );
                break;
            }
          }}
          configureScene={(route) => {
            switch(route.name) {
              case 'index':
              case 'editCourse':
              case 'addCourse':
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
        <TitleBarView
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
        </TitleBarView>
      );
    }
  }
});

export default connect((state) => ({
  userId: state.colorgyAPI.me && state.colorgyAPI.me.id,
  organizationCode: state.colorgyAPI.me && state.colorgyAPI.me.possibleOrganizationCode,
  courseDatabaseUpdatedTime: state.table.courseDatabaseUpdatedTime,
  courseDatabaseLoadingProgress: state.table.courseDatabaseLoadingProgress,
  networkConnectivity: state.deviceInfo.networkConnectivity,
  translucentStatusBar: state.deviceInfo.translucentStatusBar,
  statusBarHeight: state.deviceInfo.statusBarHeight
}))(Table);
