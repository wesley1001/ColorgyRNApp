import React, {
  TouchableNativeFeedback,
  TouchableHighlight,
  Platform
} from 'react-native';

let AppTouchableNativeFeedback = React.createClass({
  render() {
    if (true || parseFloat(Platform.Version) >= 21) {
      return (
        <TouchableNativeFeedback {...this.props}>
          {this.props.children}
        </TouchableNativeFeedback>
      );
    } else {
      return (
        <TouchableHighlight underlayColor="#33333344" {...this.props}>
          {this.props.children}
        </TouchableHighlight>
      );
    }
  }
});

export default AppTouchableNativeFeedback;
