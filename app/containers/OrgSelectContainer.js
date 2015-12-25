import React, {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ProgressBarAndroid
} from 'react-native';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import { connect } from 'react-redux/native';
import { FBLoginManager } from 'NativeModules';

import organizationDatabase, { sqlValue } from '../databases/organizationDatabase';
import colorgyAPI from '../utils/colorgyAPI';
import alert from '../utils/alert';

import { doClearAccessToken, doUpdateMe } from '../actions/colorgyAPIActions';

import TitleBarView from '../components/TitleBarView';
import ScrollableTabView from '../components/ScrollableTabView';
import ListSelect from '../components/ListSelect';
import Button from '../components/Button';
import GhostButton from '../components/GhostButton';

var OrgSelectContainer = React.createClass({

  getStyles: function() {
    return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
        padding: 24
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
      step: 0
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
    this.setState({ fetchOrgFaild: false });

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
    }).catch((e) => {
      console.error(e);
      alert('網路錯誤');
      this.setState({ fetchOrgFaild: true });
    });
  },

  _fetchDeps(orgCode) {
    this.setState({ fetchDepFaild: false });

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
    }).catch((e) => {
      console.error(e);
      alert('網路錯誤');
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
    this.setState({ orgCode });
    this._fetchDeps(orgCode);
  },

  _handleDepSelect(e) {
    var depCode = e.value;
    this.setState({ depCode });
  },

  _handleYearSelect(e) {
    var year = e.value;
    this.setState({ year });
  },

  _handleDone() {
    this.props.dispatch(doUpdateMe({
      unconfirmedOrganizationCode: this.state.orgCode,
      unconfirmedDepartmentCode: this.state.depCode,
      unconfirmedStartedYear: this.state.year
    }));
  },

  render: function() {
    let styles = this.getStyles();

    if (this.props.updating) {
      return (
        <View style={styles.container}>
          <ProgressBarAndroid />
          <Text></Text>
          <Text>資料上傳中⋯⋯</Text>
        </View>
      );
    }

    return (
      <TitleBarView
        enableOffsetTop={this.props.translucentStatusBar}
        offsetTop={this.props.statusBarHeight}
        title="歡迎來到 Colorgy"
      >
        <ScrollableTabView currentTab={this.state.step} activeColor="#F89680" edgeHitWidth={-1}>
          <View tabLabel="選擇學校" style={styles.container}>
            <Text style={styles.instructionsText}>
              在開始之前，我們需要知道一些關於您的資訊，來為您準備最適切的服務與功能。
            </Text>
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
                      <GhostButton text="再試一次" onPress={this._fetchOrgs} />
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
            <Text style={[styles.hintText, { marginTop: 12, marginBottom: 0 }]}>
              {this.state.orgCode ? `安安，${this.state.orgData[this.state.orgCode].short_name}的同學！` : '選擇學校後就可以繼續囉。'}
            </Text>
          </View>

          <View tabLabel="選擇科系" style={styles.container}>
            <Text style={styles.instructionsText}>
              現在我們需要一些您在學校的資訊，來幫您找到您感興趣的資訊及朋友圈。
            </Text>
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
                      <GhostButton text="再試一次" onPress={this._fetchDeps(this.state.orgCode)} />
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
            <Text style={[styles.hintText, { marginTop: 12, marginBottom: 0 }]}>
              {this.state.depCode ? `好的，${this.state.orgData[this.state.orgCode].short_name}${this.state.depData[this.state.depCode].short_name}。準備好繼續了嗎？` : '請挑選您的系所。如果找不到的話，先選擇學院或是相近的科系，日後再回來修改也可以喔！'}
            </Text>
          </View>

          <View tabLabel="選擇入學年度" style={styles.container}>
            <Text style={styles.instructionsText}>
              好極了！現在只剩下最後一步：為了幫您找到學長學姊、學弟學妹，請告訴我們......
            </Text>
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
                      <GhostButton text="再試一次" onPress={this._fetchYears()} />
                    </View>
                  );
                }
              })()}
            </View>
            <View style={{ flexDirection: 'row' }}>
              <GhostButton
                style={{ flex: 3, marginTop: 24, marginRight: 12 }}
                text="回上一步"
                onPress={() => this._proceedToStep(1)}
              />
              <Button
                style={{ flex: 4, marginTop: 24, marginLeft: 12 }}
                text="完成"
                disabled={!this.state.year}
                onPress={() => this._handleDone()}
              />
            </View>
            <Text style={[styles.hintText, { marginTop: 12, marginBottom: 0 }]}>
              {this.state.year ? `這些資料往後還可以在「個人資料」頁面中修改喔。` : '請選擇入學年度後繼續。'}
            </Text>
          </View>
        </ScrollableTabView>
      </TitleBarView>
    );
  }
});

export default connect((state) => ({
  count: state.counter.count,
  colorgyAPI: state.colorgyAPI,
  updating: state.colorgyAPI.meUpdating,
  translucentStatusBar: state.uiEnvironment.translucentStatusBar,
  statusBarHeight: state.uiEnvironment.statusBarHeight
}))(OrgSelectContainer);
