import React, {
  StyleSheet,
  PropTypes,
  View,
  Image,
  Switch,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  TouchableHighlight
} from 'react-native';

import THEME from '../constants/THEME';

import Text from './Text';


let ListItem = React.createClass({
  propTypes: {
    text: PropTypes.string,
    onPress: PropTypes.func,
    onDisabledPress: PropTypes.func,
    disabled: PropTypes.bool,
    borderTop: PropTypes.bool,
    borderBottom: PropTypes.bool,
    switch: PropTypes.bool,
    switched: PropTypes.bool,
    initialSwitched: PropTypes.bool,
    checkbox: PropTypes.bool,
    checked: PropTypes.bool,
    initialChecked: PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      borderTop: true,
      borderBottom: false
    };
  },

  getInitialState() {
    return {
      checked: this.props.initialChecked,
      switched: this.props.initialSwitched
    };
  },

  _getCheckedState() {
    if (this.props.checked === undefined) {
      return this.state.checked;
    } else {
      return this.props.checked;
    }
  },

  _getSwitchedState() {
    if (this.props.switched === undefined) {
      return this.state.switched;
    } else {
      return this.props.switched;
    }
  },

  _handlePress() {
    if (!this.props.disabled) {
      if (this.props.onPress) this.props.onPress();

      if (this.props.checkbox) {
        if (this.state.checked) this.setState({ checked: false });
        else this.setState({ checked: true });
      }

      if (this.props.switch) {
        if (this.state.switched) this.setState({ switched: false });
        else this.setState({ switched: true });
      }
    } else {
      if (this.props.onDisabledPress) this.props.onDisabledPress();
    }
  },

  render() {
    const checked = this._getCheckedState();
    const switched = this._getSwitchedState();

    if (this.props.disabled) {
      return (
        <TouchableWithoutFeedback onPress={this._handlePress}>
          <View style={[
            styles.container,
            this.props.borderBottom && { borderBottomWidth: 1 },
            this.props.borderTop && { borderTopWidth: 1 },
            this.props.children && { height: undefined }
          ]}>
            {(() => {
              if (this.props.text) return (
                <Text style={styles.text}>{this.props.text}</Text>
              );
            })()}
            {this.props.children}
            {(() => {
              if (this.props.checkbox) {
                <View style={styles.checkboxContainer}>
                </View>
              }
            })()}
          </View>
        </TouchableWithoutFeedback>
      );
    } else {
      return (
        <TouchableNativeFeedback onPress={this._handlePress}>
          <View style={[
            styles.container,
            this.props.borderBottom && { borderBottomWidth: 1 },
            this.props.borderTop && { borderTopWidth: 1 },
            this.props.children && { height: undefined }
          ]}>
            {(() => {
              if (this.props.text) return (
                <Text style={styles.text}>{this.props.text}</Text>
              );
            })()}
            {this.props.children}
            {(() => {
              if (this.props.checkbox) {
                return (
                  <View style={styles.checkboxContainer}>
                    <View
                      style={[
                        styles.checkbox,
                        checked ? styles.checkboxChecked : styles.checkboxUnchecked
                      ]}
                    >
                      <Image
                        source={require('../assets/images/icon_check_white.png')}
                        style={{ width: 14, height: 14 }}
                      />
                    </View>
                  </View>
                );
              }
            })()}
            {(() => {
              if (this.props.switch) {
                return (
                  <View style={styles.checkboxContainer}>
                    <Switch
                      style={{ width: 50 }}
                      value={switched}
                      onValueChange={this._handlePress}
                    />
                  </View>
                );
              }
            })()}
          </View>
        </TouchableNativeFeedback>
      );
    }
  }
});

let styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    height: 50,
    borderColor: THEME.LIGHT_BORDER_COLOR,
    backgroundColor: '#FFFFFF',
    // paddingVertical: 4,
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  text: {
    flex: 1,
    fontSize: 16,
    textAlign: 'left'
  },
  checkboxContainer: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  checkbox: {
    borderRadius: 3,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkboxUnchecked: {
    borderWidth: 2,
    borderColor: '#838383'
  },
  checkboxChecked: {
    backgroundColor: '#00CFE4'
  }
});

export default ListItem;
