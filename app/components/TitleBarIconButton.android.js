import React, {
  View,
  TouchableNativeFeedback,
  TouchableHighlight,
  Image,
  Platform
} from 'react-native';

let TitleBarIconButton = React.createClass({
  propTypes: {
    icon: React.PropTypes.object,
    onPress: React.PropTypes.func
  },

  getDefaultProps() {
    return {
    };
  },

  _handlePress() {
    if (this.props.onPress) this.props.onPress();
  },

  render() {
    return (
      <View style={{ margin: -16 }}>
        {() => {
          // TODO: Ensure this is ok
          if (parseFloat(Platform.Version) >= 21) {
            return (
              <TouchableNativeFeedback
                onPress={this._handlePress}
                background={TouchableNativeFeedback.Ripple(null, true)}
              >
                <View style={{ padding: 16 }}>
                  <Image
                    source={this.props.icon}
                    style={{ width: 24, height: 24 }}
                  />
                </View>
              </TouchableNativeFeedback>
            );
          } else {
            // TODO: Modify this
            return (
              <TouchableHighlight
                onPress={this._handlePress}
              >
                <View style={{ padding: 16 }}>
                  <Image
                    source={this.props.icon}
                    style={{ width: 24, height: 24 }}
                  />
                </View>
              </TouchableHighlight>
            );
          }
        }()}
      </View>
    );
  }
});

export default TitleBarIconButton;
