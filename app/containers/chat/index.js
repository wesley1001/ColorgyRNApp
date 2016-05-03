import React, {
  StyleSheet,
  View,
  WebView,
  ProgressBarAndroid,
  TouchableNativeFeedback,
  TextInput,
  ScrollView,
  Dimensions,
  Image,
  Alert,
  BackAndroid,
  PixelRatio,
  PanResponder,
  AsyncStorage,
  LayoutAnimation,
  Navigator,
  RefreshControl,
  ToastAndroid,
  PullToRefreshViewAndroid,
  IntentAndroid
} from 'react-native';

const DropDown = require('react-native-dropdown');
const {
  Select,
  Option,
  OptionList,
  updatePosition
} = DropDown;

import { connect } from 'react-redux/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Text from '../../components/Text';
import TitleBarLayout from '../../components/TitleBarLayout';
import TitleBarActionIcon from '../../components/TitleBarActionIcon';
import { hideAppTabBar, showAppTabBar } from '../../actions/appTabActions';
import Dialog from '../../components/Dialog'
import Status from '../../components/Status'
import chatAPI from '../../utils/chatAPI';
import colorgyAPI from '../../utils/colorgyAPI';

var ImageWand = require('../../components/react-native-imagewand');

import Report from './../report';

import ga from '../../utils/ga';

var UIImagePickerManager = require('NativeModules').ImagePickerManager;

