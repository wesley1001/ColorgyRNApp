import React, {
  PixelRatio,
  StyleSheet,
  View,
  Image,
  ScrollView,
  ToolbarAndroid,
  TouchableOpacity
} from 'react-native';
import {
  NestedScrollViewAndroid,
  TextInputLayoutAndroid
} from 'react-native-android-design-support';
import _ from 'underscore';
import stringHash from 'string-hash';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modalbox';
import WheelView from 'react-native-wheel';

import LOADING_STATE from '../constants/LOADING_STATE';
import THEME from '../constants/THEME';

import Text from './Text';
import TableCreateCoursePageLayoutAndroid from './TableCreateCoursePageLayoutAndroid';
import TextInput from './TextInput';
import Button from './Button';
import GhostButton from './GhostButton';

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
        position="bottom"
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
      <View style={[this.props.style, {}]}>
        <TouchableOpacity
          onPress={this._openDatePeriodSelectModel}
        >
          <View style={[styles.timeBolckInputBlock, {
            borderBottomWidth: 1,
            borderBottomColor: THEME.LIGHT_BORDER_COLOR
          }]}>
            <TextInput
              defaultValue={`${this.weekDayTexts[this.props.day]} 的 ${periodDesc}`}
              value={`${this.weekDayTexts[this.props.day]} 的 ${periodDesc}`}
              onChangeText={this.props.onLocationChange}
              underlineColorAndroid="transparent"
            />
          </View>
          <View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'transparent',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              paddingTop: 10
            }}
          >
            <Icon
              name="arrow-drop-down"
              size={30}
              color={THEME.DARK_TEXT_COLOR}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.timeBolckInputBlock}>
          <TextInput
            value={this.props.location}
            placeholder="上課地點"
            onChangeText={this.props.onLocationChange}
            underlineColorAndroid="transparent"
          />
        </View>
      </View>
    );
  }
});

let TableCreateCoursePage = React.createClass({
  getInitialState() {
    return {};
  },

  getDefaultProps() {
    return {
      courseName: '',
      courseLecturer: ''
    };
  },

  componentDidMount() {
  },

  render() {
    // Data
    var {
      periodData,
      courseName,
      courseLecturer,
      courseTimes
    } = this.props;
    // UI Props
    var { translucentStatusBar, statusBarHeight, windowWidth } = this.props;
    // UI State
    var { saving } = this.props;
    // Action Handlers
    var {
      handleSave,
      handleCourseNameChange,
      handleCourseLecturerChange,
      handleCourseTimeChange,
      handleAddCourseTime,
      handleDeleteCourseTime,
      handleBack,
      onSetOverlayElement
    } = this.props;

    var toolbarPaddingTop = translucentStatusBar ? statusBarHeight : 0;

    return (
      <TableCreateCoursePageLayoutAndroid
        style={{ flex: 1, backgroundColor: THEME.THEME_BACKGROUND_COLOR }}
        toolbarTitle={ (courseName && courseName.length > 0) ? courseName : '新課程' }
        toolbarTitleColor="#FFFFFFFF"
        toolbarExpandedTitleColor="#FFFFFF00"
        toolbarHeight={PixelRatio.getPixelSizeForLayoutSize(THEME.ANDROID_TITLE_BAR_HEIGHT + toolbarPaddingTop)}
        toolbarPaddingTop={PixelRatio.getPixelSizeForLayoutSize(toolbarPaddingTop)}
        contentScrimColor={THEME.DARK_GREY}
        onPrimaryInputTextChange={handleCourseNameChange}
        onSecondaryInputTextChange={handleCourseLecturerChange}
        primaryInputInitialValue={courseName}
        secondaryInputInitialValue={courseLecturer}
        primaryInputLabel="新課程名稱"
        secondaryInputLabel="教師名稱"
      >
        <NestedScrollViewAndroid
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingTop: 256 + 8, backgroundColor: THEME.THEME_BACKGROUND_COLOR }}
        >
          {(() => {
            return courseTimes.map((courseTime, i, courseTimes) => {
              var timeName = '上課時段';
              if (courseTimes.length > 1) {
                timeName = `上課時段 ${i + 1}`;
              }
              return (
                <View key={i}>
                  <Text
                    style={{
                      marginTop: 8,
                      marginLeft: 16,
                      fontSize: 12
                    }}
                  >
                    {timeName}
                  </Text>
                  <View
                    style={{
                      marginVertical: 8,
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#FFFFFF',
                      borderTopWidth: 1,
                      borderBottomWidth: 1,
                      borderTopColor: THEME.LIGHT_BORDER_COLOR,
                      borderBottomColor: THEME.LIGHT_BORDER_COLOR
                    }}
                  >
                    <CourseTimeBlock
                      style={{
                        flex: 1,
                        marginHorizontal: 16
                      }}
                      key={i}
                      onSetOverlayElement={onSetOverlayElement}
                      periodData={periodData}
                      location={courseTime.location}
                      day={courseTime.day}
                      periodStart={courseTime.periodStart}
                      periodEnd={courseTime.periodEnd}
                      onLocationChange={(location) => handleCourseTimeChange(i, { location })}
                      onDayChange={(day) => handleCourseTimeChange(i, { day })}
                      onPeriodStartChange={(periodStart) => handleCourseTimeChange(i, { periodStart })}
                      onPeriodEndChange={(periodEnd) => handleCourseTimeChange(i, { periodEnd })}
                    />
                    {(() => {
                      if (courseTimes.length > 1) {
                        return (
                          <TouchableOpacity
                            style={{
                              width: 40,
                              height: 40,
                              marginLeft: -2,
                              paddingRight: 8,
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}
                            onPress={() => {
                              if (courseTimes.length > 1) handleDeleteCourseTime(i);
                            }}
                          >
                            <View style={{
                              width: 24,
                              height: 24,
                              borderRadius: 24,
                              borderWidth: 1.2,
                              borderColor: THEME.LIGHT_GREY,
                              justifyContent: 'center',
                              alignItems: 'center',
                              opacity: 0.8
                            }}>
                              <Icon
                                name="clear"
                                size={18}
                                color={THEME.LIGHT_GREY}
                              />
                            </View>
                          </TouchableOpacity>
                        );
                      }
                    })()}
                  </View>
                </View>
              );
            });
          })()}
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <GhostButton
              value="新增上課時段"
              type="small"
              color={THEME.LIGHT_GREY}
              onPress={handleAddCourseTime}
              style={styles.addCourseTimeButton}
            />
          </View>
        </NestedScrollViewAndroid>
        <ToolbarAndroid
          navIcon={require('../assets/images/icon_arrow_back_white.png')}
          actions={[{ title: '取消並返回' }]}
        />
      </TableCreateCoursePageLayoutAndroid>
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
  timeBolckInputBlock: {
    height: 52,
    justifyContent: 'center'
  },
  timeSelectionModal: {
    height: 270,
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
    width: 180,
    marginVertical: 32,
    marginHorizontal: 32,
    marginTop: 24
  }
});


export default TableCreateCoursePage;
