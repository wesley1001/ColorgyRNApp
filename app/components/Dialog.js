import React, {
  Platform,
  StyleSheet,
  View,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Dimensions
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
      content:'拖拖拉拉不如輕輕鬆鬆吧！我是這麼覺得啦'
    };
  },


  render() {
    var value = this.props.value || this.props.text;
    var color = Color(this.props.color);
    var textColor = (color.luminosity() < 0.3) ? THEME.DARK_TEXT_COLOR : THEME.LIGHT_TEXT_COLOR;
    return (
      <View style={styles.view}>
        <View style={{marginBottom:20,padding:25,backgroundColor:'white', height:150,width:Dimensions.get('window').width/4*3}}>
          <Text style={{fontSize:18}}>{this.props.title}</Text>
          <Text style={{fontSize:14,lineHeight:25,marginTop:10,}}>{this.props.content}</Text>
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
