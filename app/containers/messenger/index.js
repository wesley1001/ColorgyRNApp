import { connect } from 'react-redux/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Text from '../../components/Text';
import TitleBarLayout from '../../components/TitleBarLayout';
import TitleBarActionIcon from '../../components/TitleBarActionIcon';

import ga from '../../utils/ga';
import React, {
  StyleSheet,
  View,
  WebView,
  ProgressBarAndroid,
  ScrollView,
  Dimensions,
  PixelRatio
} from 'react-native';

var GiftedMessenger = require('react-native-gifted-messenger');

var GiftedMessengerExample = React.createClass({
  getMessages() {
    return [
      {text: '不可思議我也是！你什麼系',type:'chat', name: 'React-Native', image: {uri: 'http://www.saveimg.com/images/2014/03/30/161222jnnr5rkf8k67z76rUYKmD.jpg'}, position: 'left', date: new Date(2015, 0, 16, 19, 0)},
      {text: '您地質系？',type:'chat', name: 'Developer', image: null, position: 'right', date: new Date(2015, 0, 17, 19, 0)},
    ];
  },
  handleSend(message = {}, rowID = null) {
    // Send message.text to your server
  },
  handleReceive() {
    this._GiftedMessenger.appendMessage({
      text: 'Received message', 
      name: 'Friend', 
      image: {uri: 'https://facebook.github.io/react/img/logo_og.png'}, 
      position: 'left', 
      date: new Date(),
    });
  },
  render() {
    return (
      <TitleBarLayout
        enableOffsetTop={this.props.translucentStatusBar}
        offsetTop={this.props.statusBarHeight}
        style={[this.props.style,{paddingTop:25,backgroundColor:'white'}]}
        title="隔壁小妹"
        textColor={"#000"}
        color={"#FFF"}
        leftAction={
          <TitleBarActionIcon onPress={this._handleBack}>
            <Icon name="arrow-back" size={24} color="#000" />
          </TitleBarActionIcon>
        }
      >
        <GiftedMessenger
          ref={(c) => this._GiftedMessenger = c}

          messages={this.getMessages()}
          handleSend={this.handleSend}
          maxHeight={Dimensions.get('window').height - 85} // 64 for the navBar

          styles={{
            bubbleLeft: {
              backgroundColor: null,
              marginRight: 70,
              borderWidth:3/ PixelRatio.get(),
              borderColor:'black',
              borderRadius:5,
            },
            bubbleRight: {
              backgroundColor: '#F89680',
              marginLeft: 70,
              borderRadius:5,
            },
          }}
        />
      </TitleBarLayout>
    );
  },
});

module.exports = GiftedMessengerExample;