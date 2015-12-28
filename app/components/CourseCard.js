import React, {
  PropTypes,
  StyleSheet,
  View,
  TouchableOpacity,
  Image
} from 'react-native';

import THEME from '../constants/THEME';

import Text from './Text';
import TouchableNativeFeedback from './TouchableNativeFeedback';

let CourseCard = React.createClass({
  propTypes: {
    course: PropTypes.object,
    onPress: PropTypes.func,
    action: PropTypes.element
  },

  getDefaultProps() {
    return {
      course: {}
    };
  },

  render() {
    var course = this.props.course;

    var action = this.props.action;

    var Container = View;
    if (this.props.onPress) Container = TouchableNativeFeedback;

    return (
      <Container
        onPress={() => { this.props.onPress({ course: this.props.course, courseCode: this.props.course.code }) }}
      >
        <View style={[styles.container, { borderLeftColor: course.color }]}>
          <View style={styles.title}>
            <Text style={styles.titleText}>{course.name}</Text>
            {action}
          </View>
          <View style={styles.detailsRow}>
            <View style={styles.detailsItem}>
              <View style={styles.detailsItemIcon}>
                <Image
                  style={{ width: 18, height: 18 }}
                  source={require('../assets/images/icon_lecturer_grey.png')}
                />
              </View>
              <Text style={styles.detailsItemText}>{course.lecturer}</Text>
            </View>
            <View style={styles.detailsItem}>
              <View style={styles.detailsItemIcon}>
                <Image
                  style={{ width: 18, height: 18 }}
                  source={require('../assets/images/icon_code_grey.png')}
                />
              </View>
              <Text style={styles.detailsItemText}>{course.code}</Text>
            </View>
            <View style={styles.detailsItem}>
              <View style={styles.detailsItemIcon}>
                <Image
                  style={{ width: 18, height: 18 }}
                  source={require('../assets/images/icon_time_grey.png')}
                />
              </View>
              <Text style={styles.detailsItemText}>{course.times}</Text>
            </View>
          </View>
        </View>
      </Container>
    );
  }
});

let styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    margin: 5,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 15,
    paddingRight: 15,
    borderLeftWidth: 2,
    elevation: 2
  },
  title: {
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  titleText: {
    fontSize: 18
  },
  detailsRow: {
    flexDirection: 'row'
  },
  detailsItem: {
    flex: 1,
    justifyContent: 'center'
  },
  detailsItemText: {
    textAlign: 'center',
    fontSize: 12
  },
  detailsItemIcon: {
    alignItems: 'center',
    marginBottom: 8
  }
});

export default CourseCard;
