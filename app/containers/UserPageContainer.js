import React, {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableNativeFeedback
} from 'react-native';
import { connect } from 'react-redux/native';
import _ from 'underscore';

import Text from '../components/Text';
import TitleBarScrollView from '../components/TitleBarScrollView';
import TitleBarActionIcon from '../components/TitleBarActionIcon';

var UserPageContainer = React.createClass({

  getInitialState() {
    return {};
  },

  componentWillMount() {
    if (!this._getUser()) this._fetchUserData();
  },

  _getUserId() {
    return (this.props.user && this.props.user.id || this.props.userId || this.state.user && this.state.user.id);
  },

  _getUser() {
    return (this.props.user || this.state.user);
  },

  _fetchUserData() {

    colorgyAPI.fetch(`/v1/users/${this._getUserId()}.json`).then((response) => {
      if (parseInt(response.status / 100) !== 2) {
        throw response.status;
      }

      return response.json();
    }).then((json) => {
      var user = json;
      this.setState({
        user
      });

    }).catch((e) => {
    });
  },

  _handleBack() {
    this.props.navigator.pop();
  },

  render() {
    var user = this._getUser();

    if (user) {
      return (
        <TitleBarScrollView
          enableOffsetTop={this.props.translucentStatusBar}
          offsetTop={this.props.statusBarHeight}
          style={this.props.style}
          title={user.name}
          leftAction={
            <TitleBarActionIcon
              onPress={this._handleBack}
              icon={require('../assets/images/icon_arrow_back_white.png')}
            />
          }
          background={<View>
            <Image source={require('../assets/images/bg_1.jpg')} style={{ width: this.props.deviceWidth }} />
          </View>}
        >
          <View style={styles.container}>
            <Text style={{ fontSize: 24 }}>{JSON.stringify(user, null, 2)}</Text>
          </View>
        </TitleBarScrollView>
      );
    } else {
      return (
        <Text>Loading</Text>
      );
    }
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
    marginTop: 120
  },
  infoBlock: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderBottomWidth: 2,
    borderBottomColor: '#FAF7F5',
    backgroundColor: 'white'
  },
  infoBox: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoBoxIcon: {
    width: 20,
    height: 20,
    marginRight: 8
  },
  menu: {
    backgroundColor: 'white',
    marginTop: 10
  }
});

export default connect((state) => ({
  translucentStatusBar: state.deviceInfo.translucentStatusBar,
  statusBarHeight: state.deviceInfo.statusBarHeight
}))(UserPageContainer);
