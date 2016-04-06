import React, {
  StyleSheet,
  PropTypes,
  View,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  TouchableHighlight
} from 'react-native';

import THEME from '../constants/THEME';

import Text from './Text';


let ListItem = React.createClass({
  propTypes: {
    text: PropTypes.string
  },

  getDefaultProps: function() {
    return {};
  },

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {this.props.text}
        </Text>
      </View>
    );
  }
});

let styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    height: 50,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  text: {
    color: '#5D5D5D',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'left'
  }
});

export default ListItem;
