import React, {
  PropTypes,
  View,
  TouchableNativeFeedback,
  TouchableHighlight,
  Image,
  Platform
} from 'react-native';

let TitleBarActionIcon = React.createClass({
  propTypes: {
    onPress: PropTypes.func
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
        {(() => {
          if (parseFloat(Platform.Version) >= 21) {
            return (
              <TouchableNativeFeedback
                onPress={this._handlePress}
                background={TouchableNativeFeedback.Ripple(null, true)}
              >
                <View style={{ padding: 16 }}>
                  {this.props.children}
                </View>
              </TouchableNativeFeedback>
            );
          } else {
            return (
              <TouchableHighlight
                onPress={this._handlePress}
                underlayColor="#33333344"
              >
                <View style={{ padding: 16 }}>
                  {this.props.children}
                </View>
              </TouchableHighlight>
            );
          }
        })()}
      </View>
    );
  }
});

export default TitleBarActionIcon;