var source_for_update;
var WelcomeView = React.createClass({
  getInitialState(){
    return{
      letSVerify:false,
      haveSend:false,
      verifing:false,
      SendAlert:false,
      verifingSuccess:false
    }
  },
  async _loadInitialState() {
    try {
      var value = await AsyncStorage.getItem('chat_state_haveSend');
      if (value !== null){
        this.setState({haveSend: true});
      } else {
        this.setState({haveSend: false});
      }
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  },
  async _chat_state_haveSend() {
    try {
      await AsyncStorage.setItem("chat_state_haveSend", "true");
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  },
  verify(){
    this._chat_state_haveSend();
    fetch('https://colorgy.io:443/api/v1/me.json?fields=organization_code&&access_token='+this.props.accessToken)
    .then(function(data) {
      if(JSON.parse(data._bodyInit).organization_code && JSON.parse(data._bodyInit).organization_code!='' && JSON.parse(data._bodyInit).organization_code!= undefined){
        var v = true;
      }else{
        var v = false;
      }
      if (v) {
        this.setState({verifing:false,verifingSuccess:true});
        // alert('可！(2)');
        setTimeout(function() {
          // alert('好！(2)');
          this.ok()
        }.bind(this),200)
        this.props.leaveIntro();
      }else{
        this.setState({letSVerify:true});
      }
    }.bind(this))
  },
  componentDidMount() {
    this._loadInitialState().done();
  },
  render() {
    return(
      <View style={styles.allCenter}>
          <Image
            style={{width:268/2.2,height:259/2.2,marginBottom:10}}
            source={require('./../../assets/images/mohoochat_icon.png')} />
        <Text style={{marginBottom:5,fontSize:18}}>歡迎光臨模糊聊</Text>
        <Text style={{marginBottom:20,fontSize:12}}>別管長怎樣，就讓我們盡情聊天</Text>
        <TouchableNativeFeedback onPress={this.verify}>
          <View style={styles.mainBtn}>
            <Text style={styles.mainBtnText}>開始驗證</Text>
          </View>
        </TouchableNativeFeedback>
        {this.state.letSVerify?<Dialog
          title="驗證學校信箱"
          content="發送後趕快去收信吧～"
          options={[null,{text:'發送',method:this.send,color:'#F89680'}]}/>:null}
        {this.state.SendAlert?<Status img="status_send_success"/>:null}
        {this.state.haveSend?<Status img="status_go_get_email"
                button={{text:"收到驗證信了",method:this.iGotMail}}
                secondaryButton={{text:'還是沒收到信？',method:this.humanVerify}}/>:null}
        {this.state.verifing?<Status img="status_verifying"/>:null}
        {this.state.verifingSuccess?<Status img="status_success"/>:null}
      </View>
    )
  },
  send(email){
    this.setState({letSVerify:false,SendAlert:true});
    setTimeout(function() {
      this._chat_state_haveSend().done();
      this.setState({SendAlert:false,haveSend:true});
    }.bind(this),1000)
    // 寄認證信
    var data = {
      user_email:{
        'email':email
      }
    };
    fetch('https://colorgy.io/api/v1/me/emails.json?access_token='+this.props.accessToken,{
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body:JSON.stringify(data)
    }).then(function(data) {
      console.log(data);
    })
  },
  iGotMail(){
    this.setState({verifing:true,haveSend:false});
    // 串認證信
    fetch('https://colorgy.io:443/api/v1/me.json?fields=organization_code&&access_token='+this.props.accessToken)
    .then(function(data) {
      if(JSON.parse(data._bodyInit).organization_code && JSON.parse(data._bodyInit).organization_code!='' && JSON.parse(data._bodyInit).organization_code!= undefined){
        var v = true;
      }else{
        var v = false;
      }
      if (v) {
        this.setState({verifing:false,verifingSuccess:true});
        // alert('可！');
        setTimeout(function() {
          // alert('好！');
          this.ok();
          this.props.leaveIntro();
        }.bind(this),200)
      }else{
        this.setState({verifing:false});
        Alert.alert('驗證失敗Ｑ＿Ｑ','也許是你沒有按驗證信又或是你的網路不是很正常～')
      }
    }.bind(this))
  },
  ok(){
    this.props.ok();
  },
  openLinkURL(){
    var url = 'https://colorgy.io/user_manual_validation/sso_new_session?access_token='+this.props.accessToken;
    IntentAndroid.canOpenURL(url, (supported) => {
      if (supported) {
        IntentAndroid.openURL(url);
      } else {
        Alert.alert('系統訊息','您沒有可以打開驗證網頁的APP，請進入以下網址以人工驗證:'+url);
      }
    });
  },
  humanVerify(){
    Alert.alert(
      '使用人工驗證',
      '不如再檢查ㄧ次學校信箱吧～\n因為此驗證所需時間較長（2天）',
      [
        {text: '取消', onPress: () => console.log('ok..')},
        {text: '驗證', onPress: () => this.openLinkURL()},
      ]
    )
  }
});

var UploadImageView = React.createClass({
  getInitialState(){
    return{
      avatarSource:'',
    }
  },
  componentDidMount(){
    this.props.showAppTabBar();
  },
  render() {
    return(
      <View style={styles.allCenter}>
          <ImageWand
            blur={4}
            style={{width:259/2,height:259/2,marginBottom:10,borderRadius:259/4,borderWidth:5,borderColor:'white'}}
            src={this.props.default_imgSrc}
          />
        <Text style={{marginBottom:5,fontSize:18}}>展開ㄧ段冒險</Text>
        <Text style={{marginBottom:20,fontSize:12}}>頭貼經過模糊處理，唯有越聊越清晰～</Text>
          <View style={{flexDirection:'row'}}>
            <TouchableNativeFeedback onPress={this.props.pickPhotoOrTakeAPhoto}>
              <View style={[styles.mainBtn_dis,{margin:10}]}>
                <Text style={styles.mainBtnText_dis}>上傳頭貼</Text>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={this.ok}>
              <View style={[styles.mainBtn,{margin:10}]}>
                <Text style={styles.mainBtnText}>使用此頭貼</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
      </View>
    )
  },
  ok(){
    this.props.okImage();
    this.props._chat_state_haveUploadImage();
  },
});

var PostNameView = React.createClass({
  getInitialState(){
    return{text:'',length:0,test:'',chinese_count:0,ok:true}
  },
  onChangingText(text){
    if (text.match(/\w+/g)!=null) {
      var length = Math.floor(text.length-text.match(/\w+/)[0].length/2);
      var chinese_count =  Math.floor(text.length-text.match(/\w+/)[0].length);
    }else{
      var length = 0
      var chinese_count = 0;
    };
    this.setState({
      text:text,
      length:length,
      chinese_count:chinese_count,
    });
    chatAPI.check_name_exists()
    .then((response)=>{
      if(JSON.parse(response._bodyInit).result == 'ok'){
        this.setState({ok:true});
      }else{
        this.setState({ok:false});
      }
    })
  },
  render(){
    return(
      <View style={styles.allCenter}>
        <View style={{position:'absolute',top:0}}>
          <Image
            style={{width:Dimensions.get('window').width,height:50}}
            source={require('./../../assets/images/statusBar1.png')} />
        </View>
        <View style={styles.allCenter}>
          <Text style={{marginBottom:20}}>為自己取個閃亮亮的名字吧！</Text>
          <View style={{marginBottom:20}}>
            <TextInput
                multiline={true}
                maxLength={ 10 - this.state.chinese_count}
                style={{height: 40, borderColor: 'gray', borderWidth: 3/ PixelRatio.get(),width:Dimensions.get('window').width/5*4}}
                onChangeText={(text) => this.onChangingText(text)}
                value={this.state.text}
            />
            <Text style={{color:'#979797',textAlign:'right',width:Dimensions.get('window').width/5*4}}>{this.state.length}/5</Text>
            {!this.state.ok?<Text style={{color:'red',textAlign:'right',width:Dimensions.get('window').width/5*4}}>此名稱已被人使用</Text>:null}
          </View>
          <TouchableNativeFeedback onPress={this.submit}>
            <View style={styles.mainBtn}>
              <Text style={styles.mainBtnText}>下一題</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    )
  },
  submit(){
    if (this.state.ok && this.state.text.length>0) {
      this.props.postName(this.state.text);
    }else if(this.state.text.length==0){
      Alert.alert('請輸入名字！');
    }else{
      Alert.alert('此名稱已有人用了！');
    }
  }
})

var AnswerView = React.createClass({
  getInitialState(){
    return{text:'',length:0}
  },
  render(){
    return(
      <View style={styles.allCenter}>
        <View style={{position:'absolute',top:0}}>
          <Image
            style={{width:Dimensions.get('window').width,height:50}}
            source={require('./../../assets/images/statusBar2.png')} />
        </View>
        <View style={{position:'absolute',top:0}}>
          <Image
            style={{width:Dimensions.get('window').width,height:93*Dimensions.get('window').width/720,top:50}}
            source={require('./../../assets/images/chat_layout_announcement.png')} />
        </View>
        <View style={styles.allCenter}>
          <Text style={{marginBottom:20}}>{this.props.question_today.question}</Text>
          <View style={{marginBottom:20}}>
            <TextInput
                multiline={true}
                maxLength={20}
                style={{height: 40, borderColor: 'gray', borderWidth: 3/ PixelRatio.get(),width:Dimensions.get('window').width/5*4}}
                onChangeText={(text) => this.setState({text:text,length:text.length})}
                value={this.state.text}
            />
            <Text style={{color:'#979797',textAlign:'right',width:Dimensions.get('window').width/5*4}}>{this.state.length}/20</Text>
          </View>
          <TouchableNativeFeedback onPress={()=>this.props.postAnswer(this.state.text)}>
            <View style={styles.mainBtn}>
              <Text style={styles.mainBtnText}>開始聊</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    )
  }
});

var ProfileFirstLook = React.createClass({
  getInitialState(){
    return {
      dialog:false,
      been:false,
      report_view:false,
      readyToBang:false,
    }
  },
  componentDidMount(){
    BackAndroid.addEventListener('hardwareBackPress', function() {
      if (this.state.dialog) {
        this.setState({dialog:false});
      }else{
        this.props.navigator.pop();
        this.props.showAppTabBar();
      }
    }.bind(this));
    chatAPI.hi_check_hi(this.props.accessToken,this.props.uuid,this.props.chatData.id,this.props.data.id)
    .then((response)=>{
      console.log(response);
      if (JSON.parse(response._bodyInit).result == 'already said hi') {
        this.setState({been:true});
      };
      if (JSON.parse(response._bodyInit).result == "target already said hi") {
        this.setState({readyToBang:true});
      }
    })
  },
  back(){
    if (this.state.report_view) {
      this.setState({report_view:false})
    }else{
      this.props.navigator.pop();
      this.props.showAppTabBar();
    }
  },
  block(){
    chatAPI.users_block_user(this.props.accessToken,this.props.uuid,this.props.chatData.id,this.props.data.id);
    this.props.navigator.push({id:'report',friendId:this.props.data.id});
  },
  report(){
    this.props.navigator.push({id:'report',friendId:this.props.data.id});
  },
  render(){
    console.log("this.props.data",this.props.data);
    var about = this.props.data.about;
    var counterArray = [];
    if (about.school != '') {
      counterArray.push(about.school);
    }
    if (about.habitancy != '') {
      counterArray.push(about.habitancy);
    }
    if (about.horoscope != '') {
      counterArray.push(about.horoscope);
    }
    var dot_count = counterArray.length-1;
    var top_string = '';
    for (var i = 0; i < counterArray.length; i++) {
      top_string = top_string + counterArray[i];
      if (dot_count>0) {
        top_string = top_string +' .';
        dot_count = dot_count - 1;
      }
    }
    return(
      <View style={{flex:1}}>
        <ScrollView style={{marginBottom:50}}>
            <View style={{backgroundColor:'#FAF7F5'}}>
              <Image
                style={{alignItems:'center',width:Dimensions.get('window').width,height:Dimensions.get('window').width}}
                source={{uri: this.props.data.avatar_blur_2x_url}}>
                <Image
                  style={{width:Dimensions.get('window').width/10*9,height:Dimensions.get('window').width/10*9/607*80,position:'relative',top:Dimensions.get('window').width/5*4,padding:5}}
                  source={require('../../assets/images/chat_dialog_big.png')}>
                    <Text style={{textAlign:'center',color:'white',fontSize:16,marginTop:7}}>{this.props.data.lastAnswer}</Text>
                </Image>
              </Image>
              <View style={{}}>
                <View style={{marginLeft:Dimensions.get('window').width/10*0.4,padding:15,backgroundColor:'white',width:Dimensions.get('window').width/10*9.2,marginBottom:6/PixelRatio.get(),marginTop:6/PixelRatio.get()}}>
                  <Text style={{color:"#4A4A4A",textAlign:'center'}}>{top_string}</Text>
                </View>
                {this.props.data.about.conversation == '' && this.props.data.about.expertise == '' && this.props.data.about.passion == ''
                  ?
                  <View style={{justifyContent:'center',flexDirection:'column',height:100,backgroundColor:'#FFF',marginLeft:Dimensions.get('window').width/10*0.4,padding:15,width:Dimensions.get('window').width/10*9.2,marginBottom:6/PixelRatio.get(),marginTop:6/PixelRatio.get()}}>
                    <Image
                      style={{alignSelf:'center',marginBottom:15}}
                      source={require('../../assets/images/info@1x.png')} />
                    <Text style={{textAlign:'center',color:'gray'}}>神秘的他沒留下簡介</Text>
                  </View>
                  :
                  <View style={{backgroundColor:'#FFF',marginLeft:Dimensions.get('window').width/10*0.4,padding:15,width:Dimensions.get('window').width/10*9.2,marginBottom:6/PixelRatio.get(),marginTop:6/PixelRatio.get()}}>
                    <View style={{marginLeft:Dimensions.get('window').width/10*0.4,padding:15,width:Dimensions.get('window').width/10*9.2,marginBottom:6/PixelRatio.get(),marginTop:6/PixelRatio.get()}}>
                      <Text style={{color:'#F89680',marginBottom:3}}>想聊的話題</Text>
                      <Text style={{color:'#979797',marginBottom:3}}>{this.props.data.about.conversation}</Text>
                    </View>
                    <View style={{marginLeft:Dimensions.get('window').width/10*0.4,padding:15,width:Dimensions.get('window').width/10*9.2,marginBottom:6/PixelRatio.get(),marginTop:6/PixelRatio.get()}}>
                      <Text style={{color:'#F89680',marginBottom:3}}>最近熱衷的事</Text>
                      <Text style={{color:'#979797',marginBottom:3}}>{this.props.data.about.passion}</Text>
                    </View>
                    <View style={{marginLeft:Dimensions.get('window').width/10*0.4,padding:15,width:Dimensions.get('window').width/10*9.2,marginBottom:6/PixelRatio.get(),marginTop:6/PixelRatio.get()}}>
                      <Text style={{color:'#F89680',marginBottom:3}}>專精的事情</Text>
                      <Text style={{color:'#979797',marginBottom:3}}>{this.props.data.about.expertise}</Text>
                    </View>
                  </View>
                }
              </View>
           </View>
         </ScrollView>
        <TouchableNativeFeedback onPress={this.report_view_toggle}>
          <View style={{position:'absolute', top:15, paddingLeft:15, paddingRight:15, right:0}}>
            <Image
              style={{width:6/3*2,height:28/3*2}}
              source={require('../../assets/images/chat_more_orange.png')} />
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback onPress={this.back}>
          <View style={{position:'absolute', top:5, left:5,padding:10}}>
            <Image
              style={{width:18,height:18}}
              source={require('../../assets/images/chat_delete_orange.png')} />
          </View>
        </TouchableNativeFeedback>
        <View style={[styles.allCenter,{position:'absolute',bottom:0,backgroundColor:"#3B3A3B",width:Dimensions.get('window').width,padding:10}]}>
          <TouchableNativeFeedback onPress={this.sayHello}>
            <View style={this.state.been?[styles.mainBtnWhite,{width:Dimensions.get('window').width/5*4}]:[styles.mainBtn,{width:Dimensions.get('window').width/5*4}]}>
              <Text style={this.state.been?[styles.mainBtnTextWhite,{textAlign:'center'}]:[styles.mainBtnText,{textAlign:'center'}]}>{this.state.been?"已打招呼":'打招呼'}</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
        {this.state.report_view?
          <View style={{position:'absolute',top:0,bottom:0,left:0,right:0}}>
            <TouchableNativeFeedback onPress={this.report_view_toggle}><View style={{backgroundColor:'rgba(0,0,0,0)',position:'absolute',top:0,bottom:0,left:0,right:0}}></View></TouchableNativeFeedback>
            <View style={{borderRadius:5,backgroundColor:'#979797',width:80,position:'absolute',right:20,top:40}}>
              <TouchableNativeFeedback onPress={this.block}>
                <View style={{padding:10,borderBottomColor:'#FFF',borderBottomWidth:1}}><Text style={{color:'#FFF',textAlign:'center'}}>封鎖對方</Text></View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback onPress={this.report}>
                <View style={{padding:10}}><Text style={{color:'#FFF',textAlign:'center'}}>檢舉對方</Text></View>
              </TouchableNativeFeedback>
            </View>
          </View>:null
        }
        {this.state.dialog?<Dialog
          title="打招呼"
          content="簡短的問候你的未來知心～"
          word_limit={10}
          pressBlack={this.closeDialog}
          options={[null,{text:'送出',method:this.hello,color:'#F89680'}]}/>:null}
      </View>
    )
  },
  closeDialog(){
    this.setState({dialog:false});
  },
  sayHello(){
    if (this.state.been == true) {
      Alert.alert('你已經對他打過招呼了唷～');
    }else{
      this.setState({dialog:true});
    }
  },
  report_view_toggle(){
    this.setState({report_view:!this.state.report_view});
  },
  hello(text){
    this.props.say_hello(this.props.data.id,text);
    this.setState({dialog:false});
    ToastAndroid.show('已送出招呼語',ToastAndroid.SHORT);
    if (this.state.readyToBang) {
      Alert.alert('恭喜你們跟對方互相打招呼啦','趕快開始跟對方聊天吧！');
    }
    this.setState({been:true});
  }
});

var SelfEdit = React.createClass({
  componentDidMount(){
    BackAndroid.addEventListener('hardwareBackPress', function() {
      this.props.navigator.pop();
      this.props.showAppTabBar();
    }.bind(this));
    this.props.hidePaddingTop();
    console.log('SelfEdit:',this.props.chatData);
  },
  _handleBack(){
      this.props.navigator.pop();
      this.props.showPaddingTop();
      this.props.showAppTabBar();
  },
  _update(){
    chatAPI.update_about(this.props.accessToken,this.props.uuid,this.props.chatData.id,this.state.data.about)
    .then((response)=>{
      console.log(response);
      ToastAndroid.show('已為您更新！',ToastAndroid.SHORT);
    })
  },
  getInitialState(){
    return{
      data:this.props.chatData.data,
      id:this.props.chatData.id
    }
  },
  onChangingText(data,text){
    var datas = this.state.data;
    if (data == 'name') {
      datas[data] = text;
    }else{
      datas['about'][data] = text;
    }
    this.setState({data:datas});
  },
  uploadImage(){
    this.props.uploadAvatar();
  },
  render(){
    return(
      <View style={{flex:1}}>
        <TitleBarLayout
          enableOffsetTop={this.props.translucentStatusBar}
          offsetTop={this.props.statusBarHeight}
          style={[this.props.style,{backgroundColor:'white',flex:1}]}
          title="全部"
          actions={[
            { title: '返回', icon: require('../../assets/images/icon_arrow_back_white.png'), onPress: this._handleBack, show: 'always' },
            { title: '更新', icon: require('../../assets/images/icon_check_active.png'), onPress: this._update, show: 'always' }
          ]}
        >
          <ScrollView style={{flex:1,backgroundColor:"#fff"}}>
            <TouchableNativeFeedback onPress={this.uploadImage}>
              <View style={[styles.allCenter,{backgroundColor:"#FAF7F5"}]}>
                <Image
                  style={{borderWidth:6,borderColor:"#FFF",margin:15,marginTop:50,width:Dimensions.get('window').width/2,height:Dimensions.get('window').width/2,borderRadius:Dimensions.get('window').width/4}}
                  source={{ uri: this.props.chatData && this.props.chatData.data && this.props.chatData.data.avatar_url }} />
              </View>
            </TouchableNativeFeedback>
            <View style={{paddingTop:10,paddingBottom:10,paddingLeft:20,paddingRight:20}}>
              <Text >暱稱</Text>
              <TextInput
                multiline={true}
                style={{height: 40, borderColor: 'gray', borderWidth: 3/ PixelRatio.get(),width:Dimensions.get('window').width/5*4}}
                onChangeText={(text) => this.onChangingText('name',text)}
                value={this.state.data.name}/>
            </View>
            <View style={{paddingTop:10,paddingBottom:10,paddingLeft:20,paddingRight:20}}>
              <Text >星座</Text>
              <TextInput
                multiline={true}
                style={{height: 40, borderColor: 'gray', borderWidth: 3/ PixelRatio.get(),width:Dimensions.get('window').width/5*4}}
                onChangeText={(text) => this.onChangingText('horoscope',text)}
                value={this.state.data.about.horoscope}
                maxLength={3}/>
            </View>
            <View style={{paddingTop:10,paddingBottom:10,paddingLeft:20,paddingRight:20}}>
              <Text >學校</Text>
              <Text style={{paddingLeft:5}}>{this.state.data.about.school}</Text>
            </View>
            <View style={{paddingTop:10,paddingBottom:10,paddingLeft:20,paddingRight:20}}>
              <Text >居住地</Text>
              <TextInput
                multiline={true}
                style={{height: 40, borderColor: 'gray', borderWidth: 3/ PixelRatio.get(),width:Dimensions.get('window').width/5*4}}
                onChangeText={(text) => this.onChangingText('habitancy',text)}
                value={this.state.data.about.habitancy}
                maxLength={3}/>
            </View>
            <View style={{paddingTop:10,paddingBottom:10,paddingLeft:20,paddingRight:20}}>
              <Text >想聊的話題</Text>
              <TextInput
                multiline={true}
                style={{height: 40, borderColor: 'gray', borderWidth: 3/ PixelRatio.get(),width:Dimensions.get('window').width/5*4}}
                onChangeText={(text) => this.onChangingText('conversation',text)}
                value={this.state.data.about.conversation}/>
            </View>
            <View style={{paddingTop:10,paddingBottom:10,paddingLeft:20,paddingRight:20}}>
              <Text >現在熱衷的事情</Text>
              <TextInput
                multiline={true}
                style={{height: 40, borderColor: 'gray', borderWidth: 3/ PixelRatio.get(),width:Dimensions.get('window').width/5*4}}
                onChangeText={(text) => this.onChangingText('passion',text)}
                value={this.state.data.about.passion}/>
            </View>
            <View style={{paddingTop:10,paddingBottom:10,paddingLeft:20,paddingRight:20}}>
              <Text >專精的事情</Text>
              <TextInput
                multiline={true}
                style={{height: 40, borderColor: 'gray', borderWidth: 3/ PixelRatio.get(),width:Dimensions.get('window').width/5*4}}
                onChangeText={(text) => this.onChangingText('expertise',text)}
                value={this.state.data.about.expertise}/>
            </View>
          </ScrollView>
        </TitleBarLayout>
        <Image
          style={{width:Dimensions.get('window').width,height:Dimensions.get('window').width/720*93,position:'absolute',top:55}}
          source={require('../../assets/images/hurry_info.png')} />
      </View>
    )
  }
});

var StrangerList = React.createClass({
  getInitialState(){
    return{
      filter: 'all',
      strangerList: [],
      page:0,
      isRefreshing:false,
      like_me_list:[],
      loading:true,
    }
  },
  submit(text){
    this.props.send_answer(text);
  },
  componentDidMount(){
    console.log("get_available_target on strangerList");
    this.get_available_target('unspecified',0);
    this.get_like_me_list();
  },
  edit_self(){
    this.props.navigator.push({id:'self_edit',refresh_data:this.props.refresh_data});
    this.props.hideAppTabBar();
  },
  refresh_data(){
    this.setState({isRefreshing: true});
    if (this.state.filter == 'all') {
      this.get_available_target('unspecified',0);
    }else{
      this.get_available_target(this.state.filter,0);
    }
    setTimeout(function() {
      this.setState({isRefreshing: false});
    }.bind(this),500)
  },
  render(){
    return(
      <View style={{flex:1,backgroundColor:'#f89680',paddingTop: this.props.translucentStatusBar && this.props.statusBarHeight}}>
        <View style={{height:55,backgroundColor:'#f89680',flexDirection:'row'}}>
          <TouchableNativeFeedback onPress={()=>this.changeFilter('all')}>
            <View style={this.state.filter== 'all'?[styles.topTab,styles.topTabSelected]:styles.topTab}>
              <Text style={this.state.filter== 'all'?[styles.topTabText,styles.topTabTextSelected]:styles.topTabText}>全部</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={()=>this.changeFilter('male')}>
            <View style={this.state.filter== 'male'?[styles.topTab,styles.topTabSelected]:styles.topTab}>
              <Text style={this.state.filter== 'male'?[styles.topTabText,styles.topTabTextSelected]:styles.topTabText}>男生</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={()=>this.changeFilter('female')}>
            <View style={this.state.filter== 'female'?[styles.topTab,styles.topTabSelected]:styles.topTab}>
              <Text style={this.state.filter== 'female'?[styles.topTabText,styles.topTabTextSelected]:styles.topTabText}>女生</Text>
            </View>
          </TouchableNativeFeedback>
          <View style={styles.topTab}></View>
          <TouchableNativeFeedback onPress={this.edit_self}>
            <View style={[styles.topTab,{}]}>
              <Image
                style={{width:22,height:22,alignSelf:'center'}}
                source={require('../../assets/images/profile_Icons@3x.png')} />
            </View>
          </TouchableNativeFeedback>
        </View>
        <PullToRefreshViewAndroid
        style={{flex: 1}}
        refreshing={this.state.isRefreshing}
        onRefresh={this.refresh_data}
        colors={['#FFF', '#FFF', '#FFF']}
        progressBackgroundColor={'#F89680'}
        >
        <ScrollView
          style={{flex:1}}
          onLayout={this.handleOnLayout}
          onContentSizeChange={this.handleSizeChange}
          onScroll={this.handleScroll}>
          {this.state.strangerList.map(function(st,index) {
            if (this.state.strangerList.length == 1) {
              return(
                <View style={{flexDirection:'row'}}>
                  <TouchableNativeFeedback key={index} onPress={()=>this.open_profile(this.state.strangerList[index])}>
                    <View>
                      <Image
                        style={{backgroundColor:'rgba(0,0,0,.1)',width:Dimensions.get('window').width/2,borderLeftWidth:1,borderBottomWidth:1,borderRightWidth:1,borderColor:'white',height:Dimensions.get('window').width/2}}
                        source={{uri: this.state.strangerList[index].avatar_blur_2x_url}} >
                          <View style={{position:'absolute',top:Dimensions.get('window').width/3,justifyContent:'center'}}>
                            <Image
                              style={{width:Dimensions.get('window').width/2/5*4,height:Dimensions.get('window').width/2/5*4/290*98.8,marginLeft:Dimensions.get('window').width/20}}
                              source={require('../../assets/images/chat_dialog.png')} >
                              <Text style={{color:'white',fontSize:12,marginLeft:5,marginTop:3}}>{this.state.strangerList[index].lastAnswer}</Text>
                            </Image>
                          </View>
                      </Image>
                    </View>
                  </TouchableNativeFeedback>
                </View>
              )
            }else if (index%2==1) {
              return(
                <View style={{flexDirection:'row'}}>
                  <TouchableNativeFeedback key={index-1} onPress={()=>this.open_profile(this.state.strangerList[index-1])}>
                    <View>
                      <Image
                        style={{backgroundColor:'rgba(0,0,0,.1)',width:Dimensions.get('window').width/2,borderLeftWidth:1,borderBottomWidth:1,borderColor:'white',height:Dimensions.get('window').width/2}}
                        source={{uri: this.state.strangerList[index-1].avatar_blur_2x_url}} >
                          <View style={{position:'absolute',top:Dimensions.get('window').width/3,justifyContent:'center'}}>
                            <Image
                              style={{width:Dimensions.get('window').width/2/5*4,height:Dimensions.get('window').width/2/5*4/290*98.8,marginLeft:Dimensions.get('window').width/20}}
                              source={require('../../assets/images/chat_dialog.png')} >
                              <Text style={{color:'white',fontSize:12,marginLeft:5,marginTop:3}}>{this.state.strangerList[index-1].lastAnswer}</Text>
                            </Image>
                          </View>
                      </Image>
                    </View>
                  </TouchableNativeFeedback>
                  <TouchableNativeFeedback key={index} onPress={()=>this.open_profile(this.state.strangerList[index])}>
                    <View>
                      <Image
                        style={{backgroundColor:'rgba(0,0,0,.1)',width:Dimensions.get('window').width/2,borderLeftWidth:1,borderBottomWidth:1,borderRightWidth:1,borderColor:'white',height:Dimensions.get('window').width/2}}
                        source={{uri: this.state.strangerList[index].avatar_blur_2x_url}} >
                          <View style={{position:'absolute',top:Dimensions.get('window').width/3,justifyContent:'center'}}>
                            <Image
                              style={{width:Dimensions.get('window').width/2/5*4,height:Dimensions.get('window').width/2/5*4/290*98.8,marginLeft:Dimensions.get('window').width/20}}
                              source={require('../../assets/images/chat_dialog.png')} >
                              <Text style={{color:'white',fontSize:12,marginLeft:5,marginTop:3}}>{this.state.strangerList[index].lastAnswer}</Text>
                            </Image>
                          </View>
                      </Image>
                    </View>
                  </TouchableNativeFeedback>
                </View>
              )
            }else{
              return null;
            }
          }.bind(this))}
        </ScrollView>
        </PullToRefreshViewAndroid>
        {this.state.loading?
          <View>
            <Image
              style={{alignSelf:'center',width:30,height:30}}
              source={require('../../assets/images/loaging.gif')} />
          </View>
          :null}
        {this.props.haveAnswerToday?null:<Dialog
          title="本日清晰問"
          content={this.props.problem_today}
          word_limit={20}
          options={[null,{text:'提交',method:this.submit,color:'#F89680'}]}/>}
      </View>
    )
  },
  get_available_target(gender,page){
      chatAPI.get_available_target(
        this.props.accessToken,
        this.props.uuid,
        this.props.chatData.id,
        gender,
        page)
      .then((response)=>{
        var newList = JSON.parse(response._bodyInit).result;
        for (var i = newList.length - 1; i >= 0; i--) {
          if( this.state.like_me_list.indexOf(newList[i].id)>=0){
            var temp = newList[i]
            newList.splice(i,1);
            newList.unshift(temp);
          }
        }
        this.setState({strangerList:newList,loading:false});
        console.log('update ---> strangerList',this.state.strangerList);
      })
  },
  get_like_me_list(){
    console.log("=========get_like_me_list==========")
    chatAPI.hi_get_my_list(
      this.props.accessToken,
      this.props.uuid,
      this.props.chatData.id
    )
    .then((response)=>{
      this.setState({like_me_list:JSON.parse(response._bodyInit).result})
    })
  },
  changeFilter(type){
    this.setState({strangerList:[],page:0});
    this.setState({filter:type,loading:true});
    if (type == 'all') {
      this.get_available_target("unspecified",0);
    }else{
      this.get_available_target(type,0);
    }
  },
  update(){
    if (this.state.filter == 'all') {
      var gender = 'unspecified'
    }else{
      var gender = this.state.filter;
    }
    chatAPI.get_available_target(
      this.props.accessToken,
      this.props.uuid,
      this.props.chatData.id,
      gender,
      this.state.page+1)
    .then((response)=>{
      var newList = JSON.parse(response._bodyInit).result;
      for (var i = newList.length - 1; i >= 0; i--) {
        if( this.state.like_me_list.indexOf(newList[i].id)>=0){
          var temp = newList[i]
          newList.splice(i,1);
          newList.unshift(temp);
        }
      }
      this.setState({strangerList:this.state.strangerList.concat(newList),page:this.state.page+1});
      console.log('update ---> strangerList',this.state.strangerList);
    })
  },
  handleScroll: function(event: Object) {
   if (event.nativeEvent.layoutMeasurement.height+event.nativeEvent.contentOffset.y == event.nativeEvent.contentSize.height) {
    this.update()
   };
  },
  open_profile(data){
    this.props.navigator.push({id:'profile',data:data,refresh_data:this.props.refresh_data});
    this.props.hideAppTabBar();
  }
});

var CroppingImage = React.createClass({
  getInitialState(){
    return{
      h_w:(Dimensions.get('window').height-Dimensions.get('window').width)/2,
      original:{top:(Dimensions.get('window').height-Dimensions.get('window').width)/2,left:0},
      originalPosition: {top:(Dimensions.get('window').height-Dimensions.get('window').width)/2,left:0},
      window_width:Dimensions.get('window').width,
      imagesWidth:Dimensions.get('window').width,
      imagesHeight:Dimensions.get('window').width,
      rule:1,
      cropping_data:{x:0,y:0},
      image_data:{},
      original_size:{}
    }
  },
  componentDidMount(){
    this.measureImage();
  },
  componentWillUnmount(){
    this.props.showAppTabBar();
  },
  componentWillMount: function() {
    this.props.hideAppTabBar()
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The guesture has started. Show visual feedback so the user knows
        // what is happening!

        // gestureState.{x,y}0 will be set to zero now
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        if (this.state.rule>=1) {
          this.measureImage();
          if (this.state.originalPosition.left+gestureState.vx*10>0 || this.state.originalPosition.left+gestureState.vx*10 + this.state.image_data.width< this.state.window_width) {
            var  new_left = this.state.originalPosition.left;
          }else{
            var  new_left = this.state.originalPosition.left+gestureState.vx*10;
          }

          if ((this.state.originalPosition.top+gestureState.vy*10)-(Dimensions.get('window').height-Dimensions.get('window').width)/2>0 || (this.state.originalPosition.top+gestureState.vy*10)+this.state.image_data.width < Dimensions.get('window').width + (Dimensions.get('window').height-Dimensions.get('window').width)/2 ) {
            var new_top = this.state.originalPosition.top;
          }else{
            var new_top = this.state.originalPosition.top+gestureState.vy*10;
          }
          this.setState({originalPosition:{top:new_top,left:new_left}});
          console.log(this.state.originalPosition);
        };
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        if (this.state.rule>=1) {
          this.setState({cropping_data:{x:this.state.original.top-this.state.originalPosition.top, y:this.state.original.left-this.state.originalPosition.left,rule:this.state.rule}});
        };
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    });
  },
  measureImage(mode) {
    // this.refs.image.measure(this.logImageLayout);
  },

  logImageLayout(ox, oy, width, height, px, py) {
    this.setState({image_data:{width:width,px:px,py}});
    console.log(this.state.image_data);
  },
  onImageLayout: function (e) {
    var layout = e.nativeEvent.layout;
    // var aspectRatio = this.props.originalWidth / this.props.originalHeight;
    // var measuredHeight = layout.width / aspectRatio;
    // var currentHeight = layout.height;
    console.log("layout",layout);
  },
  _imageInfo: function(event){
    console.log(event.width, event.height);
    var original_size = {width:event.width,height:event.height};
    this.setState({original_size:original_size});
    var bi = event.height/event.width;
    var width = this.state.imagesWidth;
    var height = width*bi;
    this.setState({imagesHeight:height});
    while(this.state.imagesHeight<Dimensions.get('window').width){
      this.bigger()
    }
  },
  render(){
    return(
      <View style={[{backgroundColor:'rgb(30,30,30)'},styles.allCenter]}>
          <ImageWand
            style={{width:this.state.imagesWidth,height:this.state.imagesHeight,position:'absolute',top:this.state.originalPosition.top,left:this.state.originalPosition.left}}
            src={this.props.source_url}
            ref='image'
            shouldNotifyLoadEvents={true}
            onImageInfo={this._imageInfo}
          />
          <View style={{width:Dimensions.get('window').width,height:(Dimensions.get('window').height - Dimensions.get('window').width)/2,position:'absolute', backgroundColor:'rgba(0,0,0,.3)',left:0,top:0}}></View>
          <View {...this._panResponder.panHandlers} style={{width:Dimensions.get('window').width,height:Dimensions.get('window').width,position:'absolute',top:(Dimensions.get('window').height - Dimensions.get('window').width)/2,left:0,backgroundColor:'rgba(0,0,0,0)',borderColor:'blue',borderWidth:1}}></View>
          <View style={{width:Dimensions.get('window').width,height:(Dimensions.get('window').height - Dimensions.get('window').width)/2,position:'absolute', backgroundColor:'rgba(0,0,0,.3)',left:0,top:Dimensions.get('window').width+(Dimensions.get('window').height - Dimensions.get('window').width)/2}}></View>
          <TouchableNativeFeedback onPress={this.bigger}>
            <View style={this.props.mode=='self_edit'?{position:'absolute',top:30,left:10}:{position:'absolute', top:10,left:10}}><Text style={{color:'white',fontSize:20}}>放大</Text></View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={this.smaller}>
            <View style={this.props.mode=='self_edit'?{position:'absolute',top:30,right:10}:{position:'absolute', top:10,right:10}}><Text style={{color:'white',fontSize:20}}>縮小</Text></View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={()=>this.submit(this.state.original_size,this.props.source_base64,this.state.cropping_data)}>
            <View style={{position:'absolute', top:Dimensions.get('window').width+(Dimensions.get('window').height - Dimensions.get('window').width)/2+20,right:40}}><Text style={{color:'white',fontSize:20}}>確定</Text></View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={this.back}>
            <View style={{position:'absolute', top:Dimensions.get('window').width+(Dimensions.get('window').height - Dimensions.get('window').width)/2+20,left:40}}><Text style={{color:'white',fontSize:20}}>重選</Text></View>
          </TouchableNativeFeedback>
      </View>
    )
  },
  back(){
    if(this.props.mode == 'self_edit'){
      _navigator.pop();
    }else{
      this.props.rechoose();
    }
  },
  submit(original_size,path,data){
    if (this.props.mode=='self_edit') {
      this.props.submit(original_size,path,data,true);
    }else{
      this.props.submit(original_size,path,data);
    }
  },
  bigger(){
    this.setState({imagesWidth:this.state.imagesWidth*1.1,imagesHeight:this.state.imagesHeight*1.1,rule:this.state.rule*1.1})
  },
  smaller(){
    if (this.state.rule>1) {
      this.setState({imagesWidth:this.state.imagesWidth/1.1,imagesHeight:this.state.imagesHeight/1.1,rule:this.state.rule/1.1});
      this.measureImage()
      this.setState({originalPosition:this.state.original})
    };
  }
});

