import React, {
  StyleSheet,
  View,
  TouchableHighlight,
  TouchableOpacity
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

  getInitialState() {
    return {};
  },

  _handlePress() {
    if (this.props.onPress) this.props.onPress();
  },

  render() {
    var value = this.props.value || this.props.text;

    return (
      <TouchableHighlight
        style={[styles.button, (this.props.type === 'small' && styles.smallButton), { borderColor: this.props.color }, this.props.style]}
        underlayColor={this.props.color}
        onPress={this._handlePress}
        onPressIn={() => this.setState({ press: true })}
        onPressOut={() => this.setState({ press: false })}
      >
        <View>
          <Text style={[styles.text, this.props.textStyle, { color: (this.state.press ? this.props.backgroundColor || 'white' : this.props.color) }]}>
            {value}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
});

let styles = StyleSheet.create({
  button: {
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
    paddingLeft: 8,
    paddingRight: 8,
  },
  text: {
    fontSize: 16
  }
});

export default GhostButton;
