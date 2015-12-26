import React, {
  StyleSheet,
  View,
  Text,
  TouchableNativeFeedback,
  TouchableWithoutFeedback
} from 'react-native';
import Color from 'color';
import THEME from '../constants/THEME';

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
    var color = Color(this.props.color);

    var Container = TouchableNativeFeedback;
    var textColor = 'white';

    if (this.props.disabled) {
      Container = TouchableWithoutFeedback;
      color = Color('#CECECE');
      textColor = '#8E8E8E';
    }

    var text = null;
    if (this.props.text) text = (
      <Text style={[styles.text, this.props.textStyle, { color: textColor }]}>
        {this.props.text}
      </Text>
    );

    return (
      <Container
        onPress={this._handlePress}
      >
        <View
          style={[styles.button, this.props.style, { borderColor: color.clone().darken(0.05).desaturate(0.1).rgbaString(), backgroundColor: color.rgbaString() }]}
        >
          {text || this.props.children}
        </View>
      </Container>
    );
  }
});

let styles = StyleSheet.create({
  button: {
    borderWidth: 1.4,
    borderRadius: 1,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 16
  }
});

export default Button;
