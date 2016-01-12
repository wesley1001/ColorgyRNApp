import React, {
  Platform,
  StyleSheet,
  View,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  TouchableHighlight
} from 'react-native';
import Color from 'color';
import THEME from '../constants/THEME';

import Text from './Text';

let Button = React.createClass({
  propTypes: {
    color: React.PropTypes.string,
    onPress: React.PropTypes.func,
    disabled: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      color: THEME.COLOR
    };
  },

  _handlePress() {
    if (!this.props.disabled && this.props.onPress) this.props.onPress();
  },

  render() {
    var value = this.props.value || this.props.text;
    var color = Color(this.props.color);
    var textColor = (color.luminosity() < 0.3) ? THEME.DARK_TEXT_COLOR : THEME.LIGHT_TEXT_COLOR;

    if (this.props.disabled) {
      color = Color('#CECECE');
      textColor = '#AAAAAA';

      return (
        <TouchableWithoutFeedback>
          <View
            style={[styles.button, (this.props.type === 'small' && styles.smallButton), this.props.style, {
              borderColor: color.clone().darken(0.05).desaturate(0.1).rgbaString(),
              backgroundColor: color.rgbaString()
            }]}
          >
            <Text style={[styles.text, this.props.textStyle, { color: textColor }]}>
              {value}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      );
    } else {
      return (
        <TouchableNativeFeedback onPress={this._handlePress}>
          <View
            style={[styles.button, (this.props.type === 'small' && styles.smallButton), this.props.style, {
              borderColor: color.clone().darken(0.05).desaturate(0.1).rgbaString(),
              backgroundColor: color.rgbaString()
            }]}
          >
            <Text style={[styles.text, this.props.textStyle, { color: textColor }]}>
              {value}
            </Text>
          </View>
        </TouchableNativeFeedback>
      );
    }
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
  }
});

export default Button;
