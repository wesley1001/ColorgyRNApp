import React, { Platform, View, Text, AsyncStorage } from 'react-native';
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
import MoreContainer from './MoreContainer';
import ChatContainer from './chat';
import FriendsContainer from './friends';
import Messenger from './messenger';


import { doDeviceInfo } from '../actions/deviceInfoActions';
import { selectTab } from '../actions/appTabActions';
import { doUpdateMe } from '../actions/colorgyAPIActions';
import { enterDevMode } from '../actions/devModeActions';
import { doBackPress } from '../actions/appActions';

import ga from '../utils/ga';
import chatAPI from '../utils/chatAPI';
import colorgyAPI from '../utils/colorgyAPI';

var App = React.createClass({
  componentWillMount: function() {
    this.props.dispatch(doDeviceInfo());

    if (Platform.OS === 'android') {
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
    ga.setUserID(this.props.uuid);
    ga.sendScreenView('Start');
    this._loadInitialState().done();
    // 載入app即進行的動作for聊天室
    colorgyAPI.getAccessToken().then((accessToken) => {
      this.setState({accessToken:accessToken});
      chatAPI.check_user_available(accessToken,this.props.uuid)
      .then((response)=>{
        if (response) {
          this.setState({chatId:response});
          this._saveChatId(response).done();
          chatAPI.check_answered_latest(accessToken,this.props.uuid,response)
            .then((response)=>{
              console.log("check_answered_latest",response);
              if(JSON.parse(response._bodyInit).result == "not answered"){
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

  getInitialState: function() {
    return{ chatId: 'loading',chat_user_data:{},accessToken:'',haveAnswerToday:false }
  },
  answerToday(){
    this.setState({haveAnswerToday:true});
  },
  refresh_data(){
    this.componentDidMount();
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
                  <ChatContainer refresh_data={this.refresh_data} answerToday={this.answerToday} haveAnswerToday={this.state.haveAnswerToday} uuid={this.props.uuid} accessToken={this.state.accessToken} chatData={{id:this.state.chatId,data:this.state.chat_user_data}} />
                </View>
                <View tabLabel="好朋友" style={{ flex: 1 }}>
                  <FriendsContainer uuid={this.props.uuid} accessToken={this.state.accessToken} chatData={{id:this.state.chatId,data:this.state.chat_user_data}}/>
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
  hideAppTabBar: state.appTab.hideAppTabBar
}))(App);
