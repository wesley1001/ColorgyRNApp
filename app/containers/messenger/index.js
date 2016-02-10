import React, {
  StyleSheet,
  ToastAndroid,
  View,
  WebView,
  ProgressBarAndroid,
  ScrollView,
  Dimensions,
  PixelRatio,
  Image,
  TouchableNativeFeedback,
  BackAndroid,
  Alert
} from 'react-native';
import { connect } from 'react-redux/native';

import Text from '../../components/Text';
import TitleBarLayout from '../../components/TitleBarLayout';
import TitleBarActionIcon from '../../components/TitleBarActionIcon';
import Dialog from '../../components/Dialog';
import { setOverlayElement } from '../../actions/appActions';
import { hideAppTabBar, showAppTabBar } from '../../actions/appTabActions';
import GiftedMessenger from '../../components/react-native-gifted-messenger';

import ga from '../../utils/ga';
import chatAPI from '../../utils/chatAPI';

var UIImagePickerManager = require('NativeModules').UIImagePickerManager;


var Messenger = React.createClass({
  getInitialState(){
    return{
      menuOpen:false,
      messages:[],
      chatroomId:'',
      messageList:this.props.messageList,
      socketId:'',
      io:{},
      show_dialog:false,
      friend_data:{
        id:this.props.chatRoomData.id,
        alias:this.props.chatRoomData.name,
        image:this.props.chatRoomData.image,
      }
    }
  },
  getDefaultProps: function() {
    return {
      chatRoomData:{
        "chatId1": "56b5b009cb7fb0f41698d923",
        "aliasId1": "EddieWeng",
        "imageId1": "https://s3-ap-northeast-1.amazonaws.com/colorgy-core/users/avatars/blur_2x/52fbffbe32c2e41ae102a4ef008e8ee7ad763b92.?1454171143",
        "chatId2": "56af0ebb4bd9c5f12d613d7c",
        "aliasId2": "Dannnny",
        "imageId2": "https://s3-ap-northeast-1.amazonaws.com/colorgy-core/users/avatars/blur_2x/4f47f6cbe1c94061d682cf72be94893ba917ec6a.?1454294064",
      },
      userId:"56a470cfb94e4a5a7f5394b4",
      friendId:"56a470aab94e4a5a7f5394b3",
      uuid:"68efe6c7-66b8-43bd-8046-ca228a65767e",
      accessToken:"384d7fcde66ae1e8ba1c84f73e5ba90b485ef7ca7e9b8677319559e4ac10bfc40aa1df819078b00d3fe2698d5fb3d81e78e7341686ce3088181db30fe55626ad"
    };
  },
  getMessages() {
    return this.state.messages;
  },
  showImagePicker:function(){
    var options = {
    title: 'Select Avatar', // specify null or empty string to remove the title
    cancelButtonTitle: 'Cancel',
    takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
    chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button
    customButtons: {
      'Choose Photo from Facebook': 'fb', // [Button Text] : [String returned upon selection]
    },
    cameraType: 'back', // 'front' or 'back'
    mediaType: 'photo', // 'photo' or 'video'
    videoQuality: 'high', // 'low', 'medium', or 'high'
    maxWidth: 1000, // photos only
    maxHeight: 1000, // photos only
    quality: 1, // photos only
    allowsEditing: false, // Built in iOS functionality to resize/reposition the image
    noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
    storageOptions: { // if this key is provided, the image will get saved in the documents directory (rather than a temporary directory)
      skipBackup: true, // image will NOT be backed up to icloud
      path: 'images' // will save image at /Documents/images rather than the root
    }
  };

  UIImagePickerManager.showImagePicker(options, (response) => {
    console.log('Response = ', response);

    if (response.didCancel) {
      console.log('User cancelled image picker');
    }
    else if (response.error) {
      console.log('UIImagePickerManager Error: ', response.error);
    }
    else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    }
    else {

      // You can display the image using either data:
      const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

      // uri (on iOS)
      const source2 = {uri: response.uri.replace('file://', ''), isStatic: true};
      // uri (on android)
      const source3 = {uri: response.uri, isStatic: true};
      ToastAndroid.show('為您上傳圖片中',ToastAndroid.SHORT);
        fetch('https://api.imgur.com/3/image',{
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': 'Client-ID c0db4598b10411c',
                },
                method: 'POST',
                body:JSON.stringify({
                    type:'base64',
                    name: 'meetchat.jpg',
                    title: 'meeetchattt',
                    caption: 'meeetchattt',
                    image: response.data
                })
        })
        .then((response) => response.text())
        .then((responseText) => {
          ToastAndroid.show('上傳完成',ToastAndroid.SHORT);
          var data = JSON.parse(responseText);
          console.log(data);
          var content = {imgSrc: data.data.link};
          chatAPI.sendMessage(this.state.io,this.state.chatroomId,this.props.userId,this.state.socketId, "image", content);
          var msg = {type:'image',content:content,userId:this.props.userId,date:new Date()};
        })
    }
  });

  },
  handleReceive(message,firstLoad) {
    if (message.userId != this.props.userId || firstLoad || message.type == 'image') {
      var msg = { 
        image: this.state.friend_data.image,
        date: new Date(2015, 0, 16, 19, 0),
        position:'left',
        type: 'chat',
        text: '',
        name: this.state.friend_data.alias,
      };
      msg.date = message.createdAt;
      if (message.type == 'text' || message.type == "textMessage") {
        msg.text = message.content.text;
      }else if (message.type == 'image'){
        msg.type = message.type;
        msg.content = message.content.imgSrc;
      }
      if (message.userId == this.props.userId) {
        msg.position = 'right';
        msg.image = null;
      };
      this.setState({messages:this.state.messages.concat(msg)});
    };
  },
  componentWillMount(){
    this.props.dispatch(hideAppTabBar());
  },
  componentWillUnmount(){
    this.props.dispatch(showAppTabBar());
  },
  updateAvatar(data){

  },
  componentDidMount(){
    BackAndroid.addEventListener('hardwareBackPress', function() {
      this.props.navigator.pop();
      this.props.dispatch(showAppTabBar());
    }.bind(this));
    chatAPI.connectToServer()
    .then((socket)=>{
        this.setState({io:socket});
        chatAPI.connectToChatRoom(this.state.io,this.props.chatData.id,this.props.friendId,this.props.uuid,this.props.accessToken)
        .then((response)=>{
          console.log(response);
          if (response.statusCode == 200) {
            var info = response.body.result;
            if (info.messageList.length>20) {
              for (var i = 21; i > 0; i--) {
                this.handleReceive(info.messageList[info.messageList.length-1])
              };
            }else{
              for (var i = 0; i < info.messageList.length ; i++) {
                this.handleReceive(info.messageList[i],true);
              };
            }
            this.setState({chatroomId:info.chatroomId,messageList:info.messageList,socketId:info.socketId});
            this.state.io.on('chatroom',function(msg){
              if (msg.data.type != 'avatar') {
                this.handleReceive(msg.data);
              }else{
                this.updateAvatar(msg.data);
              }
            }.bind(this))
          };
        })
    })
  },
  handleSend(message = {}, rowID = null) {
    console.log(message);
    this.setState({messages:this.state.messages.concat([message])});
    chatAPI.sendMessage(this.state.io,this.state.chatroomId,this.props.userId,this.state.socketId, "text", {text:message.text});
  },
  handleMenu(){
    this.setState({menuOpen:!this.state.menuOpen})
  },
  handleAlert(title,content,button){
    Alert.alert(
      title,
      content,
      button,
    )
  },
  pureface(){
    this.setState({menuOpen:!this.state.menuOpen});
  },
  leave(){
    chatAPI.chatroom_leave_chatroom(this.props.accessToken,this.props.uuid,this.props.chatData.id,this.state.chatroomId)
    .then((response)=>{
      console.log(response);
      this.setState({menuOpen:!this.state.menuOpen});
      this.props.navigator.pop();
      this.props.data_refresh();
    })
  },
  block(){
    this.setState({menuOpen:!this.state.menuOpen});
    chatAPI.users_block_user(this.props.accessToken,this.props.uuid,this.props.chatData.id,this.state.friendId)
    .then((response)=>{
      if (response) {
        this.props.data_refresh();
      }
    });
    this.props.navigator.push({id:'report',friendId:this.props.friendId});
  },
  _handleBack(){
    this.props.dispatch(showAppTabBar());
    this.props.navigator.pop();
  },
  render() {
    if (this.state.menuOpen) {
      var leftIcon = require('../../assets/images/icon_chat_up.png')
    }else{
      var leftIcon = require('../../assets/images/icon_chat_down.png')
    }
    return (
      <View>
        <TitleBarLayout
          enableOffsetTop={this.props.translucentStatusBar}
          offsetTop={this.props.statusBarHeight}
          style={[this.props.style,{paddingTop:0,backgroundColor:'white'}]}
          title={this.state.friend_data.alias}
          textColor={"#000"}
          color={"#FFF"}
          actions={[
            { title: '返回', icon: require('../../assets/images/back_orange.png'), onPress: this._handleBack, show: 'always' },
            { title: '更多', icon: leftIcon, onPress: this.handleMenu, show: 'always' }
          ]}
        >
        <View>
          <GiftedMessenger
            ref={(c) => this._GiftedMessenger = c}
            autoFocus={false}
            messages={this.getMessages()}
            handleSend={this.handleSend}
            maxHeight={Dimensions.get('window').height - 85} // 64 for the navBar
            photoAvilible={true}
            showImagePicker={this.showImagePicker}
            styles={{
              bubbleLeft: {
                backgroundColor: null,
                marginRight: 70,
                borderWidth:3/ PixelRatio.get(),
                borderColor:'black',
                borderRadius:5,
              },
              bubbleRight: {
                backgroundColor: '#F89680',
                marginLeft: 70,
                borderRadius:5,
              },
            }}
          />
          {this.state.menuOpen?
            <View style={{flexDirection:'row',position:'absolute',height:60,width:Dimensions.get('window').width,backgroundColor:'rgba(0,0,0,.5)',top:0,left:0}}>
              <TouchableNativeFeedback onPress={()=>this.handleRename()}><View style={{flexDirection:'column',justifyContent:'center',flex:1,alignItems:'center'}}>
                <Image
                  style={{width:20,height:20}}
                  source={require('./../../assets/images/icon_chat_rename.png')} />
                <Text style={{color:'white',marginTop:5}}>幫取名</Text>
              </View></TouchableNativeFeedback>
              <TouchableNativeFeedback onPress={()=>this.handleAlert('離開對方','不再收到對方訊息，聊天記錄也將消失，但有緣還會在模糊牆相遇～',[{text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},{text: '確定', onPress: this.leave},])}><View style={{flexDirection:'column',justifyContent:'center',flex:1,alignItems:'center'}}>
                <Image
                  style={{width:20,height:20}}
                  source={require('./../../assets/images/icon_chat_leave.png')} />
                <Text style={{color:'white',marginTop:5}}>離開</Text>
              </View></TouchableNativeFeedback>
              <TouchableNativeFeedback onPress={()=>this.handleAlert('你確定要封鎖對方？','封鎖後將不再遇到對方，所有聊天記錄也將擁有刪除。',[{text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},{text: '確定', onPress: this.block},])}><View style={{flexDirection:'column',justifyContent:'center',flex:1,alignItems:'center'}}>
                <Image
                  style={{width:20,height:20}}
                  source={require('./../../assets/images/icon_chat_block.png')} />
                <Text style={{color:'white',marginTop:5}}>封鎖</Text>
              </View></TouchableNativeFeedback>
            </View>
          :null}
          </View>
        </TitleBarLayout>
        {this.state.show_dialog?<Dialog
          title={'編輯暱稱'}
          content={'此修改暱稱只有你看得到'}
          options={[{text:'取消',method:this.cancel_dialog},{text:'確定',color:'#F89680',method:this.submit_nickname}]}/>:null}
      </View>
    );
  },
  handleRename(){
    this.setState({show_dialog:true});
  },
  cancel_dialog(){
    this.setState({show_dialog:false});
  },
  submit_nickname(name){
    chatAPI.chatroom_update_target_alias(this.props.accessToken,this.props.uuid,this.props.chatData.id,this.state.chatroomId,name)
    .then((response)=>{
      console.log(response);
      ToastAndroid.show('已為您更新名稱',ToastAndroid.SHORT);
      var temp = this.state.friend_data;
      temp.alias = name;
      this.setState({show_dialog:false,alias:temp});
      this.props.data_refresh();
    });
    this.setState({menuOpen:!this.state.menuOpen})
  },
});

export default connect((state) => ({
  userId: state.colorgyAPI.me && state.colorgyAPI.me.id,
  organizationCode: state.colorgyAPI.me && state.colorgyAPI.me.possibleOrganizationCode,
  navigateBackCount: state.board.navigateBackCount,
  networkConnectivity: state.deviceInfo.networkConnectivity,
  translucentStatusBar: state.deviceInfo.translucentStatusBar,
  statusBarHeight: state.deviceInfo.statusBarHeight
}))(Messenger);