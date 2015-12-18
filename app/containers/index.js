import React, {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import { connect } from 'react-redux/native';
import { FBLoginManager } from 'NativeModules';

import courseDatabase, { sqlValue } from '../databases/courseDatabase';
import { counterPlus, asyncCounterPlus } from '../actions/counterActions';

var AppContainer = React.createClass({

  getInitialState: function() {
    return {};
  },

  _handleCount: function() {
    this.props.dispatch(counterPlus());
  },

  _handleAsyncCount: function() {
    this.props.dispatch(asyncCounterPlus());
  },

  _handleDatabaseInsert: function() {
    var data = {
      code: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 20),
      general_code: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 20),
      name: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 20)
    };

    courseDatabase.executeSql(`INSERT INTO courses (code, general_code, name) VALUES (${sqlValue(data.code)}, ${sqlValue(data.general_code)}, ${sqlValue(data.name)});`).then((r) => {

      this.setState({ dbResults: JSON.stringify(data) });
    }).catch((e) => {
      this.setState({ dbResults: JSON.stringify(e) });
    });
  },

  _handleDatabaseSelectAll: function() {
    courseDatabase.executeSql('SELECT * FROM courses;').then((r) => {
      var data = {};

      if (r.results.rows.length) {
        for (let i=0; i<r.results.rows.length; i++) {
          let row = r.results.rows.item(i);
          data[row.code] = row;
        }
      }

      this.setState({ dbResults: JSON.stringify(data) });
    }).catch((e) => {
      this.setState({ dbResults: JSON.stringify(e) });
    });
  },

  _handleDatabaseDeleteAll: function() {
    courseDatabase.executeSql('DELETE FROM courses;').then((r) => {
      this.setState({ dbResults: 'All Deleted!' });
    }).catch((e) => {
      this.setState({ dbResults: JSON.stringify(e) });
    });
  },

  _handleDatabaseReset: function() {
    courseDatabase.reset().then(() => {
      courseDatabase.migrate();
      this.setState({ dbResults: 'DB has been reset!' });
    }).catch((e) => {
      this.setState({ dbResults: JSON.stringify(e) });
    });
  },

  _handleFBLogin: function() {
    FBLoginManager.loginWithPermissions(["email","user_friends"], (error, data) => {
      if (!error) {
        this.setState({ fbResults: JSON.stringify(data) });
      } else {
        this.setState({ fbResults: JSON.stringify(data) });
      }
    });
  },

  render: function() {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
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
          <Text style={styles.instructions}>
            - - -
          </Text>
          <Text style={styles.instructions}>
            And below is a database demo.
          </Text>
          <Text>
            {this.state.dbResults}
          </Text>
          <TouchableOpacity onPress={this._handleDatabaseInsert}>
            <Text style={styles.action}>
              Insert!
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._handleDatabaseSelectAll}>
            <Text style={styles.action}>
              Select All!
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._handleDatabaseDeleteAll}>
            <Text style={styles.action}>
              Delete All!
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._handleDatabaseReset}>
            <Text style={styles.action}>
              Reset DB!
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            - - -
          </Text>
          <Text style={styles.instructions}>
            And below is a FB login demo.
          </Text>
          <Text>
            {this.state.fbResults}
          </Text>
          <TouchableOpacity onPress={this._handleFBLogin}>
            <Text style={styles.action}>
              Login with Facebook!
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  scrollView: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
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
  },
  action: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  }
});

export default connect((state) => ({
  count: state.counter.count
}))(AppContainer);
