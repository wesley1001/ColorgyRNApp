import React, {
  StyleSheet,
  ToastAndroid,
  View,
  ScrollView,
  Dimensions,
  TouchableNativeFeedback,
  BackAndroid,
  Alert,
  TextInput,
  Image
} from 'react-native';
import { connect } from 'react-redux/native';

import Text from '../../components/Text';
import TitleBarLayout from '../../components/TitleBarLayout';
import TitleBarActionIcon from '../../components/TitleBarActionIcon';
import GhostButton from '../../components/GhostButton';
import Dialog from '../../components/Dialog';
import { setOverlayElement } from '../../actions/appActions';
import { hideAppTabBar, showAppTabBar } from '../../actions/appTabActions';

import ga from '../../utils/ga';
import chatAPI from '../../utils/chatAPI';

var Report = React.createClass({
  componentDidMount(){
    BackAndroid.addEventListener('hardwareBackPress', function() {
      // Alert.alert('請完成表單');
    }.bind(this));
  },
  componentWillMount(){
    this.props.dispatch(hideAppTabBar());
    if (this.props.type == 'report') {
      this.props.hidePaddingTop();
    }
  },
  componentWillUnmount(){
    if (this.props.type == 'block') {
      this.props.dispatch(showAppTabBar());
    }
    if (this.props.type == 'report') {
      this.props.showPaddingTop();
    }
  },
  _handleBack(){
      this.props.navigator.pop();
  },
  getInitialState(){
    return{
      reason:[{title:'感覺被騷掃',selected:false},{title:'對方涉及言語攻擊',selected:false},{title:'太色了',selected:false},{title:'其他',selected:false}],
      text:''

    }
  },
  select_reason(index){
    var temp = this.state.reason;
    temp[index].selected = !temp[index].selected;
    this.setState({reason:temp});
  },
  send_report(){
    var type = [];
    for (var i = this.state.reason.length - 1; i >= 0; i--) {
      if(this.state.reason[i].selected){
        type.push(this.state.reason[i]);
      }
    }
    chatAPI.report_report_user(this.props.accessToken,this.props.uuid,this.props.chatData.id,this.props.friendId,type,this.state.text)
    .then((response)=>{
      console.log(response);
    });
    this.props.navigator.pop();
    this.props.navigator.pop();
    this.props.dispatch(showAppTabBar());
    Alert.alert('謝謝您的回應！');
    this.props.data_refresh();
  },
  render(){
    if (this.props.type == 'block') {
      var title = '封鎖回報'
    }else{
      var title = '檢舉回報'
    }
    return(
      <TitleBarLayout
        enableOffsetTop={this.props.translucentStatusBar}
        offsetTop={this.props.statusBarHeight}
        style={[{backgroundColor:'white'}]}
        title={title}
        textColor={"#000"}
        color={"#FFF"}
        actions={[null,{ title: '返回', icon: require('../../assets/images/chat_delete_orange_64.png'), onPress: this._handleBack, show: 'always' }]}
      >
        <View style={{flex:1,backgroundColor:"#FAF7F5"}}>
          <ScrollView style={{marginBottom:50}}>
              <View>
                <View style={{paddingTop:25,paddingLeft:25,paddingBottom:25,paddingRight:0,marginBottom:20,backgroundColor:'#FFF'}}>
                  <Text style={{color:"#979797"}}>發生了什麼事！？</Text>
                  {this.state.reason.map(function(reason,index) {
                    if (reason.selected) {
                      var img = require('../../assets/images/chat_selected.png');
                    }else{
                      var img = require('../../assets/images/chat_unselected.png');
                    }
                    return(
                      <TouchableNativeFeedback onPress={()=>this.select_reason(index)}>
                        <View key={index} style={{flexDirection:'row',paddingBottom:10,paddingTop:10}}>
                          <View style={{flex:5}}>
                            <Text>{reason.title}</Text>
                          </View>
                          <View style={{flex:1,flexDirection:'row',jusifyContent:'flex-end'}}>
                            <Image
                                style={{width:20,height:20,position:'relative',left:20}}
                                source={img} />
                          </View>
                        </View>
                      </TouchableNativeFeedback>
                    )
                  }.bind(this))}
                </View>
                <View style={{padding:15,marginBottom:20,backgroundColor:'#FFF'}}>
                  <Text style={{color:"#979797"}}>其他原因</Text>
                  <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(text) => this.setState({text})}
                    placeholder="簡單敘述"
                    value={this.state.text}
                  />
                </View>
                <View style={{paddingTop:20,paddingBottom:20,paddingLeft:Dimensions.get('window').width/3,paddingRight:Dimensions.get('window').width/3,flexDirection:'column',jusifyContent:'center',backgroundColor:'#FFF',alignItem:'center'}}>
                  <GhostButton onPress={this.send_report} value="確認回報"/>
                </View>
             </View>
           </ScrollView>
        </View>
      </TitleBarLayout>
    )
  }

});

export default connect((state) => ({
  userId: state.colorgyAPI.me && state.colorgyAPI.me.id,
  organizationCode: state.colorgyAPI.me && state.colorgyAPI.me.possibleOrganizationCode,
  navigateBackCount: state.board.navigateBackCount,
  networkConnectivity: state.deviceInfo.networkConnectivity,
  translucentStatusBar: state.deviceInfo.translucentStatusBar,
  statusBarHeight: state.deviceInfo.statusBarHeight
}))(Report);
