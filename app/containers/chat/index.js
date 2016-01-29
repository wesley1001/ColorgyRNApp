import React, {
  StyleSheet,
  View,
  WebView,
  ProgressBarAndroid,
  TouchableHighlight,
  TextInput,
  ScrollView,
  Dimensions,
  Image,
  Alert,
  PixelRatio,
  PanResponder,
  TouchableNativeFeedback,
} from 'react-native';
import { connect } from 'react-redux/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Text from '../../components/Text';
import TitleBarLayout from '../../components/TitleBarLayout';
import TitleBarActionIcon from '../../components/TitleBarActionIcon';
import { hideAppTabBar, showAppTabBar } from '../../actions/appTabActions';


import ga from '../../utils/ga';

var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

var WelcomeView = React.createClass({
  getInitialState(){
    return{
      avatarSource:''
    }
  },
  render() {
    return(
      <View style={styles.allCenter}>
          <Image
            style={{width:268/2.2,height:259/2.2}}
            source={require('./../../assets/images/mohoochat_icon.png')} />
        <Text style={{marginBottom:20}}>歡迎光臨模糊聊</Text>
        <Text style={{marginBottom:20}}>所有的頭貼都被模糊，只有越來越清晰</Text>
        <TouchableHighlight onPress={this.props.pickPhotoOrTakeAPhoto}>
          <View style={styles.mainBtn}>
            <Text style={styles.mainBtnText}>上傳頭貼</Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  },
});

var PostNameView = React.createClass({
  getInitialState(){
    return{text:'',length:0}
  },
  render(){
    return(
      <View style={styles.allCenter}>
        <View style={{position:'absolute',top:0}}>
          <Image
            style={{width:Dimensions.get('window').width,height:50}}
            source={require('./../../assets/images/statusBar1.png')} />
        </View>
        <View>
          <Text style={{marginBottom:20}}>為自己取個閃亮亮的名字吧！</Text>
          <View style={{marginBottom:20}}>
            <TextInput
                maxLength={5}
                style={{height: 40, borderColor: 'gray', borderWidth: 3/ PixelRatio.get(),width:Dimensions.get('window').width/5*4}}
                onChangeText={(text) => this.setState({text:text,length:text.length})}
                value={this.state.text}
            />
            <Text style={{color:'#979797',textAlign:'right',width:Dimensions.get('window').width/5*4}}>{this.state.length}/5</Text>
          </View>
          <TouchableHighlight onPress={this.props.postName}>
            <View style={styles.mainBtn}>
              <Text style={styles.mainBtnText}>確定</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
})

var AnswerView = React.createClass({
  getInitialState(){
    return{text:'',length:0}
  },
  render(){
    return(
      <View style={styles.allCenter}>
        <Text>每日ㄧ問，讓大家更了解你～</Text>
        <Text style={{marginBottom:20}}>你喜歡的電影類型？答案20字以內！</Text>
        <View style={{marginBottom:20}}>
          <TextInput
              maxLength={20}
              style={{height: 40, borderColor: 'gray', borderWidth: 3/ PixelRatio.get(),width:Dimensions.get('window').width/5*4}}
              onChangeText={(text) => this.setState({text:text,length:text.length})}
              value={this.state.text}
          />
          <Text style={{color:'#979797',textAlign:'right',width:Dimensions.get('window').width/5*4}}>{this.state.length}/20</Text>
        </View>
        <TouchableHighlight onPress={this.props.postAnswer}>
          <View style={styles.mainBtn}>
            <Text style={styles.mainBtnText}>繼續</Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
});

var ProfileFirstLook = React.createClass({
  render(){
    return(
      <View style={styles.allCenter}>
        <TouchableHighlight style={{position:'absolute',top:10,left:10}} onPress={this.props.cancel}><View><Text style={{fontSize:30,color:'#F89680'}}>X</Text></View></TouchableHighlight>
        <Image
          style={{width:Dimensions.get('window').width/2.3,height:Dimensions.get('window').width/2.3,borderRadius:Dimensions.get('window').width/4.6,borderWidth:30/ PixelRatio.get(),borderColor:'white',marginBottom:25}}
          source={{uri: 'http://uat-mssip.morganstanley.com/assets/images/people/tiles/michael-asmar.jpg'}} />
        <Text style={{color:'#979797',marginBottom:25,fontSize:16}}>最喜歡看的是浪漫的電影了</Text>
        <TouchableHighlight>
          <View style={styles.mainBtn}>
            <Text style={styles.mainBtnText}>邀請聊</Text>
          </View>
        </TouchableHighlight>
     </View>
    )
  }
});

var StrangerList = React.createClass({
  getInitialState(){
    return{
      filter: 'all',
    }
  },
  render(){
    return(
      <View style={{flex:1}}>
        <View style={{height:55,backgroundColor:'white',flexDirection:'row'}}>
          <TouchableHighlight onPress={()=>this.changeFilter('all')}
                              style={this.state.filter== 'all'?[styles.topTab,styles.topTabSelected]:styles.topTab}>
            <View><Text style={this.state.filter== 'all'?[styles.topTabText,styles.topTabTextSelected]:styles.topTabText}>全部</Text></View>
          </TouchableHighlight>
          <TouchableHighlight onPress={()=>this.changeFilter('male')}
                              style={this.state.filter== 'male'?[styles.topTab,styles.topTabSelected]:styles.topTab}>
            <View><Text style={this.state.filter== 'male'?[styles.topTabText,styles.topTabTextSelected]:styles.topTabText}>男生</Text></View>
          </TouchableHighlight>
          <TouchableHighlight onPress={()=>this.changeFilter('female')}
                              style={this.state.filter== 'female'?[styles.topTab,styles.topTabSelected]:styles.topTab}>
            <View><Text style={this.state.filter== 'female'?[styles.topTabText,styles.topTabTextSelected]:styles.topTabText}>女生</Text></View>
          </TouchableHighlight>
          <View style={{flex:2}}><Text></Text></View>
        </View>
        <ScrollView style={{flex:1}}>
          <View style={{flexDirection:'row'}}>
            <TouchableHighlight onPress={this.props.openProfileFirstLook}>
              <View>
                <Image
                  onPress={this.props.openProfileFirstLook}
                  style={{width:Dimensions.get('window').width/2,height:Dimensions.get('window').width/2}}
                  source={{uri: 'http://uat-mssip.morganstanley.com/assets/images/people/tiles/michael-asmar.jpg'}} >
                    <View>
                      <Text style={{color:'white'}}>Answer</Text>
                    </View>
                </Image>
              </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={this.props.openProfileFirstLook}>
              <View>
                <Image
                  style={{width:Dimensions.get('window').width/2,height:Dimensions.get('window').width/2}}
                  source={{uri: 'http://uat-mssip.morganstanley.com/assets/images/people/tiles/michael-asmar.jpg'}} >
                    <Text>Answer</Text>
                </Image>
              </View>
            </TouchableHighlight>
          </View>
        </ScrollView>
      </View>
    )
  },
  changeFilter(type){
    this.setState({filter:type});
  },
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

var Chat = React.createClass({

  getInitialState() {
    return{
      title:'模糊聊',
      havePhoto:true,
      havePhotoCrop:false,
      haveNamed:false,
      haveAnsweredToday:false,
      source_url:'content://media/external/images/media/70',
      cropping_data:{}
    }
  },

  componentWillMount() {
  },

  componentDidMount() {
    this.hideAppTabBarOrShow();
  },

  componentWillReceiveProps(nextProps) {
  },

  _reportRouteUpdate() {
  },

  hideAppTabBarOrShow(){
    if (!this.state.havePhotoCrop && this.state.havePhoto) {
      this.props.dispatch(hideAppTabBar());
    }else{
      this.props.dispatch(showAppTabBar());
    }
  },

  render() {
    if (!this.state.havePhoto) {
      var ReturnView = <WelcomeView pickPhotoOrTakeAPhoto={this.pickPhotoOrTakeAPhoto}/>;
    }else if (!this.state.havePhotoCrop){
      var ReturnView = <CroppingImage source_url={this.state.source_url} submit={this.submit_crop} rechoose={this.rechoose_crop}/>
    }else if(!this.state.haveNamed){
      var ReturnView = <PostNameView postName={this.postName}/>;
    }else if (!this.state.haveAnsweredToday) {
      var ReturnView = <AnswerView postAnswer={this.postAnswer}/>;
    }else if (this.state.ProfileFirstLook){
      var ReturnView = <ProfileFirstLook cancel={this.cancelProfileFirstLook}/>
    }
    else{
      var ReturnView = <StrangerList openProfileFirstLook={this.openProfileFirstLook} />
    }
    return (
      <View style={{paddingTop:25,flex:1}}>
        {ReturnView}
      </View>
    );
  },
  submit_crop(data){
    this.setState({havePhotoCrop:true,cropping_data:data});
    this.hideAppTabBarOrShow();
  },
  rechoose_crop(){
    this.setState({havePhoto:false,source_url:''});
    this.hideAppTabBarOrShow();
  },
  cancelProfileFirstLook(){
    this.setState({ProfileFirstLook:false});
  },
  openProfileFirstLook(){
    this.setState({ProfileFirstLook:true});
  },
  postName(){
    this.setState({haveNamed:true});
  },
  postAnswer(){
    this.setState({haveAnsweredToday:true});
  },
  pickPhotoOrTakeAPhoto(){
    var options = {
      title: '上傳照片', // specify null or empty string to remove the title
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍張照片', // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: '選張照片', // specify null or empty string to remove this button
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
  mainBtnText:{
    color:'#F89680'
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
