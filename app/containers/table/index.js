import React, {
  Navigator,
  Text,
  ProgressBarAndroid
} from 'react-native';
import { connect } from 'react-redux/native';

import { doLoadCourseDatabase } from '../../actions/tableActions';

import TableContainer from './TableContainer';
import EditCourseContainer from './EditCourseContainer';
import AddCourseContainer from './AddCourseContainer';

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
            }
          }}
          configureScene={(route) => {
            switch(route.name) {
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
          offsetTop={35}
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
  organizationCode: state.colorgyAPI.me && state.colorgyAPI.me.possibleOrganizationCode,
  courseDatabaseUpdatedTime: state.table.courseDatabaseUpdatedTime,
  courseDatabaseLoadingProgress: state.table.courseDatabaseLoadingProgress,
  translucentStatusBar: state.uiEnvironment.translucentStatusBar,
  statusBarHeight: state.uiEnvironment.statusBarHeight
}))(Table);
