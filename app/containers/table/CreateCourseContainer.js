import React, {
  InteractionManager,
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableNativeFeedback
} from 'react-native';
import { connect } from 'react-redux/native';
import _ from 'underscore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modalbox';
import WheelView from 'react-native-wheel';

import THEME from '../../constants/THEME';

import courseDatabase from '../../databases/courseDatabase';
import colorgyAPI from '../../utils/colorgyAPI';

import { setOverlayElement } from '../../actions/appActions';
import { doCreateAndAddCourse } from '../../actions/tableActions';

import Text from '../../components/Text';
import TextInput from '../../components/TextInput';
import TitleBarLayout from '../../components/TitleBarLayout';
import GhostButton from '../../components/GhostButton';
import Button from '../../components/Button';

import {
  doLoadTableCourses,
  doAddCourse,
  doRemoveCourse,
  doSyncUserCourses
} from '../../actions/tableActions';

var CourseTimeBlock = React.createClass({
  weekDayTexts: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],

  getInitialState() {
    return {
      periodSelectWheelKey: 1000
    };
  },

  _openDatePeriodSelectModel() {
    this._setDatePeriodSelectModel();
  },

  _setDatePeriodSelectModel() {
    var periodCodes = _.toArray(this.props.periodData).map((d) => d.code);

    this.props.onSetOverlayElement(
      <Modal
        ref={(m) => {
          this.selectModel = m;
          if (m) m.open();
        }}
        swipeToClose={false}
        style={styles.timeSelectionModal}
      >
        <View style={styles.timeSelectionModalHead}>
          <Text style={styles.timeSelectionModalHeadText}>選擇課程節次</Text>
          <Button
            type="small"
            value="完成"
            onPress={() => {
              if (this.selectModel) this.selectModel.close();
            }}
          />
        </View>
        <View style={styles.timeSelectionModalContentSelectWheels}>
          <WheelView
            style={styles.timeSelectionModalContentSelectWheel}
            values={this.weekDayTexts}
            onItemChange={this.props.onDayChange}
            isLoop={false}
            textSize={20}
            selectedIndex={this.props.day}
          />
          <WheelView
            key={this.state.periodSelectWheelKey * 1}
            style={styles.timeSelectionModalContentSelectWheel}
            values={periodCodes.map((code) => `第 ${code} 節`)}
            onItemChange={(i) => { if (!this.state.changingWheel) this._handlePeriodStartChange(i + 1); }}
            isLoop={false}
            textSize={20}
            selectedIndex={this.props.periodStart - 1}
          />
          <WheelView
            key={this.state.periodSelectWheelKey * 2}
            style={styles.timeSelectionModalContentSelectWheel}
            values={periodCodes.map((code) => `到第 ${code} 節`)}
            onItemChange={(i) => { if (!this.state.changingWheel) this._handlePeriodEndChange(i + 1); }}
            isLoop={false}
            textSize={20}
            selectedIndex={this.props.periodEnd - 1}
          />
        </View>
      </Modal>
    );
  },

  _handlePeriodStartChange(ps) {
    this.props.onPeriodStartChange(ps);

    if (ps > this.props.periodEnd) {
      this.props.onPeriodEndChange(ps);
      this.setState({ periodSelectWheelKey: this.state.periodSelectWheelKey + 1 });
      this._setDatePeriodSelectModel();
    }
  },

  _handlePeriodEndChange(pe) {
    this.props.onPeriodEndChange(pe);

    if (pe < this.props.periodStart) {
      this.props.onPeriodStartChange(pe);
      this.setState({ periodSelectWheelKey: this.state.periodSelectWheelKey + 1 });
      this._setDatePeriodSelectModel();
    }
  },

  render() {
    var periodDesc = '';
    if (this.props.periodStart === this.props.periodEnd) {
      var period = this.props.periodData[this.props.periodStart.toString()];
      var periodCode = period && period.code;
      periodDesc = `第 ${periodCode} 節`;
    } else {
      var periodStart = this.props.periodData[this.props.periodStart.toString()];
      var periodStartCode = periodStart && periodStart.code;
      var periodEnd = this.props.periodData[this.props.periodEnd.toString()];
      var periodEndCode = periodEnd && periodEnd.code;
      periodDesc = `第 ${periodStartCode} 節到第 ${periodEndCode} 節`;
    }

    return (
      <View style={this.props.style}>
        <TextInput
          placeholder="上課地點"
          defaultValue={this.props.location}
          onChangeText={this.props.onLocationChange}
        />
        <TouchableOpacity
          onPress={this._openDatePeriodSelectModel}
        >
          <View style={{
            borderBottomWidth: 2,
            borderBottomColor: '#737373',

          }}>
            <Text>{`${this.weekDayTexts[this.props.day]} 的 ${periodDesc}`}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
});

var CreateCourseContainer = React.createClass({

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      courseName: this.props.courseName,
      courseLecturer: null,
      courseTimes: [this._getInitialCourseTime()]
    };
  },

  componentWillUnmount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch(doSyncUserCourses(this.props.userId, this.props.organizationCode));
    });
  },

  _handleBack() {
    this.props.navigator.pop();
  },

  _handleCourseTimeChange(index, data) {
    var courseTimes = this.state.courseTimes;
    var oldCourseTime = courseTimes[index] || {};
    var courseTime = {
      ...oldCourseTime,
      ...data
    };
    courseTimes[index] = courseTime;
    this.setState({ courseTimes });
  },

  _getInitialCourseTime() {
    return {
      location: '',
      day: 1,
      periodStart: 1,
      periodEnd: 1
    };
  },

  _addCourseTime() {
    var courseTimes = this.state.courseTimes;
    courseTimes.push(this._getInitialCourseTime());
    this.setState({ courseTimes });
  },

  _deleteCourseTime(i) {
    var courseTimes = this.state.courseTimes;
    courseTimes.pop(i);
    this.setState({ courseTimes });
  },

  _handleSave() {
    this.setState({ saving: true });

    var course = {};
    course.name = this.state.courseName;
    course.lecturer = this.state.courseLecturer;
    course.year = colorgyAPI.getCurrentYear();
    course.term = colorgyAPI.getCurrentTerm();

    var courseTimeIndex = 1;

    _.each(this.state.courseTimes, (courseTime) => {
      for (let i=courseTime.periodStart; i<=courseTime.periodEnd; i++) {
        course[`day_${courseTimeIndex}`] = courseTime.day;
        course[`period_${courseTimeIndex}`] = i;
        course[`loaction_${courseTimeIndex}`] = courseTime.location;
        courseTimeIndex++;
      }
    });

    this.props.dispatch(doCreateAndAddCourse(this.props.userId, this.props.organizationCode, course, () => {
      this.setState({ saving: false });
      this.props.navigator.pop();
    }, () => {
      this.setState({ saving: false });
    }));
  },

  render() {

    return (
      <TitleBarLayout
        enableOffsetTop={this.props.translucentStatusBar}
        offsetTop={this.props.statusBarHeight}
        style={this.props.style}
        contentContainerStyle={styles.container}
        title="手動建立課程"
        actions={[
          { title: '返回', icon: require('../../assets/images/icon_arrow_back_white.png'), onPress: this._handleBack, show: 'always' },
          { title: '儲存', icon: require('../../assets/images/icon_arrow_back_white.png'), onPress: this._handleSave, show: 'always' },
        ]}
      >
        <ScrollView>
          <View style={{ backgroundColor: 'white', padding: 12 }}>
            <TextInput
              placeholder="課程名稱"
              onChangeText={(t) => this.setState({ courseName: t })}
              value={this.state.courseName}
            />
            <TextInput
              placeholder="教師姓名"
              onChangeText={(t) => this.setState({ courseLecturer: t })}
              value={this.state.courseLecturer}
            />
          </View>
          {(() => {
            return this.state.courseTimes.map((courseTime, i, courseTimes) => {
              return (
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <CourseTimeBlock
                    style={{
                      flex: 1,
                      marginLeft: 12
                    }}
                    key={i}
                    onSetOverlayElement={(element) => {
                      this.props.dispatch(setOverlayElement(element))
                    }}
                    periodData={this.props.periodData}
                    location={courseTime.location}
                    day={courseTime.day}
                    periodStart={courseTime.periodStart}
                    periodEnd={courseTime.periodEnd}
                    onLocationChange={(location) => this._handleCourseTimeChange(i, { location })}
                    onDayChange={(day) => this._handleCourseTimeChange(i, { day })}
                    onPeriodStartChange={(periodStart) => this._handleCourseTimeChange(i, { periodStart })}
                    onPeriodEndChange={(periodEnd) => this._handleCourseTimeChange(i, { periodEnd })}
                  />
                  <TouchableOpacity
                    style={{
                      width: 40,
                      height: 40,
                      marginLeft: 12,
                    }}
                    onPress={() => {
                      if (courseTimes.length > 1) this._deleteCourseTime(i)
                    }}
                  >
                    <Icon
                      name="clear"
                      size={30}
                      color={(courseTimes.length > 1) ? '#999999' : 'transparent'}
                    />
                  </TouchableOpacity>
                </View>
              );
            });
          })()}
          <Button
            value="新增上課時間"
            onPress={this._addCourseTime}
            style={styles.addCourseTimeButton}
          />
          <Button
            value="Save"
            onPress={this._handleSave}
            style={styles.addCourseTimeButton}
          />
          <Text>{JSON.stringify(this.state, null, 2)}</Text>
        </ScrollView>
      </TitleBarLayout>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.backgroundColor
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingLeft: 12,
    paddingRight: 12
  },
  manuallyCreateCourseButton: {
    margin: 12
  },
  timeSelectionModal: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    height: 395,
    elevation: 24
  },
  timeSelectionModalHead: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  timeSelectionModalHeadText: {
    flex: 10
  },
  timeSelectionModalContentSelectWheels: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  timeSelectionModalContentSelectWheel: {
    flex: 1
  },
  addCourseTimeButton: {
    marginVertical: 16,
    marginHorizontal: 16
  }
});

export default connect((state) => ({
  tableStatus: state.table.tableStatus,
  userId: state.colorgyAPI.me && state.colorgyAPI.me.id,
  organizationCode: state.colorgyAPI.me && state.colorgyAPI.me.possibleOrganizationCode,
  periodData: state.table.tablePeriodData,
  networkConnectivity: state.deviceInfo.networkConnectivity,
  translucentStatusBar: state.deviceInfo.translucentStatusBar,
  statusBarHeight: state.deviceInfo.statusBarHeight
}))(CreateCourseContainer);
