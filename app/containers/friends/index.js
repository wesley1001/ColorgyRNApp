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
  BackAndroid
} from 'react-native';
import { connect } from 'react-redux/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Text from '../../components/Text';
import TitleBarLayout from '../../components/TitleBarLayout';
import TitleBarActionIcon from '../../components/TitleBarActionIcon';

import ga from '../../utils/ga';

var Hellos = React.createClass({

  componentWillMount() {
  },

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', function() {
      this.props.navigator.pop();
    }.bind(this));
  },

  componentWillReceiveProps(nextProps) {
  },

  _reportRouteUpdate() {
  },

  render() {
    return (
      <TitleBarLayout
        enableOffsetTop={this.props.translucentStatusBar}
        offsetTop={this.props.statusBarHeight}
        style={[this.props.style,{paddingTop:25,backgroundColor:'white'}]}
        title="打招呼"
        textColor={"#000"}
        color={"#FFF"}
        leftAction={
          <TitleBarActionIcon onPress={this._handleBack}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TitleBarActionIcon>
        }
      >
        <ScrollView style={{flex:1,marginTop:6/PixelRatio.get()}}>
          <View>
            <View style={{paddingTop:10,paddingBottom:10,height:100,backgroundColor:'white',flexDirection:'row',marginBottom:6/PixelRatio.get()}}>
              <View style={[styles.allCenter,{flex:1}]}>
                  <Image
                    style={{width:60,height:60,borderRadius:60/2}}
                    source={{uri: 'http://www.saveimg.com/images/2014/04/06/15320942105762524820291295669347nxkjMS.jpg'}} />
              </View>
              <View style={{flex:3,paddingLeft:5}}>
                <View style={{justifyContent:'center',flex:1}}>
                  <Text style={{fontSize:18,}}>超級大魟魚</Text>
                </View>
                <View style={{justifyContent:'center',flex:1}}>
                  <Text style={{fontSize:13,color:"#F89680"}}>我最喜歡就是浪漫電影我最喜歡</Text>
                </View>
                <View style={{justifyContent:'center',flex:1}}>
                  <Text style={{fontSize:15,}}>大魟魚...什麼名字啊？？</Text>
                </View>
              </View>
              <View style={{flex:1}}>
                <Text style={{marginTop:10}}>。</Text>
              </View>
            </View>
            <View style={{flexDirection:'row',marginTop:2/PixelRatio.get()}}>
              <View style={[styles.allCenter,{flex:1,margin:1/PixelRatio.get(),backgroundColor:'white',height:45}]}>
                <Image
                  style={{width:30,height:30}}
                  source={{uri: 'data:image/png;base64,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'}} />
              </View>
              <View style={[styles.allCenter,{flex:1,margin:1/PixelRatio.get(),backgroundColor:'white',height:45}]}>
                <Image
                  style={{width:30,height:30}}
                  source={{uri: 'data:image/png;base64,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'}} />
              </View>
            </View>
          </View>
        </ScrollView>
      </TitleBarLayout>
    );
  }
});

var Friends = React.createClass({

  componentWillMount() {
  },

  componentDidMount() {
  },

  componentWillReceiveProps(nextProps) {
  },

  _reportRouteUpdate() {
  },

  render() {
    return (
      <TitleBarLayout
        enableOffsetTop={this.props.translucentStatusBar}
        offsetTop={this.props.statusBarHeight}
        style={[this.props.style,{paddingTop:25,backgroundColor:'white'}]}
        title="好朋友"
        textColor={"#000"}
        color={"#FFF"}
        leftAction={
          <TitleBarActionIcon onPress={this._handleBack}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TitleBarActionIcon>
        }
      >
      <TouchableOpacity style={{flex:1,}} onPress={this.goToHello}>
        <View style={[styles.allCenter,{backgroundColor:'white',flexDirection:'row'}]}>
            <Text style={{fontSize:18,color:'#000',}}>打招呼 </Text>
            <View style={{backgroundColor:"#F89680",width:20,height:20,borderRadius:10}}>
              <Text style={{textAlign:'center',fontSize:15,color:'#FFF'}}>2</Text>
            </View>
        </View>
      </TouchableOpacity>
        <ScrollView style={{flex:7,marginTop:6/PixelRatio.get()}}>
          <View style={{paddingTop:10,paddingBottom:10,height:100,backgroundColor:'white',flexDirection:'row',marginBottom:6/PixelRatio.get()}}>
            <View style={[styles.allCenter,{flex:1}]}>
                <Image
                  style={{width:60,height:60,borderRadius:60/2}}
                  source={{uri: 'http://www.saveimg.com/images/2014/04/06/15320942105762524820291295669347nxkjMS.jpg'}} />
            </View>
            <View style={{flex:3,paddingLeft:5}}>
              <View style={{justifyContent:'center',flex:1}}>
                <Text style={{fontSize:18,}}>超級大魟魚</Text>
              </View>
              <View style={{justifyContent:'center',flex:1}}>
                <Text style={{fontSize:13,color:"#F89680"}}>我最喜歡就是浪漫電影我最喜歡</Text>
              </View>
              <View style={{justifyContent:'center',flex:1}}>
                <Text style={{fontSize:15,}}>大魟魚...什麼名字啊？？</Text>
              </View>
            </View>
            <View style={{flex:1}}>
              <Text style={{marginTop:10}}>2小時</Text>
            </View>
          </View>
        </ScrollView>
      </TitleBarLayout>
    );
  },
  goToHello(){
    this.props.navigator.push({id:'hello'});
  }
});

var Navi = React.createClass({
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
  _configureScene: function(route) {
    return Navigator.SceneConfigs.PushFromRight;
  },
  _renderScene: function(route, navigator) {
    _navigator = navigator;
    switch(route.id) {
      case 'home':
        return (
          <Friends
            navigator={_navigator}/>
        );
      case 'hello':
        return (
          <Hellos
            navigator={_navigator}/>
        );
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