var MainView = React.createClass({
  render(){
    return(
    <View style={{flex:1}}>
        <Navigator
          style={{flex:1}}
          initialRoute = {{ id: 'list' }}
          configureScene={this._configureScene}
          renderScene={this._renderScene}
        />
      </View>
    )
  },
  _configureScene: function(route) {
    return Navigator.SceneConfigs.PushFromRight;
  },
  _renderScene: function(route, navigator) {
    _navigator = navigator;
    switch(route.id) {
      case 'list':
        return (
          <StrangerList
            translucentStatusBar={this.props.translucentStatusBar}
            statusBarHeight={this.props.statusBarHeight}
            navigator={_navigator}
            uuid={this.props.uuid}
            accessToken={this.props.accessToken}
            chatData={this.props.chatData}
            showAppTabBar={this.props.showAppTabBar}
            hideAppTabBar={this.props.hideAppTabBar}
            get_available_target={this.props.get_available_target}
            problem_today={this.props.problem_today}
            send_answer={this.props.send_answer}
            haveAnswerToday={this.props.haveAnswerToday}
            refresh_data={this.props.refresh_data} />
        );
      case 'report':
        return(
          <Report
            translucentStatusBar={this.props.translucentStatusBar}
            statusBarHeight={this.props.statusBarHeight}
            navigator={_navigator}
            uuid={this.props.uuid}
            accessToken={this.props.accessToken}
            chatData={this.props.chatData}
            showAppTabBar={this.props.showAppTabBar}
            hideAppTabBar={this.props.hideAppTabBar}
            showPaddingTop={this.props.showPaddingTop}
            friendId={route.friendId}
            hidePaddingTop={this.props.hidePaddingTop}
            data_refresh={this.props.refresh_data}
            type="report"/>
        )
      case 'profile':
        return (
          <ProfileFirstLook
            translucentStatusBar={this.props.translucentStatusBar}
            statusBarHeight={this.props.statusBarHeight}
            navigator={_navigator}
            data={route.data}
            showAppTabBar={this.props.showAppTabBar}
            uuid={this.props.uuid}
            accessToken={this.props.accessToken}
            chatData={this.props.chatData}
            hideAppTabBar={this.props.hideAppTabBar}
            say_hello={this.props.say_hello}
            refresh_data={route.refresh_data}/>
        );
      case 'self_edit':
        return (
          <SelfEdit
            translucentStatusBar={this.props.translucentStatusBar}
            statusBarHeight={this.props.statusBarHeight}
            showPaddingTop={this.props.showPaddingTop}
            hidePaddingTop={this.props.hidePaddingTop}
            navigator={_navigator}
            uuid={this.props.uuid}
            accessToken={this.props.accessToken}
            chatData={this.props.chatData}
            showAppTabBar={this.props.showAppTabBar}
            hideAppTabBar={this.props.hideAppTabBar}
            uploadAvatar={this.props.uploadAvatar}
            refresh_data={route.refresh_data}/>
        )
      case 'cropping':
        return(
          <CroppingImage
            translucentStatusBar={this.props.translucentStatusBar}
            statusBarHeight={this.props.statusBarHeight}
            navigator={_navigator}
            hideAppTabBar={route.hideAppTabBar}
            showAppTabBar={route.showAppTabBar}
            source_base64={route.source_base64}
            cropping_data={route.cropping_data}
            source_url={route.source_url}
            submit={route.submit}
            mode="self_edit"
            rechoose={route.rechoose}/>
        )
    }
  },

});

