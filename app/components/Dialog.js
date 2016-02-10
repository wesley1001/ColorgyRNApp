import React, {
  Platform,
  StyleSheet,
  View,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Dimensions,
  TextInput
} from 'react-native';

import Color from 'color';
import THEME from '../constants/THEME';

import Text from './Text';

let Dialog = React.createClass({
  propTypes: {
    color: React.PropTypes.string,
    title: React.PropTypes.string,
    content: React.PropTypes.string,
    options: React.PropTypes.array,
  },

  getDefaultProps: function() {
    return {
      color: THEME.COLOR,
      title:'你確定要封鎖對方？',
      content:'拖拖拉拉不如輕輕鬆鬆吧！我是這麼覺得啦',
      options:[{text:'取消'},{text:'確定',color:'#F89680'}]
    };
  },

  getInitialState(){
    return{
      text:'',
      length:0,
    }
  },

  onChangeText(text){
    this.setState({text});
    this.setState({length:text.length});
  },

  render() {
    var value = this.props.value || this.props.text;
    var color = Color(this.props.color);
    var textColor = (color.luminosity() < 0.3) ? THEME.DARK_TEXT_COLOR : THEME.LIGHT_TEXT_COLOR;
    return (
      <View style={styles.view}>
        <View style={{marginBottom:20,padding:25,backgroundColor:'white',width:Dimensions.get('window').width/4*3}}>
          <Text style={{fontSize:18}}>{this.props.title}</Text>
          <Text style={{fontSize:14,lineHeight:25,marginTop:10,}}>{this.props.content}</Text>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => this.onChangeText(text)}
            value={this.state.text}
            maxLength={this.props.word_limit}
          />
          {this.props.word_limit?<Text style={{color:'#979797',textAlign:'right',width:Dimensions.get('window').width/5*3}}>{this.state.length}/{this.props.word_limit}</Text>:null}
          <View style={{height:40,flexDirection:'column',justifyContent:'center'}}>
            <View style={{flexDirection:'row',justifyContent:'flex-end',}}>
              {this.props.options[0]?<TouchableNativeFeedback onPress={()=>this.props.options[0].method(this.state.text)}><View style={{margin:10}}><Text style={{fontSize:16,textAlign:'right',color:this.props.options[0].color || 'gray'}}>{this.props.options[0].text}</Text></View></TouchableNativeFeedback>:null}
              <TouchableNativeFeedback onPress={()=>this.props.options[1].method(this.state.text)}><View style={{margin:10}}><Text style={{fontSize:16,textAlign:'right',color:this.props.options[1].color || 'gray'}}>{this.props.options[1].text}</Text></View></TouchableNativeFeedback>
            </View>
          </View>
        </View>
      </View>
    );
  }

});

let styles = StyleSheet.create({
  button: {
    flex: 1,
    borderWidth: 1.4,
    borderRadius: 1,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  smallButton: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 16,
    paddingRight: 16,
  },
  text: {
    fontSize: 16,
    textAlign: 'center'
  },
  view:{
    backgroundColor:'rgba(0,0,0,.5)',
    position:'absolute',
    top:0,
    left:0,
    height:Dimensions.get('window').height,
    width:Dimensions.get('window').width,
    justifyContent:'center',
    alignItems:'center'
  }
});

export default Dialog;
