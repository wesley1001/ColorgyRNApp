import React, {
  Platform,
  StyleSheet,
  View,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Dimensions,
  TextInput,
  Image,
  PixelRatio
} from 'react-native';

import Color from 'color';
import THEME from '../constants/THEME';

import Text from './Text';

let Status = React.createClass({

  getDefaultProps: function() {
    return {
      type:'ok',
      hideTab:false,
    };
  },



  render() {
    var value = this.props.value || this.props.text;
    var color = Color(this.props.color);
    var textColor = (color.luminosity() < 0.3) ? THEME.DARK_TEXT_COLOR : THEME.LIGHT_TEXT_COLOR;
    if (!this.props.hideTab) {
      var styleBottom = {marginBottom:90};
    };
    if (this.props.img == "go_get_mail") {
      var img = require('../assets/images/go_get_mail.png');
    }else if (this.props.img == 'have_get_mail') {
      var img = require('../assets/images/have_get_mail.png');
    }else if (this.props.img == 'send_email_success') {
      var img = require('../assets/images/send_email_success.png');
    }else if (this.props.img == 'success') {
      var img = require('../assets/images/success.png');
    }else if (this.props.img == 'uploading') {
      var img = require('../assets/images/uploading.png');
    }else if (this.props.img == 'status_go_get_email') {
      var img = require('../assets/images/status_go_get_email.gif');
    }else if (this.props.img == "status_send_success") {
      var img = require('../assets/images/status_send_success.gif');
    }else if (this.props.img == 'status_success') {
      var img = require('../assets/images/status_success.gif')
    }else if (this.props.img == 'status_uploading_success') {
      var img = require('../assets/images/status_uploading_success.gif')
    }else if (this.props.img == 'status_uploading') {
      var img = require('../assets/images/status_uploading.gif')
    }else if (this.props.img == 'status_verifying') {
      var img = require('../assets/images/status_verifying.gif')
    }
    return (
      <View style={[styles.view,{backgroundColor: this.props.backgroundColor || 'rgba(0,0,0,.7)'}]}>
        <View style={[{alignItems:'center'},styleBottom]}>
          <Image
            style={{width:Dimensions.get('window').width/3,height:Dimensions.get('window').width/3}}
            source={img} />
          {this.props.button?
            <TouchableNativeFeedback onPress={this.props.button.method}>
              <View style={styles.mainBtn}>
                <Text style={styles.mainBtnText}>{this.props.button.text}</Text>
              </View>
            </TouchableNativeFeedback>:null}
          {this.props.secondaryButton?
            <TouchableNativeFeedback onPress={this.props.secondaryButton.method}>
              <View style={styles.mainBtn2}>
                <Text style={[styles.mainBtnText,{fontSize:11}]}>{this.props.secondaryButton.text}</Text>
              </View>
            </TouchableNativeFeedback>:null}

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
    position:'absolute',
    top:0,
    left:0,
    height:Dimensions.get('window').height,
    width:Dimensions.get('window').width,
    justifyContent:'center',
    alignItems:'center'
  },
  mainBtn:{
    margin:10,
    borderWidth:6/ PixelRatio.get(),
    borderColor:'#FFF',
    paddingTop:5,
    paddingBottom:5,
    paddingLeft:15,
    paddingRight:15
  },
  mainBtn2:{
    paddingTop:5,
    paddingBottom:5,
    paddingLeft:15,
    paddingRight:15
  },
  mainBtnText:{
    color:'#FFF'
  }
});

export default Status;
