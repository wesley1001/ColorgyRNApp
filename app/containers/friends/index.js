import React, {
  StyleSheet,
  View,
  WebView,
  ProgressBarAndroid,
  ScrollView,
  Image,
  PixelRatio,
  Navigator,
  TouchableOpacity,
  BackAndroid,
  TouchableNativeFeedback,
  TextInput,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
  PullToRefreshViewAndroid
} from 'react-native';
import { connect } from 'react-redux/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Messenger from './../messenger';
import Report from './../report'

import Text from '../../components/Text';
import TitleBarLayout from '../../components/TitleBarLayout';
import TitleBarActionIcon from '../../components/TitleBarActionIcon';
import Dialog from '../../components/Dialog';

import chatAPI from '../../utils/chatAPI';
import ga from '../../utils/ga';

var Hellos = React.createClass({
  getInitialState(){
    return{
      show_little_Tabs: [],
      isRefreshing:false,
    }
  },
  componentWillMount() {
  },

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', function() {
      if (this.state.show_little_Tabs.length>=1) {
        this.setState({show_little_Tabs:[]});
      }else{
        this.props.navigator.pop();
      }
    }.bind(this));
  },

  componentWillReceiveProps(nextProps) {
  },

  _reportRouteUpdate() {
  },
  _handleBack(){
    this.props.navigator.pop();
  },
  more(key){
    if(this.state.show_little_Tabs.indexOf(key)>=0){
      this.hideMore();
    }else{
      this.setState({
        show_little_Tabs: [key]
      })
    }
  },
  hideMore(){
    var temp = [];
    this.setState({
      show_little_Tabs: temp
    })
  },
  response(hiId,res){
    chatAPI.hi_response(this.props.accessToken,this.props.uuid,this.props.chatData.id,hiId,res)
    .then((response)=>{
      this.props.data_refresh();
    })
    ToastAndroid.show('已回應',ToastAndroid.SHORT);
    this.props.navigator.pop();
  },
  refresh_data(){
    this.setState({isRefreshing: true});
    this.props.data_refresh();
    setTimeout(function() {
      this.setState({isRefreshing: false});
    }.bind(this),500)
  },
  render() {
    return (
      <View>
        <TitleBarLayout
          enableOffsetTop={this.props.translucentStatusBar}
          offsetTop={this.props.statusBarHeight}
          style={[this.props.style,{paddingTop:25,backgroundColor:'white'}]}
          title="打招呼"
          textColor={"#000"}
          color={"#FFF"}
          actions={[{ title: '返回', icon: require('../../assets/images/back_orange.png'), onPress: this._handleBack, show: 'always' },]}
        >
        <PullToRefreshViewAndroid
        style={{flex: 1}}
        refreshing={this.state.isRefreshing}
        onRefresh={this.refresh_data}
        colors={['#FFF', '#FFF', '#FFF']}
        progressBackgroundColor={'#F89680'}
        >
          <ScrollView style={{flex:1,marginTop:6/PixelRatio.get()}}>
              {this.props.hellos.map(function(hello,index){
                if (this.state.show_little_Tabs.indexOf(index)>=0) {
                  var show_little_Tabs = true;
                }else{
                  var show_little_Tabs = false;
                }
                return(
                  <View key={index}>
                    <View style={{paddingTop:10,paddingBottom:10,height:100,backgroundColor:'white',flexDirection:'row',marginBottom:6/PixelRatio.get()}}>
                      <View style={[styles.allCenter,{flex:1}]}>
                          <Image
                            style={{width:60,height:60,borderRadius:60/2}}
                            source={{uri: hello.image}}
                          />
                      </View>
                      <View style={{flex:3,paddingLeft:5}}>
                        <View style={{justifyContent:'center',flex:1}}>
                          <Text style={{fontSize:18,}}>{hello.name}</Text>
                        </View>
                        <View style={{justifyContent:'center',flex:1}}>
                          <Text style={{fontSize:13,color:"#F89680"}}>{hello.lastAnswer}</Text>
                        </View>
                        <View style={{justifyContent:'center',flex:1}}>
                          <Text style={{fontSize:15,}}>{hello.message}</Text>
                        </View>
                      </View>
                      <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}>
                        {show_little_Tabs?<View style={{height:80,backgroundColor:'#979797',borderRadius:5}}>
                          <TouchableNativeFeedback>
                            <View style={{height:40,marginRight:10,marginLeft:10,flexDirection:'column',justifyContent:'center'}}>
                              <Text style={{color:'white'}}>檢舉對方</Text>
                            </View>
                          </TouchableNativeFeedback>
                          <TouchableNativeFeedback>
                            <View style={{height:40,marginRight:10,marginLeft:10,flexDirection:'column',justifyContent:'center'}}>
                              <Text style={{color:'white'}}>封鎖對方</Text>
                            </View>
                          </TouchableNativeFeedback>
                        </View>:null}
                        <TouchableNativeFeedback onPress={()=>this.more(index)}>
                          <View style={{padding:15}}>
                            <Image
                              style={{width:5.76/1.2,height:28.8/1.2}}
                              source={require('../../assets/images/icon_friend_more.png')} />
                          </View>
                        </TouchableNativeFeedback>
                      </View>
                    </View>
                    <View style={{flexDirection:'row',marginTop:2/PixelRatio.get()}}>
                      <TouchableNativeFeedback onPress={()=>this.response(hello.id,false,index)}><View style={[styles.allCenter,{flex:1,margin:1/PixelRatio.get(),backgroundColor:'white',height:45}]}>
                        <Image
                          style={{width:23,height:23}}
                          source={require('../../assets/images/icon_friend_close.png')}
                          />
                      </View></TouchableNativeFeedback>
                      <TouchableNativeFeedback onPress={()=>this.response(hello.id,true,index)}><View style={[styles.allCenter,{flex:1,margin:1/PixelRatio.get(),backgroundColor:'white',height:45}]}>
                        <Image
                          style={{width:23,height:23}}
                          source={require('../../assets/images/icon_friend_ok.png')}/>
                      </View></TouchableNativeFeedback>
                    </View>
                  </View>
                )
              }.bind(this))}
            </ScrollView>
          </PullToRefreshViewAndroid>
        </TitleBarLayout>
      </View>
    );
  }
});

