import React, {
  Navigator
} from 'react-native';
import { connect } from 'react-redux/native';

import TableContainer from './TableContainer';
import EditCourseContainer from './EditCourseContainer';
import AddCourseContainer from './AddCourseContainer';

var Table = React.createClass({

  render: function() {
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
  }
});

export default connect((state) => ({
}))(Table);
