import React, {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
import { connect } from 'react-redux/native';

import colorgyAPI from '../utils/colorgyAPI';

var AppContainer = React.createClass({

  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome!
        </Text>
        <Text style={styles.instructions}>
          This is the main app page. Welcome in, {this.props.userName}!
        </Text>
        <Image
          source={{ uri: this.props.avatarUrl }}
          style={{ width: 200, height: 200, margin: 10 }} />
        <Text style={styles.instructions} onPress={colorgyAPI.clearAccessToken}>
          Go Out.
        </Text>
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
    fontSize: 32,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  }
});

export default connect((state) => ({
  userName: state.colorgyAPI.me.name,
  avatarUrl: state.colorgyAPI.me.avatarUrl
}))(AppContainer);
