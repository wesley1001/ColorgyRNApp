import React, {
  Navigator,
  Text,
  ProgressBarAndroid
} from 'react-native';
import { connect } from 'react-redux/native';

import { doLoadCourseDatabase } from '../../actions/tableActions';

import TableContainer from './TableContainer';
import CoursePageContainer from './CoursePageContainer';
import EditCourseContainer from './EditCourseContainer';
import AddCourseContainer from './AddCourseContainer';
import UserPageContainer from '../UserPageContainer';

import TitleBarView from '../../components/TitleBarView';

var Table = React.createClass({

  componentWillMount() {
    this.props.dispatch(doLoadCourseDatabase(this.props.organizationCode));
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
                return Navigator.SceneConfigs.FloatFromBottomAndroid;
                break;
              default:
                return Navigator.SceneConfigs.HorizontalSwipeJump;
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
            alignItems: 'center'
          }}
        >
          <Text>資料準備中⋯⋯ {parseInt((this.props.courseDatabaseLoadingProgress || 0) * 100)}%</Text>
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
  translucentStatusBar: state.deviceInfo.translucentStatusBar,
  statusBarHeight: state.deviceInfo.statusBarHeight
}))(Table);
