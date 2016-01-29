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
} from 'react-native';
import { connect } from 'react-redux/native';
import _ from 'underscore';

import THEME from '../../constants/THEME';

import colorgyAPI from '../../utils/colorgyAPI';

import { setOverlayElement } from '../../actions/appActions';
import { doCreateAndAddCourse } from '../../actions/tableActions';

import { hideAppTabBar, showAppTabBar } from '../../actions/appTabActions';

import Messenger from './../messenger';
import Text from '../../components/Text';
import TitleBarLayout from '../../components/TitleBarLayout';
import TitleBarActionIcon from '../../components/TitleBarActionIcon';

import ga from '../../utils/ga';

var Friends = React.createClass({
  getInitialState(){
    return{
      search_show:false,
      search_word:'',
      exampleList:[{name:'超級大缸魚',imgSrc:'http://www.saveimg.com/images/2014/04/06/15320942105762524820291295669347nxkjMS.jpg',time:'2小時',answer:'我最喜荒浪㤶店癮惹',lastTalk:'你上次說那什麼來著？'},{name:'超級大紅魚',imgSrc:'http://www.saveimg.com/images/2014/04/06/15320942105762524820291295669347nxkjMS.jpg',time:'2小時',answer:'我最喜荒浪㤶店癮惹',lastTalk:'你上次說那什麼來著？'},{name:'Rocker',imgSrc:'http://www.saveimg.com/images/2014/04/06/15320942105762524820291295669347nxkjMS.jpg',time:'2小時',answer:'我最喜荒浪㤶店癮惹',lastTalk:'你上次說那什麼來著？'},{name:'超級大缸魚',imgSrc:'http://www.saveimg.com/images/2014/04/06/15320942105762524820291295669347nxkjMS.jpg',time:'2小時',answer:'我最喜荒浪㤶店癮惹',lastTalk:'你上次說那什麼來著？'},{name:'超級大紅魚',imgSrc:'http://www.saveimg.com/images/2014/04/06/15320942105762524820291295669347nxkjMS.jpg',time:'2小時',answer:'我最喜荒浪㤶店癮惹',lastTalk:'你上次說那什麼來著？'},{name:'Rocker',imgSrc:'http://www.saveimg.com/images/2014/04/06/15320942105762524820291295669347nxkjMS.jpg',time:'2小時',answer:'我最喜荒浪㤶店癮惹',lastTalk:'你上次說那什麼來著？'}]
    }
  },

  componentWillMount() {
  },

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', function() {
      this.setState({search_show:false,search_word:''});
    }.bind(this));
  },

  componentWillReceiveProps(nextProps) {
  },

  _reportRouteUpdate() {
  },

  handleSearch(){
    this.setState({search_show:true});
  },

  render() {
    var friendList = this.state.exampleList;
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
                  <Text style={{textAlign:'center',fontSize:15,color:'#FFF'}}>2</Text>
                </View>
            </View>
          </TouchableOpacity>
          <ScrollView style={{flex:7,marginTop:6/PixelRatio.get()}}>
            {friendList.map(function(friend, index){
              return(
                <TouchableNativeFeedback key={index} onPress={this.goChat}>
                  <View style={{paddingTop:10,paddingBottom:10,height:100,backgroundColor:'white',flexDirection:'row',marginBottom:6/PixelRatio.get()}}>
                    <View style={[styles.allCenter,{flex:1}]}>
                        <Image
                          style={{width:60,height:60,borderRadius:60/2}}
                          source={{uri: friend.imgSrc}} />
                    </View>
                    <View style={{flex:3,paddingLeft:5}}>
                      <View style={{justifyContent:'center',flex:1}}>
                        <Text style={{fontSize:18,}}>{friend.name}</Text>
                      </View>
                      <View style={{justifyContent:'center',flex:1}}>
                        <Text style={{fontSize:13,color:"#F89680"}}>{friend.answer}</Text>
                      </View>
                      <View style={{justifyContent:'center',flex:1}}>
                        <Text style={{fontSize:15,}}>{friend.lastTalk}</Text>
                      </View>
                    </View>
                    <View style={{flex:1}}>
                      <Text style={{marginTop:10}}>{friend.time}</Text>
                    </View>
                  </View>
                </TouchableNativeFeedback>
              )
            }.bind(this))}
          </ScrollView>
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
  goChat(){
    console.log('gochat');
    this.props.navigator.push({id:'messenger'});
  }
});

var styles = StyleSheet.create({
  allCenter:{
    justifyContent:'center',
    flex:1,
    alignItems:'center'
  },
});


export default connect((state) => ({
  tableStatus: state.table.tableStatus,
  userId: state.colorgyAPI.me && state.colorgyAPI.me.id,
  organizationCode: state.colorgyAPI.me && state.colorgyAPI.me.possibleOrganizationCode,
  courses: state.table.tableCourses,
  networkConnectivity: state.deviceInfo.networkConnectivity,
  windowWidth: state.deviceInfo.windowWidth,
  translucentStatusBar: state.deviceInfo.translucentStatusBar,
  statusBarHeight: state.deviceInfo.statusBarHeight
}))(Friends);