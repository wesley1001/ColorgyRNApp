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

import { exitDevMode } from '../actions/devModeActions';
import courseDatabase, { sqlValue } from '../databases/courseDatabase';
import colorgyAPI from '../utils/colorgyAPI';
import { doUpdateMe } from '../actions/colorgyAPIActions';
import { counterPlus, asyncCounterPlus } from '../actions/counterActions';
import Notification from 'react-native-system-notification';

var DevModeContainer = React.createClass({

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
    FBLoginManager.loginWithPermissions(["email", "user_friends"], (error, data) => {
      if (!error) {
        this.setState({ fbResults: JSON.stringify(data) });
      } else {
        this.setState({ fbResults: JSON.stringify(data) });
      }
    });
  },

  _handleRequestAccessToken: function() {
    colorgyAPI.requestAccessToken({ username: 'pkg', password: 'qazwsxedc' });
  },

  _handleRequestAccessTokenWithFailure: function() {
    colorgyAPI.requestAccessToken({ username: 'pkc@pokaichang.com', password: 'qazwsxedc' });
  },

  _handleGetAccessToken: function() {
    colorgyAPI.getAccessToken().then((accessToken) => {
      this.setState({ apiResults: accessToken });
    });
  },

  _handleForceRefreshAccessToken: function() {
    colorgyAPI.getAccessToken(true).then((accessToken) => {
      this.setState({ apiResults: accessToken });
    });
  },

  _handleClearAccessToken: function() {
    colorgyAPI.clearAccessToken();
  },

  _handleGetAPIMe: function() {
    colorgyAPI.fetch('/v1/me').then((req) => req.json()).then((json) => {
      this.setState({ apiResults: JSON.stringify(json) });
    }).catch((e) => {
      this.setState({ apiResults: JSON.stringify(e) });
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
          <Text style={styles.instructions}>
            - - -
          </Text>
          <Text style={styles.instructions}>
            And below is Colorgy API demo.
          </Text>
          <Text>
            {JSON.stringify(this.props.colorgyAPI)}
          </Text>
          <Text>
            {this.state.apiResults}
          </Text>
          <TouchableOpacity onPress={this._handleRequestAccessToken}>
            <Text style={styles.action}>
              Request Access Token!
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._handleRequestAccessTokenWithFailure}>
            <Text style={styles.action}>
              Request Access Token With Failure!
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._handleGetAccessToken}>
            <Text style={styles.action}>
              Get Access Token!
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._handleForceRefreshAccessToken}>
            <Text style={styles.action}>
              Force Refresh Access Token!
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._handleClearAccessToken}>
            <Text style={styles.action}>
              Clear Access Token!
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._handleGetAPIMe}>
            <Text style={styles.action}>
              Get API /me!
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.props.dispatch(doUpdateMe({ unconfirmedOrganizationCode: null, unconfirmedDepartmentCode: null, unconfirmedStartedYear: null })) }}>
            <Text style={styles.action}>
              Clear My Org!
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            - - -
          </Text>
          <Text>
            {JSON.stringify(this.state.nResults, null, 2)}
          </Text>
          <TouchableOpacity onPress={() => {
            Notification.getIDs().then((ids) => {
              this.setState({ nResults: ids });
              ids.forEach((id, i) => {
                Notification.find(id).then((notification) => {
                  var { nResults } = this.state;
                  nResults[i] = notification;
                  this.setState({ nResults });
                });
              });
            });
          }}>
            <Text style={styles.action}>
              Get N Status!
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            - - -
          </Text>
          <TouchableOpacity onPress={() => this.props.dispatch(exitDevMode())}>
            <Text style={styles.action}>
              Exit!
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
  count: state.counter.count,
  colorgyAPI: state.colorgyAPI
}))(DevModeContainer);
