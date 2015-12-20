import React, {
  StyleSheet,
  Text,
  TouchableHighlight
} from 'react-native';

let GhostButton = React.createClass({
  propTypes: {
    color: React.PropTypes.string,
    onPress: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      color: '#F89680'
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
