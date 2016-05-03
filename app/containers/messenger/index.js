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
  DeviceEventEmitter,
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

var UIImagePickerManager =  require('NativeModules').ImagePickerManager;
var ImageWand = require('../../components/react-native-imagewand');

var ImageResizing = React.createClass({
  getInitialState(){
    return{
      width:Dimensions.get('window').width,
      height:200
    }
  },
  render(){
    return(
        <ImageWand
          style={{height: this.state.height,width:this.state.width}}
          src={this.props.uri}
          shouldNotifyLoadEvents={true}
          onImageInfo={this._imageInfo}/>
    )
  },
  _imageInfo(event){
    console.log(event,Dimensions.get('window').width);
    var bi = event.height/event.width
    this.setState({height:event.height/event.width*Dimensions.get('window').width});
  }
})

var Messenger = React.createClass({
  getInitialState(){
    return{
      menuOpen:false,
      keyboardHeighting:Dimensions.get('window').height,
      messages:[],
      chatroomId:'',
      messageList:this.props.messageList,
      socketId:'',
      io:{},
      about:{},
      show_dialog:false,
      friend_data:{
        id:this.props.chatRoomData.id,
        alias:this.props.chatRoomData.name,
        image:this.props.chatRoomData.image,
      },
      showBigHead:false,
      chatProgress:0,
      totalMessageLength:0,
      show_big_image:false,
      big_image:'http://staticdelivery.nexusmods.com/mods/110/images/17970-1-1338505684.jpg',
      isRefreshing:false
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
      friendId:"wqewqwqw",
      userId:"56a470cfb94e4a5a7f5394b4",
      chatroomId:"56a470aab94e4a5a7f5394b3",
      uuid:"68efe6c7-66b8-43bd-8046-ca228a65767e",
      accessToken:"384d7fcde66ae1e8ba1c84f73e5ba90b485ef7ca7e9b8677319559e4ac10bfc40aa1df819078b00d3fe2698d5fb3d81e78e7341686ce3088181db30fe55626ad"
    };
  },
  getMessages() {
    return this.state.messages;
  },
  show_big_image(url){
    this.setState({big_image:url,show_big_image:true});
  },
  getMoreMessages(){
    if (!this.state.isRefreshing) {
      this.setState({isRefreshing:true});
      var offset = this.state.totalMessageLength - this.state.messages.length - 26;
      var doOrNot = true;
      var getTotal = 25;
      if (offset >= 0) {
        offset = offset
      }else if (offset < 0 && offset > -25) {
        getTotal = getTotal + offset;
        offset = 0;
      }else{
        doOrNot = false;
        this.setState({isRefreshing:false});
      }
      if (doOrNot) {
        // Alert.alert("data:",offset+'/'+getTotal);
        chatAPI.chatroom_more_message(this.props.accessToken,this.props.uuid,this.props.chatData.id,this.props.chatroomId,offset)
        .then((response) => response.text())
        .then((responseText) => {
          var data = JSON.parse(responseText)
          console.log(data);
          var new_messages = [];
          var i = 0;
          var tp = [];
          var itv = setInterval(function(){
            console.log('receive msg index:',i,"to the begining");
            tp.unshift(this.handleReceive(data.messageList[i],false,true));
            i = i+1;
            if (i == getTotal) {
              clearInterval(itv);
              this.handleReceive(tp,false,false,true);
              this.setState({isRefreshing:false})
            }
          }.bind(this),1)
        })
      }
    }
  },
  showImagePicker:function(){
    if (this.state.messages[this.state.messages.length-1].text != '對方已經離開聊天') {
      var options = {
        title: '傳送照片', // specify null or empty string to remove the title
        cancelButtonTitle: '取消',
        takePhotoButtonTitle: '照張相', // specify null or empty string to remove this button
        chooseFromLibraryButtonTitle: '選取相片', // specify null or empty string to remove this button
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
          var xhr = new XMLHttpRequest();
          xhr.open('POST', "http://chat.colorgy.io/upload/upload_chat_image");
          xhr.onload = () => {
            if (xhr.status == 200) {
              var url = JSON.parse(xhr.responseText).result;
              ToastAndroid.show('上傳完成',ToastAndroid.SHORT);
              var content = {imgSrc: url};
              chatAPI.sendMessage(this.state.io,this.state.chatroomId,this.props.chatData.id,this.state.socketId, "image", content);
              var msg = {type:'image',content:content,userId:this.props.userId,date:new Date()};
            }

            if (!xhr.responseText) {
              Alert.alert(
                'Upload failed',
                'No response payload.'
              );
              return;
            }
          };
          var formdata = new FormData();
          var file = {
            uri: source3.uri,
            type: 'image/jpeg',
            name: 'photo.jpg',
          };
          formdata.append('file', file);
          xhr.send(formdata);
        }
      });
    }else{
      Alert.alert('對方已離開聊天室');
    }
  },
  handleReceive(message,firstLoad,getMore,getMoreOk) {
    if (getMoreOk) {
      this.setState({messages:message.concat(this.state.messages)});
      // Alert.alert('system',JSON.stringify(message));
    }else if(message){
      if (message && message.chatProgress) {
        this.update_chatProgress(message.chatProgress)
      }
      if (!firstLoad && !getMore) {
        this.setState({totalMessageLength:this.state.totalMessageLength+1});
        console.log(this.state.totalMessageLength);
      }
      if (message.userId && (message.userId != this.props.chatData.id || firstLoad || message.type == 'image' || getMore)) {
        var msg = {
          image: {uri:this.props.friendImage},
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
        if (message.userId == this.props.chatData.id) {
          msg.position = 'right';
          msg.image = null;
        };
        console.log(msg.image);
        if (getMore) {
          return msg
          // var tp = [];
          // tp.push(msg);
          // this.setState({messages:tp.concat(this.state.messages)});
        }else{
          this.setState({messages:this.state.messages.concat(msg)});
        }
      };
    }
  },
  componentWillMount(){
    this.props.dispatch(hideAppTabBar());
  },
  componentWillUnmount(){
    this.props.dispatch(showAppTabBar());
  },
  updateAvatar(data){
     if(this.state.friend_data.id == data.userId1){
      var img = data.imageId1;
     }else{
      var img = data.imageId2;
     }
     var temp = this.state.friend_data;
     temp.image = img;
     this.setState({friend_data:temp});
  },
  update_chatProgress(value){
    if (parseInt(value)>100) {
      var temp = 100
    }else{
      var temp = parseInt(value);
    }
    this.setState({chatProgress:value})
  },
  componentDidMount(){
    BackAndroid.addEventListener('hardwareBackPress', function() {
      if (this.state.showBigHead) {
        this.setState({showBigHead:false});
      }else{
        this._handleBack();
      }
    }.bind(this));
    DeviceEventEmitter.addListener('keyboardDidShow', this.keyboardWillShow)
    DeviceEventEmitter.addListener('keyboardDidHide', this.keyboardWillHide)
    chatAPI.get_other_user_data(this.props.friendId)
    .then((response)=>{
      var data = JSON.parse(response._bodyInit)
      console.log("get_other_user_data",data);
      this.setState({about:data.result.about});
    })
    chatAPI.connectToServer()
    .then((socket)=>{
        this.setState({io:socket});
        chatAPI.connectToChatRoom(this.state.io,this.props.chatData.id,this.props.chatroomId,this.props.uuid,this.props.accessToken)
        .then((response)=>{
          console.log(response);
          if (response.statusCode == 200) {
            var info = response.body.result;
            console.log(info);
            this.update_chatProgress(info.chatProgress);
            this.setState({totalMessageLength:parseInt(info.totalMessageLength)});
            for (var i = info.messageList.length - 1; i >= 0; i--) {
              this.handleReceive(info.messageList[i],true);
            }
            this.setState({chatroomId:info.chatroomId,messageList:info.messageList,socketId:info.socketId});
            this.state.io.on('chatroom',function(msg){
              console.log(msg);
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
    if (this.state.messages[this.state.messages.length-1].text != '對方已經離開聊天') {
      console.log(message);
      this.setState({messages:this.state.messages.concat([message])});
      chatAPI.sendMessage(this.state.io,this.state.chatroomId,this.props.chatData.id,this.state.socketId, "text", {text:message.text});
    }else{
      Alert.alert('對方已離開聊天室');
    }
  },
  handleMenu(){
    this.setState({menuOpen:!this.state.menuOpen})
  },
  handleAlert(title,content,button){
    Alert.alert(
      title,
      content,
      button
    )
  },
  pureface(){
    this.setState({menuOpen:!this.state.menuOpen});
  },
  leave(){
    console.log('leaving...');
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
    this.state.io.disconnect();
    this.props.data_refresh();
  },
  showBigHead(){
    this.setState({showBigHead:!this.state.showBigHead});
  },
  handleScroll(event){
    console.log(event);
  },
  keyboardWillShow: function(e) {
    // Alert.alert('keyboard event..');
    this.setState({
      keyboardHeighting: Dimensions.get('window').height - e.endCoordinates.height,
    })
  },
  keyboardWillHide: function(e) {
    // Alert.alert('keyboard event..');
    this.setState({
      keyboardHeighting: Dimensions.get('window').height
    })
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
            { title: '返回', icon: require('../../assets/images/back_Icons.png'), onPress: this._handleBack, show: 'always' },
            { title: '更多', icon: leftIcon, onPress: this.handleMenu, show: 'always' }
          ]}
        >
        <View>
          <GiftedMessenger
            getMoreMessages={this.getMoreMessages}
            handleScroll={this.handleScroll}
            ref={(c) => this._GiftedMessenger = c}
            autoFocus={false}
            isRefreshing={this.state.isRefreshing}
            messages={this.getMessages()}
            handleSend={this.handleSend}
            maxHeight={this.state.keyboardHeighting - 85}
            photoAvilible={true}
            showImagePicker={this.showImagePicker}
            onImagePress={this.showBigHead}
            show_big_image={this.show_big_image}
            styles={{
              bubbleLeft: {
                backgroundColor: null,
                marginRight: 70,
                borderWidth:1,
                borderColor:'black',
                borderRadius:5,
                flex:1
              },
              bubbleRight: {
                backgroundColor: '#F89680',
                marginLeft: 70,
                borderRadius:5,
                flex:1
              },
            }}
          />
          {this.state.menuOpen?
            <View style={{flexDirection:'row',position:'absolute',height:90,width:Dimensions.get('window').width,backgroundColor:'rgba(0,0,0,.5)',top:0,left:0}}>
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
        {this.state.showBigHead?
          <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center',position:'absolute',top:0,left:0,height:Dimensions.get('window').height,width:Dimensions.get('window').width,backgroundColor:'rgba(0,0,0,.5)'}}>
            <Image
                style={{borderWidth:3,borderColor:"#FFF",width:Dimensions.get('window').width/2,height:Dimensions.get('window').width/2,borderRadius:Dimensions.get('window').width/4}}
                source={{uri: this.state.friend_data.image}}>
            </Image>
            <View style={{left:Dimensions.get('window').width/3-50,top:-30,position:'relative',paddingTop:5,paddingBottom:5,paddingLeft:20,paddingRight:20,borderRadius:15,backgroundColor:"#F89680"}}>
              <Text style={{textAlign:'center',color:'white'}}>{this.state.chatProgress}%</Text>
            </View>
            <Text style={{fontSize:20,color:'white'}}>{this.state.friend_data.alias}</Text>
            <Text style={{fontSize:12,color:'white'}}>{this.props.chatRoomData.lastAnswer}</Text>
            <View style={{padding:10,width:Dimensions.get('window').width/10*7,borderColor:'rgb(200,200,200)',borderWidth:1.5,borderRadius:5,marginTop:30}}>
              <Text style={{color:'rgb(230,230,230)',textAlign:'center',fontSize:16}}>{this.state.about.school}</Text>
              <Text style={{color:'rgb(230,230,230)',textAlign:'center',fontSize:16}}>{this.state.about.horoscope}{this.state.about.horoscope == '' || this.state.about.habitancy == ''?null:'/'}{this.state.about.habitancy}</Text>
              {this.state.about.passion == '' && this.state.about.expertise == '' && this.state.about.conversation ==''?<Text style={{color:'rgb(230,230,230)',textAlign:'center'}}>神秘的他沒留下簡介...</Text>:null}
              {this.state.about.conversation != ''?<Text style={{color:'rgb(170,170,170)',marginTop:10}}>想聊的話題：<Text style={{color:'rgb(230,230,230)'}}>{this.state.about.conversation}</Text></Text>:null}
              {this.state.about.passion != ''?<Text style={{color:'rgb(170,170,170)'}}>最近熱衷的事：<Text style={{color:'rgb(230,230,230)'}}>{this.state.about.passion}</Text></Text>:null}
              {this.state.about.expertise != ''?<Text style={{color:'rgb(170,170,170)'}}>專精的事情：<Text style={{color:'rgb(230,230,230)'}}>{this.state.about.expertise}</Text></Text>:null}
            </View>
            <TouchableNativeFeedback onPress={this.showBigHead}>
              <View style={{position:'absolute',top:40,right:20}}>
                <Image
                  style={{width:20,height:20}}
                  source={require('../../assets/images/delete_messenger.png')} />
              </View>
            </TouchableNativeFeedback>
          </View>
        :null}
        {this.state.show_dialog?<Dialog
          title={'編輯暱稱'}
          content={'此修改暱稱只有你看得到'}
          options={[{text:'取消',method:this.cancel_dialog},{text:'確定',color:'#F89680',method:this.submit_nickname}]}/>:null}
        {this.state.show_big_image?
          <View style={{backgroundColor:'rgb(30,30,30)',position:'absolute',top:0,left:0,height:Dimensions.get('window').height,width:Dimensions.get('window').width,justifyContent:'center',alignItems:'center'}}>
            <TouchableNativeFeedback onPress={()=>this.setState({show_big_image:false})}>
              <View style={{
                backgroundColor:'rgba(0,0,0,.1)',
                position:'absolute',
                top:0,
                left:0,
                height:Dimensions.get('window').height,
                width:Dimensions.get('window').width,
                justifyContent:'center',
                alignItems:'center'}}>
              </View>
            </TouchableNativeFeedback>
            <ImageResizing uri={this.state.big_image} />
            <TouchableNativeFeedback onPress={()=>this.setState({show_big_image:false})}>
              <View style={{position:'absolute',top:25,left:5}}>
                <Image
                  style={{width:30,height:30}}
                  source={require('../../assets/images/back@2x.png')} />
              </View>
            </TouchableNativeFeedback>
          </View>
        :null}
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