var Friends = React.createClass({
  getInitialState(){
    return{
      search_show:false,
      search_word:'',
      strangerList:this.props.strangerList,
      isRefreshing:false,
    }
  },

  componentWillMount() {
  },

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', function() {
        this.setState({search_show:false,search_word:''});
    }.bind(this));
  },

  componentWillReceiveProps() {
    this.setState({strangerList:this.props.strangerList});
  },

  _reportRouteUpdate() {
  },

  handleSearch(){
    this.setState({search_show:true});
  },
  longPress(chatroomId){
    Alert.alert(
      '你確定要刪除對話？',
      '聊天紀錄將被直接刪除，但對方還是可以密你呦～',
      [
        {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: '刪除', onPress: () => this.delete_chatroom(chatroomId)},
      ]
    )
  },
  delete_chatroom(chatroomId){
    chatAPI.users_remove_chatroom(this.props.accessToken,this.props.uuid,this.props.chatData.id,chatroomId);
  },
  refresh_data(){
    this.setState({isRefreshing: true});
    this.props.data_refresh();
    setTimeout(function() {
      this.setState({isRefreshing: false});
    }.bind(this),500)
  },
  render() {
    var friendList = this.state.strangerList;
    if (this.state.search_word.length>0) {
      var friendTemp = [];
      for (var i = friendList.length - 1; i >= 0; i--) {
        if(friendList[i].name.indexOf(this.state.search_word)>=0){
          friendTemp.push(friendList[i]);
        }
      };
      friendList = friendTemp;
    };
    return (
      <View style={{flexDirection:'column',flex:1}}>
        <TitleBarLayout
          enableOffsetTop={this.props.translucentStatusBar}
          offsetTop={this.props.statusBarHeight}
          style={[this.props.style,{paddingTop:25,backgroundColor:'white',flex:1}]}
          title="好朋友"
          textColor={"#000"}
          color={"#FFF"}
          actions={[
            null,
            { title: '搜尋', icon: require('../../assets/images/icon_chat_seach_x2.png'), onPress: this.handleSearch, show: 'always' }
          ]}
        >
          <TouchableOpacity style={{flex:1,height:60}} onPress={this.goToHello}>
            <View style={[styles.allCenter,{backgroundColor:'white',flexDirection:'row'}]}>
                <Text style={{fontSize:18,color:'#000',}}>打招呼 </Text>
                <View style={{backgroundColor:"#F89680",width:20,height:20,borderRadius:10}}>
                  <Text style={{textAlign:'center',fontSize:15,color:'#FFF'}}>{this.props.hellos.length}</Text>
                </View>
            </View>
          </TouchableOpacity>
          <PullToRefreshViewAndroid
          style={{flex:7}}
          refreshing={this.state.isRefreshing}
          onRefresh={this.refresh_data}
          colors={['#FFF', '#FFF', '#FFF']}
          progressBackgroundColor={'#F89680'}
          >
            <ScrollView style={{marginTop:6/PixelRatio.get()}}>
              {friendList.map(function(friend, index){
                return(
                  <TouchableNativeFeedback key={index} onPress={()=>this.goChat(friend.friendId,friend.messageList,friend,friend.chatroomId)} onLongPress={()=>this.longPress(friend.id)}>
                    <View style={{paddingTop:10,paddingBottom:10,height:100,backgroundColor:'white',flexDirection:'row',marginBottom:6/PixelRatio.get()}}>
                      <View style={[styles.allCenter,{flex:1}]}>
                          <Image
                            style={{width:60,height:60,borderRadius:60/2}}
                            source={{uri: friend.image}} />
                      </View>
                      <View style={{flex:3,paddingLeft:5}}>
                        <View style={{justifyContent:'center',flex:1}}>
                          <Text style={{fontSize:20,}}>{friend.name}</Text>
                        </View>
                        <View style={{flex:1,flexDirection:'row',position:'relative',top:5}}>
                          <Image
                            style={{width:12,height:12,position:'relative',top:5,marginRight:5}}
                            source={require('../../assets/images/icon_friend_message.png')} />
                          <Text style={{fontSize:13,color:"#F89680"}}>{friend.lastAnswer}</Text>
                        </View>
                        <View style={{justifyContent:'center',flex:1}}>
                          <Text style={{fontSize:16,}}>{friend.lastContent}</Text>
                        </View>
                      </View>
                      <View style={{flex:1}}>
                        <Text style={{marginTop:10}}>{friend.updatedAt?friend.updatedAt.split('T')[0].split('-')[1]+'/'+friend.updatedAt.split('T')[0].split('-')[2]:'1/1'}</Text>
                      </View>
                    </View>
                  </TouchableNativeFeedback>
                )
              }.bind(this))}
            </ScrollView>
          </PullToRefreshViewAndroid>
        </TitleBarLayout>
        {this.state.search_show?
          <View style={{position:'absolute',top:25,left:0,backgroundColor:'white'}}>
            <TextInput
              style={{height: 60, borderColor: 'gray', borderWidth: 1}}
              onChangeText={(text) => this.setState({search_word: text})}
              value={this.state.search_word}
              placeholder="搜尋好友"
            />
          </View>
        :null}
      </View>
    );
  },
  goToHello(){
    this.props.navigator.push({id:'hello'});
  },
  goChat(friendId,messageList,chatroom_Data,chatroomId){
    console.log('go chat with:',chatroom_Data);
    this.props.navigator.push({id:'messenger',data:{data:chatroom_Data,friendId:friendId,messageList:messageList,image:chatroom_Data.image,chatroomId:chatroomId}});
  }
});

