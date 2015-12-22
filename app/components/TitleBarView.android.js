import React, {
  StyleSheet,
  View
} from 'react-native';

import TitleBar from './TitleBar';

let TitleBarView = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    color: React.PropTypes.string,
    enableOffsetTop: React.PropTypes.boolean,
    offsetTop: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      color: '#F89680',
      offsetTop: 0
    };
  },

  render() {
    var offsetTop = this.props.enableOffsetTop ? this.props.offsetTop - 8 : 0;
    return (
      <View style={styles.container}>
        <View
          style={[styles.head, {
            backgroundColor: this.props.color,
            paddingTop: offsetTop
          }]}
        >
          <TitleBar
            title={this.props.title}
            leftAction={this.props.leftAction}
            rightAction={this.props.rightAction}
          >
          </TitleBar>
        </View>
        <View style={[styles.body, this.props.contentContainerStyle]}>
          {this.props.children}
        </View>
      </View>
    );
  },
});

let styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  head: {
  },
  body: {
    flex: 1,
    alignItems: 'stretch'
  }
});

export default TitleBarView;
