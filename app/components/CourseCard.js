import React, {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';

let CourseCard = React.createClass({
  propTypes: {
    course: React.PropTypes.object,
    onPress: React.PropTypes.func,
    actionName: React.PropTypes.string,
    onActionPress: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      course: {}
    };
  },

  render() {
    var course = this.props.course;

    var action = null;

    if (this.props.actionName && this.props.onActionPress) {
      action = (
        <TouchableOpacity
          style={{ borderWidth: 1, borderColor: '#F89680', borderRadius: 2, paddingTop: 2, paddingBottom: 2, paddingLeft: 8, paddingRight: 8 }}
          onPress={this.props.onActionPress}
        >
          <Text style={{ textAlign:'center', color:'#F89680' }}>
            {this.props.actionName}
          </Text>
        </TouchableOpacity>
      );
    }

    var Container = View;
    if (this.props.onPress) Container = TouchableOpacity;

    return (
      <Container style={styles.container} onPress={() => { this.props.onPress({ course: this.props.course, courseCode: this.props.course.code }) }}>
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
      </Container>
    );
  }
});

let styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 15,
    marginRight: 15,
    paddingTop: 4,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    borderLeftWidth: 2,
    borderLeftColor: '#50E3C2'
  },
  title: {
    paddingTop: 15,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  titleText: {
    fontSize: 20
  },
  detailsRow: {
    flexDirection: 'row'
  },
  detailsItem: {
    flex: 1,
    justifyContent: 'center'
  },
  detailsItemText: {
    textAlign: 'center'
  },
  detailsItemIcon: {
    alignItems: 'center',
    marginBottom: 8
  }
});

export default CourseCard;