var Navi = React.createClass({
  getInitialState(){
    return{
      hellos:[],
      getInitData : false,
      strangerList:[],
    }
  },
  render(){
    return(
    <View style={{flex:1}}>
        <Navigator
          style={{flex:1}}
          initialRoute = {{ id: 'home' }}
          configureScene={this._configureScene}
          renderScene={this._renderScene}
        />
      </View>
    )
  },
  data_refresh(){
    chatAPI.hi_get_list(this.props.accessToken,this.props.uuid,this.props.chatData.id)
    .then((response)=>{
      if (response) {
        this.setState({hellos:JSON.parse(response._bodyInit).result});
      };
    });
    chatAPI.get_history_target(this.props.accessToken,this.props.uuid,this.props.chatData.id,'unspecified',0)
    .then((response)=>{
      if (response) {
        this.setState({strangerList:JSON.parse(response._bodyInit).result});
      };
    });
  },
  _configureScene: function(route) {
    return Navigator.SceneConfigs.PushFromRight;
  },
  componentDidMount(){
  },
  componentWillReceiveProps(){
    if (!this.state.getInitData && this.props.uuid != '' && this.props.accessToken != "" && this.props.chatData.id != 'loading') {
      chatAPI.hi_get_list(this.props.accessToken,this.props.uuid,this.props.chatData.id)
      .then((response)=>{
        if (response) {
          this.setState({hellos:JSON.parse(response._bodyInit).result});
        };
      });
      chatAPI.get_history_target(this.props.accessToken,this.props.uuid,this.props.chatData.id,'unspecified',0)
      .then((response)=>{
        if (response) {
          this.setState({strangerList:JSON.parse(response._bodyInit).result});
        };
      });
      this.setState({getInitData:true});
    };
  },
  _renderScene: function(route, navigator) {
    _navigator = navigator;
    switch(route.id) {
      case 'home':
        return (
          <Friends
            navigator={_navigator}
            hellos={this.state.hellos}
            strangerList={this.state.strangerList}
            uuid={this.props.uuid}
            accessToken={this.props.accessToken}
            chatData={this.props.chatData}
            data_refresh={this.data_refresh}/>
        );
      case 'hello':
        return (
          <Hellos
            uuid={this.props.uuid}
            accessToken={this.props.accessToken}
            chatData={this.props.chatData}
            navigator={_navigator}
            hellos={this.state.hellos}
            data_refresh={this.data_refresh}
          />
        );
      case 'report':
        return(
          <Report
            friendId={route.friendId}
            navigator={_navigator}
            uuid={this.props.uuid}
            type="block"
            data_refresh={data_refresh}
            accessToken={this.props.accessToken}
            chatData={this.props.chatData}/>
        )
      case 'messenger':
        return(
          <Messenger
            navigator={_navigator}
            uuid={this.props.uuid}
            friendImage={route.data.image}
            friendId={route.data.friendId}
            chatroomId={route.data.chatroomId}
            messageList={route.data.messageList}
            accessToken={this.props.accessToken}
            chatData={this.props.chatData}
            chatRoomData={route.data.data}
            data_refresh={this.data_refresh}/>
        )
    }
  },
})

var styles = StyleSheet.create({
  allCenter:{
    justifyContent:'center',
    flex:1,
    alignItems:'center'
  },
});

export default connect((state) => ({
  userId: state.colorgyAPI.me && state.colorgyAPI.me.id,
  organizationCode: state.colorgyAPI.me && state.colorgyAPI.me.possibleOrganizationCode,
  navigateBackCount: state.board.navigateBackCount,
  networkConnectivity: state.deviceInfo.networkConnectivity,
  translucentStatusBar: state.deviceInfo.translucentStatusBar,
  statusBarHeight: state.deviceInfo.statusBarHeight
}))(Navi);
