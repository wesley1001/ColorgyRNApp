import React, {
  PropTypes,
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

let CourseTable = React.createClass({
  propTypes: {
    courses: PropTypes.object.isRequired,
    periodData: PropTypes.object.isRequired,
    onCoursePress: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    scrollable: PropTypes.bool
  },

  getDefaultProps() {
    return {
      courses: {},
      coursesTimeIndex: {},
      periodData: {},
      scrollable: true
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

    var { width, height } = this.props;
    var cellPadding = 2;
    var headColumnWidth = 40;
    var columnWidth = (width - headColumnWidth) / 5;
    var headRowHeight = 40;
    var rowMinHeight = height / 10;
    var rowHeight = 72;
    if (rowHeight < rowMinHeight) rowHeight = rowMinHeight;

    if (!this.props.scrollable) {
      rowHeight = (height - headRowHeight) / periodDataOrders.length;
    }

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
      <View style={[{ flex: 1 }, this.props.style]}>
        <View style={[styles.headRow, { height: headRowHeight }]}>
          <Animated.View
            style={[styles.headRow, { height: headRowHeight, transform: [{
              translateX: this.state.scrollX.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -1]
              }),
            }] }]}
          >
            <Text style={[styles.headRowText, { width: columnWidth }, { marginLeft: headColumnWidth }]}>
              Mon
            </Text>
            <Text style={[styles.headRowText, { width: columnWidth }]}>
              Tue
            </Text>
            <Text style={[styles.headRowText, { width: columnWidth }]}>
              Wed
            </Text>
            <Text style={[styles.headRowText, { width: columnWidth }]}>
              Thu
            </Text>
            <Text style={[styles.headRowText, { width: columnWidth }]}>
              Fri
            </Text>
            <Text style={[styles.headRowText, { width: columnWidth }]}>
              Sat
            </Text>
            <Text style={[styles.headRowText, { width: columnWidth }]}>
              Sun
            </Text>
          </Animated.View>
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexDirection: 'row', paddingTop: -cellPadding, paddingBottom: -cellPadding, width: width, height: rowHeight * (periodDataOrders.length || 10) }}
          >
            <View style={[styles.headColumn, { width: headColumnWidth }]}>
              {periodDataOrders.map((periodDataOrder) => {
                var period = periodData[periodDataOrder];
                return (
                  <View key={periodDataOrder} style={[styles.headColumnMark, { height: rowHeight }]}>
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
            <View style={[styles.backgroundGrid, { left: cellPadding }]}>
              {periodDataOrders.map((periodDataOrder) => {
                return (<View key={periodDataOrder} style={[styles.backgroundGridRow, { height: (rowHeight - cellPadding * 2), marginTop: cellPadding, marginBottom: cellPadding }]} />);
              })}
            </View>

              {[1, 2, 3, 4, 5, 6, 7].map((day) => {

                return (
                  <View key={day} style={[styles.column, { width: columnWidth }]}>
                    {periodDataOrders.map((period) => {
                      return (
                        <View key={period} style={[styles.cell, { padding: cellPadding, height: rowHeight }]}>
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
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center'
  },
  headRowText: {
    textAlign: 'center'
  },
  headColumn: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headColumnMark: {
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
    right: 0,
    top: 0,
    bottom: 0
  },
  backgroundGridRow: {
    width: 10000,
    backgroundColor: THEME.THEME_BACKGROUND_COLOR
  },
  column: {
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'stretch'
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
    color: 'white',
    fontSize: 12,
    marginBottom: 4
  }
});

export default CourseTable;
