import React, { Platform, View, Text, AsyncStorage, Alert } from 'react-native';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import { connect } from 'react-redux/native';

import ScrollableTab from '../components/ScrollableTab';
import AppTabBar from '../components/AppTabBar';

import AppInitializeContainer from './AppInitializeContainer';
import LoginContainer from './LoginContainer';
import OrgSelectContainer from './OrgSelectContainer';
import DevModeContainer from './DevModeContainer';
import TableContainer from './table';
import BoardContainer from './board';
import MoreContainer from './more';
import ChatContainer from './chat';
import FriendsContainer from './friends';
import Messenger from './messenger';

import { doDeviceInfo } from '../actions/deviceInfoActions';
import { selectTab } from '../actions/appTabActions';
import { doUpdateMe, gcmRegistered } from '../actions/colorgyAPIActions';
import { enterDevMode } from '../actions/devModeActions';
import { doBackPress } from '../actions/appActions';

import ga from '../utils/ga';
import chatAPI from '../utils/chatAPI';
import colorgyAPI from '../utils/colorgyAPI';
import notify from '../utils/notify';

var App = React.createClass({
  componentWillMount: function() {
    this.props.dispatch(doDeviceInfo());

    if (Platform.OS === 'android') {
      var GcmAndroid = require('react-native-gcm-android');
      this.GcmAndroid = GcmAndroid;

      GcmAndroid.addEventListener('register', (deviceToken) => {
        this.props.dispatch(gcmRegistered({ deviceToken }));
      });

      GcmAndroid.addEventListener('notification', (message) => {
      });

      GcmAndroid.requestPermissions();

      React.BackAndroid.addEventListener('hardwareBackPress', () => {
        this.props.dispatch(doBackPress());
        return true;
      });
    }
  },

  async _loadInitialState() {
    try {
      var value = await AsyncStorage.getItem('chat_data_id');
      if (value !== null){
        this.setState({chatId:value});
        console.log('Recovered selection from disk: ' + value);
      } else {
        console.log('Initialized with no selection on disk.');
      }
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  },

  async _saveChatId(id) {
    try {
      await AsyncStorage.setItem("chat_data_id", id);
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  },
  componentDidMount: function() {
    this.fetchOrgAvailability();
    ga.setUserID(this.props.uuid);
    ga.sendScreenView('Start');
    this._loadInitialState().done();
    // 載入app即進行的動作for聊天室
    colorgyAPI.getAccessToken().then((accessToken) => {
      this.setState({accessToken:accessToken});
      chatAPI.check_user_available(accessToken,this.props.uuid)
      .then((response)=>{
        if (response) {
          var data = JSON.parse(response._bodyInit);
          console.log("check_user_available",data);
          this.setState({chatId:data.userId,chatStatus:data.status});
          this._saveChatId(response).done();
          chatAPI.check_answered_latest(accessToken,this.props.uuid,data.userId)
          .then(function(response) {
            return response.text()
          })
          .then((responseText)=>{
            console.log("check_answered_latest",responseText);
            var result = JSON.parse(responseText);
            if(result.result != 'answered'){
              this.setState({haveAnswerToday:false})
            }else{
              this.setState({haveAnswerToday:true})
            }
          })
        }
      });
      chatAPI.get_user_data(accessToken,this.props.uuid)
      .then((response)=>{
        if (response) {
          var data = JSON.parse(response).result;
          console.log("data",data);
          if (!data.avatar_url) {
            data.avatar_url = '';
          }
          this.setState({chat_user_data:data});
        };
      })
    });
  },

  fetchOrgAvailability() {
    colorgyAPI.fetch(`/v1/available_org/${this.props.organizationCode}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((r) => {
      return r.json();
    }).then((json) => {
      // notify(`AOL: "/v1/available_org/${this.props.organizationCode}": ${JSON.stringify(json)}`);
      if (json.available) {
        this.props.dispatch({ type: 'ORG_AVAILABLE' });
      } else {
        this.props.dispatch({ type: 'ORG_NOT_AVAILABLE' });
      }
    }).catch((e) => {
      // notify(`AOL: ${this.props.organizationCode}: ${JSON.stringify(e)}`);
    });
  },

  getInitialState: function() {
    return{
      chatId: 'loading',
      chat_user_data:{},
      accessToken:'',
      haveAnswerToday:false,
      chatStatus:-1,
    }
  },
  initChatStatus(){
    // 載入app即進行的動作for聊天室
    colorgyAPI.getAccessToken().then((accessToken) => {
      this.setState({accessToken:accessToken});
      chatAPI.check_user_available(accessToken,this.props.uuid)
      .then((response)=>{
        if (response) {
          var data = JSON.parse(response._bodyInit);
          console.log("check_user_available",data);
          this.setState({chatId:data.userId,chatStatus:data.status});
          this._saveChatId(response).done();
          chatAPI.check_answered_latest(accessToken,this.props.uuid,response)
          .then(function(response) {
            return response.text()
          })
          .then((responseText)=>{
            console.log("check_answered_latest",responseText);
            var result = JSON.parse(responseText);
            if(result.result != 'answered'){
              this.setState({haveAnswerToday:false})
            }else{
              this.setState({haveAnswerToday:true})
            }
          })
        }
      });
      chatAPI.get_user_data(accessToken,this.props.uuid)
      .then((response)=>{
        if (response) {
          var data = JSON.parse(response).result;
          if (!data.avatar_url) {
            data.avatar_url = '';
          }
          this.setState({chat_user_data:data});
        };
      })
    });
  },
  answerToday(){
    this.setState({haveAnswerToday:true});
  },
  refresh_data(){
    this.componentDidMount();
  },
  regetStatus(){
    colorgyAPI.getAccessToken().then((accessToken) => {
      this.setState({accessToken:accessToken});
      chatAPI.check_user_available(accessToken,this.props.uuid)
      .then((response)=>{
        if (response) {
          var data = JSON.parse(response._bodyInit);
          console.log("check_user_available",data);
          this.setState({chatId:data.userId,chatStatus:data.status});
          this._saveChatId(response).done();
          chatAPI.check_answered_latest(accessToken,this.props.uuid,response)
          .then(function(response) {
            return response.text()
          })
          .then((responseText)=>{
            console.log("check_answered_latest",responseText);
            var result = JSON.parse(responseText);
            if(result.result != 'answered'){
              this.setState({haveAnswerToday:false})
            }else{
              this.setState({haveAnswerToday:true})
            }
          })
        }
      });
      chatAPI.get_user_data(accessToken,this.props.uuid)
      .then((response)=>{
        if (response) {
          var data = JSON.parse(response).result;
          console.log("data",data);
          this.setState({chat_user_data:data});
        };
      })
    });
  },
  updateChatStatus(index){
    // update to index
    if (index == 2) {
      chatAPI.users_update_user_status(this.state.accessToken,this.props.uuid,index)
      .then((response)=>{
        console.log(response);
      })
    };
    this.setState({chatStatus:index});
  },
  render: function() {
    var { overlayElement } = this.props;

    return (
      <View style={{ flex: 1 }}>
        {(() => {
          if (this.props.isDevMode) {
            return (<DevModeContainer />);

          } else if (!this.props.stateReady) {
            return (<AppInitializeContainer />);

          } else if (!this.props.isLogin) {
            return(<LoginContainer />);

          } else if (!this.props.organizationCode) {
            return(<OrgSelectContainer />);

          } else {
            return(
              <ScrollableTab
                tabBar={AppTabBar}
                tabBarPosition="bottom"
                currentTab={this.props.currentTab}
                onTabChanged={(t) => this.props.dispatch(selectTab({ tab: t }))}
                edgeHitWidth={-1}
                renderTabBar={!this.props.hideAppTabBar}
              >
                <View tabLabel="我的課表" style={{ flex: 1, backgroundColor: '#EEEEEE' }}>
                  <TableContainer />
                </View>
                <View tabLabel="活動牆" style={{ flex: 1 }}>
                  <BoardContainer />
                </View>
                <View tabLabel="模糊聊" style={{ flex: 1 }}>
                  {(() => {
                    if (this.props.orgAvailable) {
                      return (
                        <ChatContainer
                          regetStatus={this.regetStatus}
                          initChatStatus={this.initChatStatus}
                          renewChatStatus={this.renewChatStatus}
                          chatStatus={this.state.chatStatus}
                          updateChatStatus={this.updateChatStatus}
                          refresh_data={this.refresh_data}
                          answerToday={this.answerToday}
                          haveAnswerToday={this.state.haveAnswerToday}
                          uuid={this.props.uuid}
                          accessToken={this.state.accessToken}
                          chatData={{id:this.state.chatId,data:this.state.chat_user_data}} />
                      );
                    } else {
                      this.fetchOrgAvailability();
                      return (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ alignItems: 'center', justifyContent: 'center' }}>你的學校尚未開通</Text>
                        </View>
                      );
                    }
                  })()}
                </View>
                <View tabLabel="好朋友" style={{ flex: 1 }}>
                  {(() => {
                    if (this.props.orgAvailable) {
                      return (
                        <FriendsContainer
                          chatStatus={this.state.chatStatus}
                          uuid={this.props.uuid}
                          accessToken={this.state.accessToken}
                          chatData={{id:this.state.chatId,data:this.state.chat_user_data}}/>
                      );
                    } else {
                      return (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ alignItems: 'center', justifyContent: 'center' }}>你的學校尚未開通</Text>
                        </View>
                      );
                    }
                  })()}
                </View>
                <View tabLabel="更多" style={{ flex: 1 }}>
                  <MoreContainer />
                </View>
              </ScrollableTab>
            );
          }
        })()}

        {overlayElement}
      </View>
    );
  }
});

export default connect((state) => ({
  stateReady: state.app.stateReady,
  overlayElement: state.app.overlayElement,
  isLogin: (state.colorgyAPI.hasAccessToken && state.colorgyAPI.meUpdatedAt),
  organizationCode: state.colorgyAPI.me && state.colorgyAPI.me.possibleOrganizationCode,
  uuid: state.colorgyAPI.me && state.colorgyAPI.me.uuid,
  deviceInfo: state.deviceInfo,
  isDevMode: state.devMode.devMode,
  currentTab: state.appTab.currentTab,
  hideAppTabBar: state.appTab.hideAppTabBar,
  orgAvailable: state.colorgyAPI.orgAvailable
}))(App);
