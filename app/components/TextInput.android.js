import React, { StyleSheet, TextInput } from 'react-native';
import THEME from '../constants/THEME';

let AppTextInput = React.createClass({
  render() {
    return (
      <TextInput
        {...this.props}
        style={[styles.text, this.props.style]}
      />
    );
  }
});

let styles = StyleSheet.create({
  text: {
    fontFamily: THEME.ANDROID_FONT_FAMILY
  }
});

export default AppTextInput;
