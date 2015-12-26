import React, { StyleSheet, Text } from 'react-native';
import THEME from '../constants/THEME';

let AppText = React.createClass({
  render() {
    return (
      <Text {...this.props} style={[styles.text, this.props.style]}>
        {this.props.children}
      </Text>
    );
  }
});

let styles = StyleSheet.create({
  text: {
    fontFamily: THEME.ANDROID_FONT_FAMILY
  }
});

export default AppText;
