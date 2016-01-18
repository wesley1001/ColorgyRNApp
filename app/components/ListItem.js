import React, {
  StyleSheet,
  PropTypes,
  View,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  TouchableHighlight
} from 'react-native';

import THEME from '../constants/THEME';

import Text from './Text';


let ListItem = React.createClass({
  propTypes: {
    text: PropTypes.string,
    onPress: PropTypes.func,
    onDisabledPress: PropTypes.func,
    disabled: PropTypes.bool,
    last: PropTypes.bool
  },

  getDefaultProps: function() {
    return {};
  },

  _handlePress() {
    if (!this.props.disabled) {
      if (this.props.onPress) this.props.onPress();
    } else {
      if (this.props.onDisabledPress) this.props.onDisabledPress();
    }
  },

  render() {
    if (this.props.disabled) {
      return (
        <TouchableWithoutFeedback onPress={this._handlePress}>
          <View style={[
            styles.container,
            this.props.last && { borderBottomWidth: 1 }
          ]}>
            <Text style={[styles.text, { opacity: 0.4 }]}>{this.props.text}</Text>
          </View>
        </TouchableWithoutFeedback>
      );
    } else {
      return (
        <TouchableNativeFeedback onPress={this._handlePress}>
          <View style={[
            styles.container,
            this.props.last && { borderBottomWidth: 1 }
          ]}>
            <Text style={styles.text}>{this.props.text}</Text>
          </View>
        </TouchableNativeFeedback>
      );
    }
  }
});

let styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    height: 50,
    borderColor: THEME.LIGHT_BORDER_COLOR,
    borderTopWidth: 1,
    backgroundColor: '#FFFFFF',
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  text: {
    fontSize: 16,
    textAlign: 'left'
  }
});

export default ListItem;
