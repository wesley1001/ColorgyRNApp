import React, {
  Dimensions,
  StyleSheet,
  Animated,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;
let cellPadding = 3;
let headColumnWidth = 40;
let columnWidth = (deviceWidth - headColumnWidth) / 5;
let headRowHeight = 40;
let rowMinHeight = deviceHeight / 10;
let rowHeight = rowMinHeight;

let CourseTable = React.createClass({
  propTypes: {
    courses: React.PropTypes.object,
    coursesTimeIndex: React.PropTypes.object,
    periodData: React.PropTypes.object,
    onCoursePress: React.PropTypes.func
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
    var { courses, coursesTimeIndex, periodData } = this.props;
    var periodDataOrders = Object.keys(periodData);

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
            contentContainerStyle={{ flexDirection: 'row', paddingTop: -cellPadding, paddingBottom: -cellPadding }}
          >
            <View style={styles.headColumn}>
              {periodDataOrders.map((periodDataOrder) => {
                var period = periodData[periodDataOrder];
                return (
                  <View style={styles.headColumnMark}>
                    <Text style={styles.headColumnText}>
                      {period.code}
                    </Text>
                    <Text style={styles.headColumnSmallText}>
                      {period.time.replace('-', '\n|\n')}
                    </Text>
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
                return (<View style={styles.backgroundGridRow} />);
              })}
            </View>

              {[1, 2, 3, 4, 5, 6, 7].map((day) => {

                return (
                  <View style={styles.column}>
                    {periodDataOrders.map((period) => {
                      return (
                        <View style={styles.cell}>
                          {(() => {
                            if (coursesTimeIndex[`${day}-${period}`]) {
                              let courseCode = coursesTimeIndex[`${day}-${period}`][0].code;
                              let courseNumber = coursesTimeIndex[`${day}-${period}`][0].number;
                              let course = courses[courseCode];

                              return (
                                <TouchableOpacity
                                  style={styles.course}
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
    backgroundColor: '#F9F5F3'
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
    backgroundColor: 'red',
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
