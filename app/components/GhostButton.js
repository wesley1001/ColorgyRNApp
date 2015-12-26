import React, {
  StyleSheet,
  TouchableHighlight
} from 'react-native';

import THEME from '../constants/THEME';

import Text from './Text';

let GhostButton = React.createClass({
  propTypes: {
    color: React.PropTypes.string,
    onPress: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      color: THEME.COLOR
    };
  },

  _handlePress() {
    if (this.props.onPress) this.props.onPress();
  },

  render() {
    var text = null;
    if (this.props.text) text = (
      <Text style={[styles.text, this.props.textStyle, { color: this.props.color }]}>
        {this.props.text}
      </Text>
    );
    return (
      <TouchableHighlight
        style={[styles.button, this.props.style, { borderColor: this.props.color }]}
        underlayColor={this.props.color}
        onPress={this._handlePress}
      >
        {text || this.props.children}
      </TouchableHighlight>
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

export default GhostButton;
