import React, {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text
} from 'react-native';

import colorgyAPI from '../utils/colorgyAPI';

let UserAvatar = React.createClass({
  propTypes: {
    userId: React.PropTypes.number,
    onPress: React.PropTypes.func
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  componentWillMount() {
    this._fetchUserData();
    this.setState({ avatarUri: '2' });
  },

  _fetchUserData() {
    this.setState({ avatarUri: '2' });
    colorgyAPI.fetch(`/v1/users/${this.props.userId}.json`).then((response) => {
      if (parseInt(response.status / 100) !== 2) {
        throw response.status;
      }

      return response.json();
    }).then((json) => {
      var avatarUri = json.avatar_url;
      this.setState({ avatarUri });
    }).catch((e) => {});
  },

  render() {
    var userId = this.props.userId;
    var style = this.props.style || {};
    var avatarUri = this.state.avatarUri;
    var Container = View;
    if (this.props.onPress) Container = TouchableOpacity;

    return (
      <Container
        style={style}
        onPress={() => { this.props.onPress({ userId }) }}
      >
        <Image
          source={{ uri: avatarUri }}
          style={{ width: style.width, height: style.height, borderRadius: style.borderRadius }}
        />
      </Container>
    );
  }
});

export default UserAvatar;
