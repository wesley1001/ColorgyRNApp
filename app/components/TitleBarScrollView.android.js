import React, {
  StyleSheet,
  View,
  ScrollView,
  Animated,
  Text
} from 'react-native';

import THEME from '../constants/THEME';

import TitleBar from './TitleBar';

let TitleBarScrollView = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    color: React.PropTypes.string,
    enableOffsetTop: React.PropTypes.bool,
    offsetTop: React.PropTypes.number,
    background: React.PropTypes.element,
    hideTitleInitially: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      color: '#F89680',
      offsetTop: 0
    };
  },

  getInitialState() {
    return {
      scroll: (new Animated.Value(0)),
      hideTitle: this.props.hideTitleInitially
    };
  },

  componentWillMount() {
    this.state.scroll.addListener(this._handleScroll);
  },

  _handleScroll(payload) {
    var scrollY = payload.value;

    if (this.props.hideTitleInitially) {
      if (scrollY > 100) {
        if (this.state.hideTitle) this.setState({ hideTitle: false });
      } else {
        if (!this.state.hideTitle) this.setState({ hideTitle: true });
      }
    }
  },

  render() {
    var offsetTop = this.props.enableOffsetTop ? this.props.offsetTop : 0;

    return (
      <View style={[styles.container, this.props.style]}>
        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: -10,
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

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.body, this.props.contentContainerStyle]}
          onScroll={Animated.event([{
            nativeEvent: {
              contentOffset: { y: this.state.scroll }
            }
          }], this._handleScroll)}
        >
          {this.props.children}
        </ScrollView>

        <View
          style={[styles.head, {
            paddingTop: offsetTop,
          }]}
        >
          <Animated.View
            style={{
              paddingTop: offsetTop,
              position: 'absolute',
              flex: 1,
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              alignSelf: 'stretch',
              backgroundColor: this.props.color,
              elevation: 4,
              opacity: this.state.scroll.interpolate({
                inputRange: [0, 30, 120],
                outputRange: [0, 0, 1]
              })
            }}
            elevation={4}
          >
            <TitleBar
              title={this.props.title}
              leftAction={this.props.leftAction}
              rightAction={this.props.rightAction}
              translateTitle={this.state.hideTitle}
            >
            </TitleBar>
          </Animated.View>
          <TitleBar
            title={this.props.title}
            leftAction={this.props.leftAction}
            rightAction={this.props.rightAction}
            translateTitle={this.state.hideTitle}
          >
          </TitleBar>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  },
  scrollView: {
    flex: 1
  },
  body: {
  },
});

export default TitleBarScrollView;
