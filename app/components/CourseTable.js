import React, {
  Dimensions,
  StyleSheet,
  Animated,
  View,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';

import THEME from '../constants/THEME';
import Text from './Text';

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;
let cellPadding = 2;
let headColumnWidth = 40;
let columnWidth = (deviceWidth - headColumnWidth) / 5;
let headRowHeight = 40;
let rowMinHeight = deviceHeight / 10;
let rowHeight = rowMinHeight;

let CourseTable = React.createClass({
  propTypes: {
    courses: React.PropTypes.object.isRequired,
    periodData: React.PropTypes.object.isRequired,
    onCoursePress: React.PropTypes.func.isRequired
  },

  getDefaultProps() {
    return {
      courses: {},
      coursesTimeIndex: {},
      periodData: {}
    };
  },

  getInitialState() {
    return {
      scrollX: (new Animated.Value(0))
    };
  },

  _handleCoursePress(payload) {
    if (this.props.onCoursePress) {
      this.props.onCoursePress(payload);
    }
  },

  render() {
    var { courses, periodData } = this.props;
    var periodDataOrders = Object.keys(periodData);

    var coursesTimeIndex = {};

    for (let courseCode in courses) {
      let course = courses[courseCode];
      for (let i=1; i<=10; i++) {
        if (course[`day_${i}`] && course[`period_${i}`]) {
          let day = course[`day_${i}`];
          let period = course[`period_${i}`];
          if (!coursesTimeIndex[`${day}-${period}`]) coursesTimeIndex[`${day}-${period}`] = [];
          coursesTimeIndex[`${day}-${period}`].push({ code: course.code, number: i });
        }
      }
    }

    return (
      <View style={{ flex: 1 }}>
        <View style={[styles.headRow]}>
          <Animated.View
            style={[styles.headRow, { transform: [{
              translateX: this.state.scrollX.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -1]
              }),
            }] }]}
          >
            <Text style={[styles.headRowText, { marginLeft: headColumnWidth }]}>
              Mon
            </Text>
            <Text style={styles.headRowText}>
              Tue
            </Text>
            <Text style={styles.headRowText}>
              Wed
            </Text>
            <Text style={styles.headRowText}>
              Thu
            </Text>
            <Text style={styles.headRowText}>
              Fri
            </Text>
            <Text style={styles.headRowText}>
              Sat
            </Text>
            <Text style={styles.headRowText}>
              Sun
            </Text>
          </Animated.View>
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexDirection: 'row', paddingTop: -cellPadding, paddingBottom: -cellPadding, width: deviceWidth, height: rowHeight * (periodDataOrders.length || 10) }}
          >
            <View style={styles.headColumn}>
              {periodDataOrders.map((periodDataOrder) => {
                var period = periodData[periodDataOrder];
                return (
                  <View key={periodDataOrder} style={styles.headColumnMark}>
                    <Text style={styles.headColumnText}>
                      {period.code}
                    </Text>
                    {(() => {
                      if (period.time) {
                        return (
                          <Text style={styles.headColumnSmallText}>
                            {period.time.replace('-', '\n|\n')}
                          </Text>
                        );
                      }
                    })()}
                  </View>
                );
              })}
            </View>
            <ScrollView
              horizontal={true}
              contentContainerStyle={[styles.body, { flexDirection: 'row' }]}
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event([{
                nativeEvent: {
                  contentOffset: { x: this.state.scrollX }
                }
              }])}
            >
            <View style={styles.backgroundGrid}>
              {periodDataOrders.map((periodDataOrder) => {
                return (<View key={periodDataOrder} style={styles.backgroundGridRow} />);
              })}
            </View>

              {[1, 2, 3, 4, 5, 6, 7].map((day) => {

                return (
                  <View key={day} style={styles.column}>
                    {periodDataOrders.map((period) => {
                      return (
                        <View key={period} style={styles.cell}>
                          {(() => {
                            if (coursesTimeIndex[`${day}-${period}`]) {
                              let courseCode = coursesTimeIndex[`${day}-${period}`][0].code;
                              let courseNumber = coursesTimeIndex[`${day}-${period}`][0].number;
                              let course = courses[courseCode];

                              return (
                                <TouchableOpacity
                                  style={[styles.course, { backgroundColor: course.color }]}
                                  onPress={() => this._handleCoursePress({ courseCode: course.code })}
                                >
                                  <Text style={styles.courseText}>
                                    {course.name}
                                  </Text>
                                  {(() => {
                                    if (course[`location_${courseNumber}`]) return (
                                      <Text style={styles.courseText}>
                                        {course[`location_${courseNumber}`]}
                                      </Text>
                                    );
                                  })()}
                                  <Text style={styles.courseText}>
                                    {course.lecturer}
                                  </Text>
                                </TouchableOpacity>
                              );
                            }
                          })()}
                        </View>
                      );
                    })}
                  </View>
                );
              })}

            </ScrollView>
          </ScrollView>
        </View>
        <View style={{ position: 'absolute', width: headColumnWidth, height: headRowHeight, top: 0, left: 0, backgroundColor: 'white' }}></View>
      </View>
    );
  }
});

let styles = StyleSheet.create({
  headRow: {
    height: headRowHeight,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center'
  },
  headRowText: {
    width: columnWidth,
    textAlign: 'center'
  },
  headColumn: {
    width: headColumnWidth,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headColumnMark: {
    height: rowHeight,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headColumnText: {

  },
  headColumnSmallText: {
    fontSize: 10,
    textAlign: 'center'
  },
  head: {
    flexDirection: 'row'
  },
  body: {
    backgroundColor: 'white'
  },
  backgroundGrid: {
    position: 'absolute',
    left: cellPadding,
    right: 0,
    top: 0,
    bottom: 0
  },
  backgroundGridRow: {
    height: (rowHeight - cellPadding * 2),
    marginTop: cellPadding,
    marginBottom: cellPadding,
    width: 10000,
    backgroundColor: THEME.THEME_BACKGROUND_COLOR
  },
  column: {
    width: columnWidth
  },
  cell: {
    height: rowHeight,
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: cellPadding
  },
  course: {
    flex: 1,
    borderRadius: 3,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 2,
    paddingBottom: 2
  },
  courseText: {
    color: 'white'
  }
});

export default CourseTable;
