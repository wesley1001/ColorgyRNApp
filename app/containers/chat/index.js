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
  ToastAndroid,
} from 'react-native';
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

import Report from './../report';

import ga from '../../utils/ga';

var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

var WelcomeView = React.createClass({
  getInitialState(){
    return{
      letSVerify:false,
      haveSend:false,
      verifing:false,
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
      await AsyncStorage.setItem("chat_state_haveSend", true);
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  },
  verify(){
    this.setState({letSVerify:true});
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
          options={[null,{text:'發送',method:this.state.send,color:'#F89680'}]}/>:null}
        {this.state.haveSend?<Status img="go_get_mail" 
                button={{text:"收到驗證信了",method:this.iGotMail}}
                secondaryButton={{text:'還是沒收到信？',method:this.humanVerify}}/>:null}
        {this.state.verifing?<Status img="have_get_mail"/>:null}
      </View>
    )
  },
  send(email){
    this.props.send(email);
    this.setState({haveSend:true,letSVerify:false});
    this._chat_state_haveSend().done();
    // 寄認證信
  },
  iGotMail(){
    this.setState({verifing:true,haveSend:false});
    // 串認證信
  },
  humanVerify(){
    Alert.alert(
      '使用人工驗證',
      '不如再檢查ㄧ次學校信箱吧～\n因為此驗證所需時間較長（2天）',
      [
        {text: '取消', onPress: () => console.log('Ask me later pressed')},
        {text: '驗證', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
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
  render() {
    return(
      <View style={styles.allCenter}>
          <Image
            style={{width:259/2,height:259/2,marginBottom:10,borderRadius:259/4,borderWidth:5,borderColor:'white'}}
            source={{uri:this.props.default_imgSrc}} />
        <Text style={{marginBottom:5,fontSize:18}}>展開ㄧ段冒險</Text>
        <Text style={{marginBottom:20,fontSize:12}}>頭貼經過模糊處理，唯有越聊越清晰～</Text>
        {!this.props.onImage?
          <TouchableNativeFeedback onPress={this.props.pickPhotoOrTakeAPhoto}>
            <View style={styles.mainBtn}>
              <Text style={styles.mainBtnText}>上傳頭貼</Text>
            </View>
          </TouchableNativeFeedback>
        :
          <View style={{flexDirection:'row'}}>
            <TouchableNativeFeedback onPress={this.props.pickPhotoOrTakeAPhoto}>
              <View style={[styles.mainBtn_dis,{margin:10}]}>
                <Text style={styles.mainBtnText_dis}>重新選取</Text>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={this.props.upload}>
              <View style={[styles.mainBtn,{margin:10}]}>
                <Text style={styles.mainBtnText}>確認使用</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        }
      </View>
    )
  },
  upload(){

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
      if (JSON.parse(response._bodyInit).result == 'already said hi') {
        this.setState({been:true});
      };
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
                    <Text style={{textAlign:'center',color:'white',fontSize:16,}}>{this.props.data.lastAnswer}</Text>
                </Image>
              </Image>
              <View style={{}}>
                <View style={{marginLeft:Dimensions.get('window').width/10*0.4,padding:15,backgroundColor:'white',width:Dimensions.get('window').width/10*9.2,marginBottom:6/PixelRatio.get(),marginTop:6/PixelRatio.get()}}>
                  <Text style={{color:"#4A4A4A",textAlign:'center'}}>{about.school} . {about.habitancy} . {about.horoscope}</Text>
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
          <View style={{position:'absolute', top:15, right:15}}>
            <Image
              style={{width:6/3*2,height:28/3*2}}
              source={require('../../assets/images/chat_more_orange.png')} />
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback onPress={this.back}>
          <View style={{position:'absolute', top:15, left:15}}>
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
            <View style={{borderRadius:5,backgroundColor:'#979797',width:100,position:'absolute',right:20,top:40}}>
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
          options={[null,{text:'發送',method:this.hello,color:'#F89680'}]}/>:null}
      </View>
    )
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
    this.props.navigator.pop();
    ToastAndroid.show('已送出招呼語',ToastAndroid.SHORT);
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
  render(){
    return(
      <View style={{flex:1}}>
        <TitleBarLayout
          style={[this.props.style,{paddingTop:25,backgroundColor:'white',flex:1}]}
          title="全部"
          textColor={"#000"}
          color={"#FFF"}
          actions={[
            { title: '返回', icon: require('../../assets/images/back_orange.png'), onPress: this._handleBack, show: 'always' },
            { title: '更新', icon: require('../../assets/images/write.png'), onPress: this._update, show: 'always' }
          ]}
        >
          <ScrollView style={{flex:1,backgroundColor:"#fff"}}>
            <View style={[styles.allCenter,{backgroundColor:"#FAF7F5"}]}>
              <Image
                style={{borderWidth:6,borderColor:"#FFF",margin:15,width:Dimensions.get('window').width/2,height:Dimensions.get('window').width/2,borderRadius:Dimensions.get('window').width/4}}
                source={{uri: this.props.chatData.data.avatar_url}} />
            </View>
            <View style={{padding:20}}>
              <Text >暱稱</Text>
              <TextInput
                style={{height: 40, borderColor: 'gray', borderWidth: 3/ PixelRatio.get(),width:Dimensions.get('window').width/5*4}}
                onChangeText={(text) => this.onChangingText('name',text)}
                value={this.state.data.name}/>
            </View>
            <View style={{padding:20}}>
              <Text >星座</Text>
              <TextInput
                style={{height: 40, borderColor: 'gray', borderWidth: 3/ PixelRatio.get(),width:Dimensions.get('window').width/5*4}}
                onChangeText={(text) => this.onChangingText('horoscope',text)}
                value={this.state.data.about.horoscope}/>
            </View>
            <View style={{padding:20}}>
              <Text >學校</Text>
              <Text style={{paddingLeft:5}}>{this.state.data.about.school}</Text>
            </View>
            <View style={{padding:20}}>
              <Text >居住地</Text>
              <TextInput
                style={{height: 40, borderColor: 'gray', borderWidth: 3/ PixelRatio.get(),width:Dimensions.get('window').width/5*4}}
                onChangeText={(text) => this.onChangingText('habitancy',text)}
                value={this.state.data.about.habitancy}/>
            </View>
            <View style={{padding:20}}>
              <Text >想聊的話題</Text>
              <TextInput
                style={{height: 40, borderColor: 'gray', borderWidth: 3/ PixelRatio.get(),width:Dimensions.get('window').width/5*4}}
                onChangeText={(text) => this.onChangingText('conversation',text)}
                value={this.state.data.about.conversation}/>
            </View>
            <View style={{padding:20}}>
              <Text >現在熱衷的事情</Text>
              <TextInput
                style={{height: 40, borderColor: 'gray', borderWidth: 3/ PixelRatio.get(),width:Dimensions.get('window').width/5*4}}
                onChangeText={(text) => this.onChangingText('passion',text)}
                value={this.state.data.about.passion}/>
            </View>
            <View style={{padding:20}}>
              <Text >專精的事情</Text>
              <TextInput
                style={{height: 40, borderColor: 'gray', borderWidth: 3/ PixelRatio.get(),width:Dimensions.get('window').width/5*4}}
                onChangeText={(text) => this.onChangingText('expertise',text)}
                value={this.state.data.about.expertise}/>
            </View>
          </ScrollView>
        </TitleBarLayout>
        <Image
          style={{width:Dimensions.get('window').width,height:Dimensions.get('window').width/720*93,position:'absolute',top:75}}
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
    }
  },
  componentDidMount(){
    console.log("get_available_target on strangerList");
    this.get_available_target('unspecified',0);
  },
  edit_self(){
    this.props.navigator.push({id:'self_edit',refresh_data:this.props.refresh_data});
    this.props.hideAppTabBar();
  },
  render(){
    return(
      <View style={{flex:1}}>
        <View style={{height:55,backgroundColor:'white',flexDirection:'row'}}>
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
                source={require('../../assets/images/chat_self_icon.png')} />
            </View>
          </TouchableNativeFeedback>
        </View>
        <ScrollView style={{flex:1}} onLayout={this.handleOnLayout} onContentSizeChange={this.handleSizeChange} onScroll={this.handleScroll}>
          {this.state.strangerList.map(function(st,index) {
            if (this.state.strangerList.length == 1) {
              return(
                <View style={{flexDirection:'row'}}>
                  <TouchableNativeFeedback key={index} onPress={()=>this.open_profile(this.state.strangerList[index])}>
                    <View>
                      <Image
                        style={{width:Dimensions.get('window').width/2,height:Dimensions.get('window').width/2}}
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
                        style={{width:Dimensions.get('window').width/2,height:Dimensions.get('window').width/2}}
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
                        style={{width:Dimensions.get('window').width/2,height:Dimensions.get('window').width/2}}
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
        this.setState({strangerList:newList});
        console.log('update ---> strangerList',this.state.strangerList);
      })
  },
  changeFilter(type){
    this.setState({strangerList:[],page:0});
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({filter:type});
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
      rule:1,
      cropping_data:{x:0,y:0},
      image_data:{}
    }
  },
  componentDidMount(){
    this.measureImage();
  },
  componentWillMount: function() {
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
        if (this.state.rule>1) {
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
        if (this.state.rule>1) {
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
    this.refs.image.measure(this.logImageLayout);
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
  render(){
    return(
      <View style={[{backgroundColor:'rgb(30,30,30)'},styles.allCenter]}>
          <Image
            style={{width:this.state.imagesWidth,height:this.state.imagesWidth,position:'absolute',top:this.state.originalPosition.top,left:this.state.originalPosition.left}}
            source={{uri:this.props.source_url}} 
            ref='image'
            resizeMode="cover"
            onLayout={this.onImageLayout}
            />
          <View style={{width:Dimensions.get('window').width,height:(Dimensions.get('window').height - Dimensions.get('window').width)/2,position:'absolute', backgroundColor:'rgba(0,0,0,.3)',left:0,top:0}}></View>
          <View {...this._panResponder.panHandlers} style={{width:Dimensions.get('window').width,height:Dimensions.get('window').width,position:'absolute',top:(Dimensions.get('window').height - Dimensions.get('window').width)/2,left:0,backgroundColor:'rgba(0,0,0,0)',borderColor:'blue',borderWidth:1}}></View>
          <View style={{width:Dimensions.get('window').width,height:(Dimensions.get('window').height - Dimensions.get('window').width)/2,position:'absolute', backgroundColor:'rgba(0,0,0,.3)',left:0,top:Dimensions.get('window').width+(Dimensions.get('window').height - Dimensions.get('window').width)/2}}></View>
          <TouchableNativeFeedback onPress={this.bigger}>
            <View style={{position:'absolute', top:10,left:10}}><Text style={{color:'white',fontSize:20}}>放大</Text></View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={this.smaller}>
            <View style={{position:'absolute', top:10,right:10}}><Text style={{color:'white',fontSize:20}}>縮小</Text></View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={()=>this.submit(this.state.cropping_data)}>
            <View style={{position:'absolute', top:Dimensions.get('window').width+(Dimensions.get('window').height - Dimensions.get('window').width)/2+20,right:40}}><Text style={{color:'white',fontSize:20}}>確定</Text></View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={this.back}>
            <View style={{position:'absolute', top:Dimensions.get('window').width+(Dimensions.get('window').height - Dimensions.get('window').width)/2+20,left:40}}><Text style={{color:'white',fontSize:20}}>重選</Text></View>
          </TouchableNativeFeedback>
      </View>
    )
  },
  back(){
    this.props.rechoose();
  },
  submit(){
    this.props.submit();
  },
  bigger(){
    this.setState({imagesWidth:this.state.imagesWidth*1.1,rule:this.state.rule*1.1})
  },
  smaller(){
    if (this.state.rule>1) {
      this.setState({imagesWidth:this.state.imagesWidth/1.1,rule:this.state.rule/1.1});
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
            navigator={_navigator} 
            uuid={this.props.uuid} 
            accessToken={this.props.accessToken} 
            chatData={this.props.chatData} 
            showAppTabBar={this.props.showAppTabBar}
            hideAppTabBar={this.props.hideAppTabBar}
            get_available_target={this.props.get_available_target}
            refresh_data={this.props.refresh_data} />
        );
      case 'report':
        return(
          <Report
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
            showPaddingTop={this.props.showPaddingTop}
            hidePaddingTop={this.props.hidePaddingTop}
            navigator={_navigator}
            uuid={this.props.uuid}
            accessToken={this.props.accessToken}
            chatData={this.props.chatData} 
            showAppTabBar={this.props.showAppTabBar}
            hideAppTabBar={this.props.hideAppTabBar}
            refresh_data={route.refresh_data}/>
        )
    }
  },

});

var Chat = React.createClass({

  getInitialState() {
    return{
      title:'模糊聊',
      havePhoto:false,
      havePhotoCrop:false,
      haveNamed:false,
      source_url:'',
      onLogSignUp:true,
      cropping_data:{},
      onImage:false,
      question_today:{},
      haveSend:false,
      ProfileFirstLook:false,
      paddingTopHide:false,
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
        this.setState({haveSend: false});
      }else{
        this.setState({haveSend: false});
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
      await AsyncStorage.setItem("chat_state_haveSignUp", true);
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
    if (
        this.state.ProfileFirstLook ||
        (!this.state.havePhotoCrop && this.state.havePhoto) || 
        (!this.state.haveNamed && this.state.havePhotoCrop) || 
        (this.state.haveNamed && (!this.state.haveAnsweredToday && this.state.onLogSignUp))
    ) {
      this.props.dispatch(hideAppTabBar());
    }else{
      this.props.dispatch(showAppTabBar());
    }
  },
  render() {
    if (this.props.chatData.id == 'loading') {
      var ReturnView = <WelcomeView send={this.sendVerifyMail}/>;
    }else if (this.state.havePhoto) {
      var ReturnView = <UploadImageView onImage={this.state.onImage} default_imgSrc={this.props.chatData.data.avatar_url} pickPhotoOrTakeAPhoto={this.pickPhotoOrTakeAPhoto}/>;
    }else if (this.state.havePhotoCrop){
      var ReturnView = <CroppingImage source_url={this.state.source_url} submit={this.submit_crop} rechoose={this.rechoose_crop}/>
    }else if(this.props.chatData.data.name == ''){
      var ReturnView = <PostNameView postName={this.postName}/>;
    }else if ((!this.props.haveAnswerToday) && this.state.onLogSignUp) {
      var ReturnView = <AnswerView postAnswer={this.postAnswer} question_today={this.state.question_today}/>;
    }else{
      var ReturnView = <MainView 
        uuid={this.props.uuid}
        refresh_data={this.props.refresh_data}
        get_available_target={this.get_available_target}
        hidePaddingTop={this.hidePaddingTop}
        showPaddingTop={this.showPaddingTop}
        accessToken={this.props.accessToken} 
        chatData={this.props.chatData}
        hideAppTabBar={this.hideAppTabBar}
        showAppTabBar={this.showAppTabBar}
        say_hello={this.say_hello}/>
    }
    return (
      <View style={this.state.paddingTopHide?{flex:1}:{paddingTop:25,flex:1}}>
        {ReturnView}
      </View>
    );
  },
  hidePaddingTop(){
    this.setState({paddingTopHide:true});
  },

  showPaddingTop(){
    this.setState({paddingTopHide:false});
  },
  submit_crop(data){
    this.setState({havePhotoCrop:true,cropping_data:data});
    this.hideAppTabBarOrShow();
  },
  sendVerifyMail(email){
    // 紀錄已寄信
    // await AsyncStorage.setItem("chat_state_haveSend", selectedValue);
  },
  rechoose_crop(){
    this.setState({havePhoto:false,source_url:''});
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
    });
    this.setState({haveNamed:true});
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
      // this._chat_state_haveSignUp().done()
    }
  },
  pickPhotoOrTakeAPhoto(){
    var options = {
      title: '選擇活動', // specify null or empty string to remove the title
      cancelButtonTitle: '使用FB大頭貼',
      takePhotoButtonTitle: '拍攝照片', // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: '上傳相簿照片', // specify null or empty string to remove this button
      cameraType: 'back', // 'front' or 'back'
      mediaType: 'photo', // 'photo' or 'video'
      videoQuality: 'high', // 'low', 'medium', or 'high'
      maxWidth: 1500, // photos only
      maxHeight: 1500, // photos only
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
        this.setState({onImage:true});
      }
      else if (response.error) {
        console.log('UIImagePickerManager Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can display the image using either data:
        var source_base = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
        // uri (on android)
        var source = {uri: response.uri, isStatic: true};
        console.log(source.uri);
        this.setState({
          source_url: source.uri,
          havePhoto: true,
        });
        this.hideAppTabBarOrShow();
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
    borderBottomColor:'#F89680',
    borderBottomWidth:18/ PixelRatio.get()
  },
  topTabText:{
    textAlign:'center',
  },
  topTabTextSelected:{
    color:'#F89680',
  },
  allCenter:{
    justifyContent:'center',
    flex:1,
    alignItems:'center'
  },
  mainBtn:{
    borderWidth:6/ PixelRatio.get(),
    borderColor:'#F89680',
    paddingTop:5,
    paddingBottom:5,
    paddingLeft:15,
    paddingRight:15
  },
  mainBtnWhite:{
    borderWidth:6/ PixelRatio.get(),
    borderColor:'#FFF',
    paddingTop:5,
    paddingBottom:5,
    paddingLeft:15,
    paddingRight:15
  },
  mainBtn_dis:{
    borderWidth:6/ PixelRatio.get(),
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
