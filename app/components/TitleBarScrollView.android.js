import React, {
  StyleSheet,
  View,
  ScrollView,
  Animated,
  Text
} from 'react-native';

import TitleBar from './TitleBar';

let TitleBarScrollView = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    color: React.PropTypes.string,
    enableOffsetTop: React.PropTypes.bool,
    offsetTop: React.PropTypes.number,
    background: React.PropTypes.element
  },

  getDefaultProps: function() {
    return {
      color: '#F89680',
      offsetTop: 0
    };
  },

  getInitialState() {
    return {
      scroll: (new Animated.Value(0))
    };
  },

  render() {
    var offsetTop = this.props.enableOffsetTop ? this.props.offsetTop : 0;
    return (
      <View style={styles.container}>
        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignSelf: 'stretch',
            transform: [{
              translateY: this.state.scroll.interpolate({
                inputRange: [0, 1000],
                outputRange: [0, -500]
              })
            }]
          }}
        >
          {this.props.background}
        </Animated.View>
        <View
          style={[styles.head, {
            paddingTop: offsetTop
          }]}
        >
          <Animated.View
            elevation={4}
            style={{
              position: 'absolute',
              flex: 1,
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              alignSelf: 'stretch',
              backgroundColor: this.props.color,
              opacity: this.state.scroll.interpolate({
                inputRange: [0, 30, 120],
                outputRange: [0, 0, 1]
              })
            }}
          />
          <TitleBar
            elevation={5}
            title={this.props.title}
            leftAction={this.props.leftAction}
            rightAction={this.props.rightAction}
          >
          </TitleBar>
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.body, this.props.contentContainerStyle]}
          onScroll={Animated.event([{
            nativeEvent: {
              contentOffset: { y: this.state.scroll }
            }
          }])}
        >
          {this.props.children}
        </ScrollView>
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
  scrollView: {
    flex: 1
  },
  body: {
  },
});

export default TitleBarScrollView;
