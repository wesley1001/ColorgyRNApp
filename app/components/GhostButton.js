import React, {
  PropTypes,
  StyleSheet,
  Animated,
  View,
  TouchableWithoutFeedback,
  ProgressBarAndroid
} from 'react-native';

import THEME from '../constants/THEME';
import Text from './Text';

let GhostButton = React.createClass({
  propTypes: {
    value: PropTypes.string,
    color: PropTypes.string,
    onPress: PropTypes.func,
    type: PropTypes.string,
    confirmValue: PropTypes.string,
    confirmColor: PropTypes.string,
    initialWidth: PropTypes.number,
    confirmWidth: PropTypes.number,
    renderAfterPress: PropTypes.element,
    setLoadingAfterPress: PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      color: THEME.COLOR
    };
  },

  getInitialState() {
    return {
      press: false,
      confirm: false,
      backgroundOpacity: new Animated.Value(0),
      width: new Animated.Value(0)
    };
  },

  _handlePress() {
    if (this.props.confirmValue) {
      if (this.state.confirm) {
        if (this.props.onPress) this.props.onPress();
        if (this.props.renderAfterPress) this.setState({ renderElement: this.props.renderAfterPress });
        if (this.props.setLoadingAfterPress) this.setState({ loading: true });
      } else {
        Animated.spring(this.state.width, { toValue: 1 }).start();
        this.setState({ confirm: true }, () => {
          setTimeout(this._cancelConfirm, 3200);
        });
      }
    } else {
      if (this.props.onPress) this.props.onPress();
      if (this.props.renderAfterPress) this.setState({ renderElement: this.props.renderAfterPress });
      if (this.props.setLoadingAfterPress) this.setState({ loading: true });
    }
  },

  _cancelConfirm() {
    Animated.spring(this.state.width, { toValue: 0 }).start();
    this.setState({ confirm: false });
  },

  _handlePressIn() {
    Animated.spring(this.state.backgroundOpacity, { toValue: 1 }).start();

  },

  _handlePressOut() {
    Animated.spring(this.state.backgroundOpacity, { toValue: 0 }).start();
  },

  render() {
    if (this.state.renderElement) return this.state.renderElement;

    var value = this.props.value || this.props.text;
    var color = this.props.color;

    if (this.state.confirm && this.props.confirmColor) {
      color = this.props.confirmColor;
    }

    return (
      <TouchableWithoutFeedback
        onPress={this._handlePress}
        onPressIn={this._handlePressIn}
        onPressOut={this._handlePressOut}
      >
        <View>
          <Animated.View
            style={[
              styles.button,
              (this.props.type === 'small' && styles.smallButton),
              (this.props.type === 'tiny' && styles.tinyButton),
              { borderColor: color },
              this.props.style,
              this.props.initialWidth && {
                width: this.state.width.interpolate({
                  inputRange: [0, 1],
                  outputRange: [this.props.initialWidth, this.props.confirmWidth],
                })
              }
            ]}
          >
            {(() => {
              if (this.state.loading) {
                return (<View style={{ height: ((this.props.type === 'tiny') ? 18 : 20), justifyContent: 'center', alignItems: 'center' }}><ProgressBarAndroid styleAttr="Small" color={color} /></View>);
              } else {
                return (
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.text,
                      this.props.textStyle,
                      { color: color },
                      (this.props.type === 'tiny' && styles.tinyText)
                    ]}
                  >
                    {this.state.confirm ? this.props.confirmValue : value}
                  </Text>
                );
              }
            })()}
          </Animated.View>
          <Animated.View
            style={[
              styles.button,
              (this.props.type === 'small' && styles.smallButton),
              (this.props.type === 'tiny' && styles.tinyButton),
              {
                borderColor: color,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: color
              },
              this.props.style,
              { opacity: this.state.backgroundOpacity },
              this.props.initialWidth && {
                width: this.state.width.interpolate({
                  inputRange: [0, 1],
                  outputRange: [this.props.initialWidth, this.props.confirmWidth],
                })
              }
            ]}
          >
            {(() => {
              if (this.state.loading) {
                return (<View style={{ height: ((this.props.type === 'tiny') ? 18 : 20), justifyContent: 'center', alignItems: 'center' }}><ProgressBarAndroid styleAttr="Small" color={this.props.backgroundColor || 'white'} /></View>);
              } else {
                return (
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.text,
                      this.props.textStyle,
                      { color: this.props.backgroundColor || 'white' },
                      (this.props.type === 'tiny' && styles.tinyText)
                    ]}
                  >
                  {this.state.confirm ? this.props.confirmValue : value}
                  </Text>
                );
              }
            })()}
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
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
  tinyButton: {
    borderWidth: 1,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 8,
    paddingRight: 8
  },
  text: {
    fontSize: 16
  },
  tinyText: {
    fontSize: 14
  },
});

export default GhostButton;
