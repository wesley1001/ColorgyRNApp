import React, {
  InteractionManager,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ProgressBarAndroid,
  Navigator
} from 'react-native';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import { connect } from 'react-redux/native';
import { FBLoginManager } from 'NativeModules';

import THEME from '../constants/THEME';

import Text from '../components/Text';

import organizationDatabase, { sqlValue } from '../databases/organizationDatabase';
import colorgyAPI from '../utils/colorgyAPI';
import notify from '../utils/notify';
import ga from '../utils/ga';
import error from '../utils/errorHandler';

import { doClearAccessToken, doUpdateMe } from '../actions/colorgyAPIActions';

import FeedbackContainer from './FeedbackContainer';
import TitleBarLayout from '../components/TitleBarLayout';
import ScrollableTab from '../components/ScrollableTab';
import ListSelect from '../components/ListSelect';
import Button from '../components/Button';
import GhostButton from '../components/GhostButton';

var OrgSelectContainer = React.createClass({

  getStyles: function() {
    return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: THEME.BACKGROUND_COLOR,
        padding: 24,
        paddingTop: 12
      },
      instructionsText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#555555',
        margin: 8,
      },
      hintText: {
        fontSize: 14,
        textAlign: 'center',
        color: '#777777',
        margin: 5,
      },
      card: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#E2E2E2',
        backgroundColor: 'white',
        padding: 18
      }
    });
  },

  getInitialState: function() {
    return {
      step: 0,
      selectStartedAt: (new Date()).getTime()
    };
  },

  componentWillMount() {
    this._fetchOrgs();
    this._fetchYears();
  },

  _proceedToStep(step) {
    this.setState({ step: step });
  },

  _fetchOrgs() {
    this.setState({ fetchOrgFaild: false, fetchOrgStartedAt: (new Date()).getTime() });

    organizationDatabase.getOrganizations({ onlyWithDepartments: true }).then((data) => {
      var orgOptions = data.map((org) => ({ name: `${org.code} - ${org.name}`, value: org.code }));
      var dataObj = data.reduce(function(object, data, i) {
        object[data['code']] = data;
        return object;
      }, {});
      this.setState({
        orgOptions: orgOptions,
        orgData: dataObj,
        fetchOrgFaild: false
      });
      var loadingTime = (new Date()).getTime() - this.state.fetchOrgStartedAt;
      ga.sendTiming('DataLoad', loadingTime, 'UserSelectOrgsLoad', 'data-load');
    }).catch((e) => {
      error('UserOrgSelect: fetchOrgFaild: ', e);
      notify('網路錯誤');
      this.setState({ fetchOrgFaild: true });
    });
  },

  _fetchDeps(orgCode) {
    this.setState({ fetchDepFaild: false, fetchDepStartedAt: (new Date()).getTime() });

    organizationDatabase.getDepartments(orgCode).then((data) => {
      var depOptions = data.map((dep) => ({ name: `${dep.name} (${dep.code})`, value: dep.code }));
      var dataObj = data.reduce(function(object, data, i) {
        object[data['code']] = data;
        return object;
      }, {});
      this.setState({
        depOptions: depOptions,
        depData: dataObj,
        fetchDepFaild: false
      });
      var loadingTime = (new Date()).getTime() - this.state.fetchDepStartedAt;
      ga.sendTiming('DataLoad', loadingTime, 'UserSelectDepsLoad', 'data-load');
    }).catch((e) => {
      error('UserOrgSelect: fetchDepFaild: ', e);
      notify('網路錯誤');
      this.setState({ fetchDepFaild: true });
    });
  },

  _fetchYears() {
    let currentYear = (new Date()).getFullYear();
    var yearOptions = [];

    for (var i=currentYear; i>=(currentYear-100); i--) {
      yearOptions.push({ name: `${i} 年 (${i - 1911} 學年度)`, value: i });
    }

    this.setState({ yearOptions: yearOptions });
  },

  _handleOrgSelect(e) {
    var orgCode = e.value;
    this.setState({ orgCode, depOptions: null, depData: {} }, () => {
      InteractionManager.runAfterInteractions(() => {
        this._fetchDeps(orgCode);
      });
    });
  },

  _handleDepSelect(e) {
    var depCode = e.value;
    this.setState({ depCode });
  },

  _handleYearSelect(e) {
    var year = e.value;
    this.setState({ year });
  },

  _cannotFindOrg() {
    this.setState({ orgCode: 'null', depCode: 'null' });
    this._proceedToStep(2);
    this.navigator.push({ name: 'cannotFindOrg' });
  },

  _cannotFindDep() {
    this.setState({ depCode: 'null' });
    this._proceedToStep(2);
    this.navigator.push({ name: 'cannotFindDep' });
  },

  _handleDone() {
    this.props.dispatch(doUpdateMe({
      unconfirmedOrganizationCode: this.state.orgCode,
      unconfirmedDepartmentCode: this.state.depCode,
      unconfirmedStartedYear: this.state.year
    }));

    var selectingTime = (new Date()).getTime() - this.state.selectStartedAt;
    ga.sendTiming('UserAction', selectingTime, 'UserOrgSelect', 'user-action');
  },

  render: function() {
    let styles = this.getStyles();

    if (this.props.updating) {
      return (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ProgressBarAndroid />
          <Text></Text>
          <Text>資料上傳中⋯⋯</Text>
        </View>
      );
    }

    return (
      <Navigator
        ref={(navigator) => this.navigator = navigator}
        initialRoute={{ name: 'index' }}
        renderScene={(route, navigator) => {
          switch(route.name) {
            case 'index':
              return (
                <TitleBarLayout
                  enableOffsetTop={this.props.translucentStatusBar}
                  offsetTop={this.props.statusBarHeight}
                  title="歡迎來到 Colorgy"
                >
                  <ScrollableTab
                    currentTab={this.state.step}
                    edgeHitWidth={-1}
                    renderTabBar={false}
                  >
                    <View tabLabel="選擇學校" style={styles.container}>
                      <View style={[styles.card, { marginTop: 14 }]}>
                        <Text style={[styles.instructionsText, { marginBottom: 14 }]}>
                          您就讀的是哪一所學校呢？
                        </Text>
                        {(() => {
                          if (this.state.fetchOrgFaild) {
                            return (
                              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text>選項載入失敗，請檢查您的網路連線，然後</Text>
                                <Text></Text>
                                <GhostButton type="small" text="再試一次" onPress={this._fetchOrgs} />
                              </View>
                            );
                          } else if (this.state.orgOptions) {
                            return (
                              <ListSelect
                                style={{ flex: 1 }}
                                options={this.state.orgOptions}
                                onSelect={this._handleOrgSelect}
                              />
                            );
                          } else {
                            return (
                              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <ProgressBarAndroid />
                                <Text></Text>
                                <Text>選項載入中⋯⋯</Text>
                              </View>
                            );
                          }
                        })()}
                        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 8 }}>
                          <TouchableOpacity onPress={this._cannotFindOrg}>
                            <View style={{ backgroundColor: 'transparent', borderBottomWidth: 1, borderBottomColor: '#F89680' }}>
                              <Text style={{ color: '#F89680' }}>
                                找不到我的學校......
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <GhostButton
                          style={{ flex: 3, marginTop: 24, marginRight: 12 }}
                          text="取消登入"
                          onPress={() => this.props.dispatch(doClearAccessToken())}
                        />
                        <Button
                          style={{ flex: 4, marginTop: 24, marginLeft: 12 }}
                          text="繼續"
                          disabled={!this.state.orgCode}
                          onPress={() => this._proceedToStep(1)}
                        />
                      </View>
                    </View>

                    <View tabLabel="選擇科系" style={styles.container}>
                      <View style={[styles.card, { marginTop: 14 }]}>
                        <Text style={[styles.instructionsText, { marginBottom: 14 }]}>
                          您是哪一個系所的同學呢？
                        </Text>
                        {(() => {
                          if (this.state.fetchDepFaild) {
                            return (
                              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text>選項載入失敗，請檢查您的網路連線，然後</Text>
                                <Text></Text>
                                <GhostButton type="small" text="再試一次" onPress={this._fetchDeps(this.state.orgCode)} />
                              </View>
                            );
                          } else if (this.state.depOptions) {
                            return (
                              <ListSelect
                                style={{ flex: 1 }}
                                options={this.state.depOptions}
                                onSelect={this._handleDepSelect}
                              />
                            );
                          } else {
                            return (
                              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <ProgressBarAndroid />
                                <Text></Text>
                                <Text>選項載入中⋯⋯</Text>
                              </View>
                            );
                          }
                        })()}
                        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 8 }}>
                          <TouchableOpacity onPress={this._cannotFindDep}>
                            <View style={{ backgroundColor: 'transparent', borderBottomWidth: 1, borderBottomColor: '#F89680' }}>
                              <Text style={{ color: '#F89680' }}>
                                找不到我的系所......
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <GhostButton
                          style={{ flex: 3, marginTop: 24, marginRight: 12 }}
                          text="回上一步"
                          onPress={() => this._proceedToStep(0)}
                        />
                        <Button
                          style={{ flex: 4, marginTop: 24, marginLeft: 12 }}
                          text="繼續"
                          disabled={!this.state.depCode}
                          onPress={() => this._proceedToStep(2)}
                        />
                      </View>
                    </View>

                    <View tabLabel="選擇入學年度" style={styles.container}>
                      <View style={[styles.card, { marginTop: 14 }]}>
                        <Text style={[styles.instructionsText, { marginBottom: 14 }]}>
                          您的入學年度是？
                        </Text>
                        {(() => {
                          if (this.state.yearOptions) {
                            return (
                              <ListSelect
                                style={{ flex: 1 }}
                                options={this.state.yearOptions}
                                onSelect={this._handleYearSelect}
                              />
                            );
                          } else {
                            return (
                              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text>選項載入失敗，請檢查您的網路連線，然後</Text>
                                <Text></Text>
                                <GhostButton type="small" text="再試一次" onPress={this._fetchYears()} />
                              </View>
                            );
                          }
                        })()}
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <GhostButton
                          style={{ flex: 3, marginTop: 24, marginRight: 12 }}
                          text="回上一步"
                          onPress={() => this.state.orgCode == 'null' ? this._proceedToStep(0) || this.setState({ orgCode: null, depCode: null }) : this._proceedToStep(1)}
                        />
                        <Button
                          style={{ flex: 4, marginTop: 24, marginLeft: 12 }}
                          text="完成"
                          disabled={!this.state.year}
                          onPress={() => this._handleDone()}
                        />
                      </View>
                    </View>
                  </ScrollableTab>
                </TitleBarLayout>
              );
              break;
            case 'cannotFindOrg':
              return (
                <FeedbackContainer navigator={navigator} feedbackTypes={['找不到我的學校']} title="回報您的學校" feedbackName="學校名稱" feedbackPlaceholder="請填入您的學校名稱......" hint="找不到您的學校，您依然可以使用此 app。您可以在此回報您的學校，並繼續登入程序 :)" />
              );
              break;
            case 'cannotFindDep':
              return (
                <FeedbackContainer navigator={navigator} feedbackTypes={['找不到我的學校']} title="回報您的系所" feedbackName="系所名稱" feedbackPlaceholder="請填入您的系所名稱......" hint="若是找不到您的系所，您依然可以使用此 app。您可以在此回報您的系所，並繼續登入程序 :)" />
              );
              break;
          }
        }}
        configureScene={(route) => {
          switch(route.name) {
            default:
              return Navigator.SceneConfigs.FloatFromRight;
              break;
          }
        }}
      />
    );
  }
});

export default connect((state) => ({
  count: state.counter.count,
  colorgyAPI: state.colorgyAPI,
  updating: state.colorgyAPI.meUpdating,
  translucentStatusBar: state.deviceInfo.translucentStatusBar,
  statusBarHeight: state.deviceInfo.statusBarHeight
}))(OrgSelectContainer);
