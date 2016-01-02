import React, {
  PropTypes,
  StyleSheet,
  Animated,
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

  getInitialState() {
    return {
      removed: false,
      removingOpacityValue: new Animated.Value(1)
    };
  },

  remove() {
    Animated.timing(this.state.removingOpacityValue, { toValue: 0, duration: 1000 }).start();
    setTimeout(() => { this.setState({ removed: true }); }, 1000);
  },

  render() {
    if (this.state.removed) return null;

    var course = this.props.course;

    var action = this.props.action;

    var Container = View;
    if (this.props.onPress) Container = TouchableNativeFeedback;

    return (
      <Animated.View style={{
        opacity: this.state.removingOpacityValue
      }}>
        <Container
          onPress={() => { this.props.onPress({ course: this.props.course, courseCode: this.props.course.code }) }}
        >
          <View
            style={[
              styles.container,
              { borderLeftColor: course.color }
            ]}
          >
            <View style={styles.title}>
              <Text style={styles.titleText}>{course.name}</Text>
              <View style={styles.actions}>{action}</View>
            </View>
            <View style={styles.detailsRow}>
              <View style={styles.detailsItem}>
                <View style={styles.detailsItemIcon}>
                  <Image
                    style={{ width: 18, height: 18 }}
                    source={require('../assets/images/icon_lecturer.png')}
                  />
                </View>
                <Text style={styles.detailsItemText}>{course.lecturer}</Text>
              </View>
              <View style={styles.detailsItem}>
                <View style={styles.detailsItemIcon}>
                  <Image
                    style={{ width: 18, height: 18 }}
                    source={require('../assets/images/icon_code.png')}
                  />
                </View>
                <Text style={styles.detailsItemText}>{course.code}</Text>
              </View>
              <View style={styles.detailsItem}>
                <View style={styles.detailsItemIcon}>
                  <Image
                    style={{ width: 18, height: 18 }}
                    source={require('../assets/images/icon_time.png')}
                  />
                </View>
                <Text style={styles.detailsItemText}>{course.times}</Text>
              </View>
            </View>
          </View>
        </Container>
      </Animated.View>
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
    flex: 1,
    fontSize: 18
  },
  actions: {
    width: 110,
    alignItems: 'flex-end'
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