var Chat = React.createClass({

  getInitialState() {
    return{
      title:'模糊聊',
      havePhoto:false,
      havePhotoCrop:true,
      haveNamed:false,
      source_url:'',
      onLogSignUp:true,
      cropping_data:{},
      onImage:false,
      question_today:{},
      haveSend:false,
      ProfileFirstLook:false,
      paddingTopHide:false,
      haveUploadImage:false,
      haveVerify:false,
      source_base64:'',
      newImage:undefined
    }
  },

  async _loadInitialState() {
    try {
      var value = await AsyncStorage.getItem('chat_state_haveSignUp');
      if (value !== null){
        this.setState({onLogSignUp: false});
      } else {
        this.setState({onLogSignUp: true});
      }
      var chat_state_haveSend = await AsyncStorage.getItem('chat_state_haveSend');
      if (chat_state_haveSend !== null) {
        this.setState({haveSend: true});
      }else{
        this.setState({haveSend: false});
      }
      var chat_state_haveUploadImage = await AsyncStorage.getItem('chat_state_haveUploadImage');
      if (chat_state_haveUploadImage !== null) {
        this.setState({haveUploadImage: true});
      }else{
        this.setState({haveUploadImage: false});
      }
      var chat_state_haveVerify = await AsyncStorage.getItem('chat_state_haveVerify');
      if (chat_state_haveVerify !== null) {
        this.setState({haveVerify: true});
      }else{
        this.setState({haveVerify: false});
      }
      var lastest_answer = await AsyncStorage.getItem('lastest_answer');
      if (lastest_answer !== null) {
        var now = new Date();
        now = JSON.stringify(now);
        if (now.split('T')[0] == lastest_answer.split('T')[0]) {
            console.log('today is answered...')
            this.props.answerToday();
        }
      }
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  },

  async _chat_state_haveSignUp() {
    try {
      await AsyncStorage.setItem("chat_state_haveSignUp", 'true');
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  },

  async _chat_state_haveUploadImage() {
    try {
      await AsyncStorage.setItem("chat_state_haveUploadImage", 'true');
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  },

  async _chat_state_haveVerify() {
    try {
      await AsyncStorage.setItem("chat_state_haveVerify", 'true');
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  },

  async _lastest_answer_store() {
    var time = new Date();
    try {
      await AsyncStorage.setItem("lastest_answer", JSON.stringify(time));
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  },
  componentWillMount(){
    this.props.initChatStatus();
  },
  componentDidMount() {
    this._loadInitialState().done();
    this.hideAppTabBarOrShow();
    chatAPI.get_question()
    .then((response)=>{
      console.log(response);
      this.setState({question_today:response})
    });
  },
  hideAppTabBar(){
    this.props.dispatch(hideAppTabBar());
  },
  showAppTabBar(){
    this.props.dispatch(showAppTabBar());
  },
  hideAppTabBarOrShow(){
    if (this.props.chatStatus == 2 && !this.state.havePhotoCrop){
      this.props.dispatch(hideAppTabBar());
    }else{
      this.props.dispatch(showAppTabBar());
    }
  },
  okImage(){
    this.setState({haveUploadImage:true});
    this.props.updateChatStatus(2);
  },
  okVerify(){
    Alert.alert('系統訊息','驗證成功');
    this._chat_state_haveVerify();
    // this.props.updateChatStatus(2);
    this.props.initChatStatus();
  },
  leaveIntro(){
    this.setState({haveSend:true})
  },
  render() {
    if (this.props.chatStatus == 5) {
      var ReturnView = <View style={styles.allCenter}><Text>系統已將您停權...</Text></View>
    }else if (this.props.chatStatus == -1) {
      var ReturnView = <View style={styles.allCenter}><Text>系統連線中...</Text></View>
    }else if (this.props.chatStatus == 0 || !this.state.haveSend) {
      var ReturnView = <WelcomeView leaveIntro={this.leaveIntro} ok={this.okVerify} send={this.sendVerifyMail} accessToken={this.props.accessToken}/>;
    }else if (this.props.chatStatus == 1) {
      var ReturnView = <UploadImageView showAppTabBar={this.showAppTabBar} okImage={this.okImage} _chat_state_haveUploadImage={this._chat_state_haveUploadImage}  onImage={this.state.onImage} default_imgSrc={this.state.newImage || (this.props.chatData && this.props.chatData.data && this.props.chatData.data.avatar_url) || ''} pickPhotoOrTakeAPhoto={this.pickPhotoOrTakeAPhoto}/>;
    // }else if (this.props.chatStatus == 1 ){
    //   var ReturnView = <CroppingImage hideAppTabBar={this.hideAppTabBar} showAppTabBar={this.showAppTabBar} source_base64={this.state.source_base64} cropping_data={this.state.cropping_data} source_url={this.state.source_url} submit={this.submit_crop} rechoose={this.rechoose_crop}/>
    // }
    }else if(this.props.chatStatus == 2){
      var ReturnView = <PostNameView postName={this.postName}/>;
    }else if (this.props.chatStatus == 3) {
      var ReturnView = <AnswerView postAnswer={this.postAnswer} question_today={this.state.question_today}/>;
    }else{
      var ReturnView = <MainView
        translucentStatusBar={this.props.translucentStatusBar}
        statusBarHeight={this.props.statusBarHeight}
        uuid={this.props.uuid}
        send_answer={this.postAnswer}
        problem_today={this.state.question_today.question}
        haveAnswerToday={this.props.haveAnswerToday}
        refresh_data={this.props.refresh_data}
        get_available_target={this.get_available_target}
        hidePaddingTop={this.hidePaddingTop}
        showPaddingTop={this.showPaddingTop}
        accessToken={this.props.accessToken}
        chatData={this.props.chatData}
        hideAppTabBar={this.hideAppTabBar}
        showAppTabBar={this.showAppTabBar}
        uploadAvatar={this.uploadAvatar}
        say_hello={this.say_hello}/>
    }
    return (
      <View style={{flex:1}}>
        {ReturnView}
      </View>
    );
  },
  hidePaddingTop(){
    // this.setState({paddingTopHide:true});
  },
  uploadAvatar(){
    this.pickPhotoOrTakeAPhoto(true);
  },
  showPaddingTop(){
    // this.setState({paddingTopHide:false});
  },
  submit_crop(data,width){
    // console.log("cropping_data==>",data);
    // var data = data;
    // if (!data.rule) {
    //   data.rule = 1;
    // }
    // var window_width = Dimensions.get('window').width;
    // var moveLeftCount_bi = data.y/window_width*data.rule;
    // var moveTopCount_bi = data.x/window_width*original_size.height/original_size.width*data.rule;
    // var crop_ori_bi = 1/data.rule;
    // console.log(window_width,moveLeftCount_bi,moveTopCount_bi,crop_ori_bi)
    // var x = original_size.width*moveLeftCount_bi;
    // var y = original_size.width*moveTopCount_bi;
    // var w = original_size.width*crop_ori_bi;
    // var h = original_size.width*crop_ori_bi;
    // 上傳相片
    // console.log(source_for_update);
    var data = {
      user:{
        'avatar':source_for_update,
        'avatar_crop_x':0,
        'avatar_crop_y':0,
        'avatar_crop_w':width,
        'avatar_crop_h':width
      }
    };
    console.log(data);
    fetch("https://colorgy.io/api/v1/me.json?access_token="+this.props.accessToken,{
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      body:JSON.stringify(data)
    })
    .then((response)=>{
      // Alert.alert('response:',response._bodyInit);
      var data = JSON.parse(response._bodyInit);
      console.log(data);
      this.setState({newImage:data.avatar_url});
      console.log({
        uuid:this.props.uuid,
        accessToken:this.props.accessToken
      })
      fetch("http://chat.colorgy.io/users/update_from_core",    {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uuid:this.props.uuid,
          accessToken:this.props.accessToken
        })
      })
      .then((response)=>{
        console.log(response);
        // if (self_edit) {
          this.props.initChatStatus();
          // _navigator.pop();
        // }
      })
    })
    // 確定一下
    this.setState({havePhotoCrop:true,cropping_data:data,havePhoto:false});
  },
  rechoose_crop(){
    this.setState({havePhoto:false,source_url:'',source_base64:''});
    this.hideAppTabBarOrShow();
  },
  say_hello(target,msg){
    chatAPI.hi_say_hi(this.props.accessToken,this.props.uuid,this.props.chatData.id,target,msg)
    .then((response)=>{
      console.log(response);
    })
  },
  postName(name){
    chatAPI.update_name(this.props.accessToken,this.props.uuid,this.props.chatData.id,name)
    .then((response)=>{
      console.log(response);
      this.props.updateChatStatus(3)
      this.props.initChatStatus();
    });
    this.setState({haveNamed:true});
  },
  sendVerifyMail(email){

  },
  postAnswer(answer){
    if(answer.length==0){
      Alert.alert('請輸入答案！');
    }else{
      chatAPI.answer_question(this.props.accessToken,this.props.uuid,this.props.chatData.id,this.state.question_today.date,answer)
      .then((response)=>{
        console.log(response);
      });
      this.props.answerToday();
      this._lastest_answer_store();
      // 紀錄已完成資料填寫
      this._chat_state_haveSignUp().done();
      this.props.updateChatStatus(4);
    }
  },
  pickPhotoOrTakeAPhoto(self_edit){
    var options = {
      title: '選擇活動', // specify null or empty string to remove the title
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍攝照片', // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: '上傳相簿照片', // specify null or empty string to remove this button
      cameraType: 'back', // 'front' or 'back'
      mediaType: 'photo', // 'photo' or 'video'
      videoQuality: 'high', // 'low', 'medium', or 'high'
      maxWidth: 3000, // photos only
      maxHeight: 3000, // photos only
      quality: 1, // photos only
      aspectX: 1,
      aspectY: 1,
      allowsEditing: true, // Built in iOS functionality to resize/reposition the image
      noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
      storageOptions: { // if this key is provided, the image will get saved in the documents directory (rather than a temporary directory)
        skipBackup: true, // image will NOT be backed up to icloud
        path: 'images' // will save image at /Documents/images rather than the root
      }
    };
    UIImagePickerManager.showImagePicker(options, (response) => {
      // Alert.alert('Response = ', JSON.stringify(response));

      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.setState({onImage:true});
      }
      else if (response.error) {
        console.log('UIImagePickerManager Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        this.setState({havePhotoCrop:false});
        // You can display the image using either data:
        var source_base = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
        // uri (on android)
        var source = {uri: response.uri, isStatic: true};
        console.log(source_base.uri);
        source_for_update = source_base.uri;
        this.setState({
          source_url: source.uri,
          source_base64:source_base.uri,
          havePhoto: true,
        });
        console.log("this.state.source_base64 == source_base.uri?==>",this.state.source_base64 == source_base.uri)
        // if (self_edit) {
        //   _navigator.push({
        //     id:'cropping',
        //     hideAppTabBar:this.hideAppTabBar,
        //     showAppTabBar:this.showAppTabBar,
        //     source_base64:this.state.source_base64,
        //     cropping_data:this.state.cropping_data,
        //     source_url:this.state.source_url,
        //     submit:this.submit_crop,
        //     rechoose:this.rechoose_crop
        //   });
        // }
        this.submit_crop(source_base,response.height);
      }
    });
  },
});


var styles = StyleSheet.create({
  topTab:{
    justifyContent:'center',
    flex:1,
  },
  topTabRight:{
    justifyContent:'center',
    flex:3,
  },
  topTabSelected:{
    borderBottomColor:'white',
    borderBottomWidth:3
  },
  topTabText:{
    textAlign:'center',
    color:'white'
  },
  topTabTextSelected:{
    color:'white',
  },
  allCenter:{
    justifyContent:'center',
    flex:1,
    alignItems:'center'
  },
  mainBtn:{
    borderWidth:1.2,
    borderColor:'#F89680',
    paddingTop:5,
    paddingBottom:5,
    paddingLeft:15,
    paddingRight:15
  },
  mainBtnWhite:{
    borderWidth:1.2,
    borderColor:'#FFF',
    paddingTop:5,
    paddingBottom:5,
    paddingLeft:15,
    paddingRight:15
  },
  mainBtn_dis:{
    borderWidth:1.2,
    borderColor:'#979797',
    paddingTop:5,
    paddingBottom:5,
    paddingLeft:15,
    paddingRight:15
  },
  mainBtnText_dis:{
    color:'#979797'
  },
  mainBtnText:{
    color:'#F89680'
  },
  mainBtnTextWhite:{
    color:'#FFF'
  }
});

export default connect((state) => ({
  userId: state.colorgyAPI.me && state.colorgyAPI.me.id,
  organizationCode: state.colorgyAPI.me && state.colorgyAPI.me.possibleOrganizationCode,
  navigateBackCount: state.board.navigateBackCount,
  networkConnectivity: state.deviceInfo.networkConnectivity,
  translucentStatusBar: state.deviceInfo.translucentStatusBar,
  statusBarHeight: state.deviceInfo.statusBarHeight
}))(Chat);
