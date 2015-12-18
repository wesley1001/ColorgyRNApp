import React, {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux/native';

import { counterPlus, asyncCounterPlus } from '../actions/counterActions';

var AppContainer = React.createClass({

  _handleCount: function() {
    this.props.dispatch(counterPlus());
  },

  _handleAsyncCount: function() {
    this.props.dispatch(asyncCounterPlus());
  },

  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          This is a simple counter. Press the button below to count.
        </Text>
        <Text style={styles.instructions}>
          {this.props.count}
        </Text>
        <TouchableOpacity onPress={this._handleCount}>
          <Text style={styles.action}>
            Count!
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._handleAsyncCount}>
          <Text style={styles.action}>
            Async Count!
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  action: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  }
});

export default connect((state) => ({
  count: state.counter.count
}))(AppContainer);
