import React, {
  PropTypes,
  StyleSheet,
  Animated,
  View,
  Text
} from 'react-native';

import THEME from '../constants/THEME';

let TitleBarView = React.createClass({
  propTypes: {
    // The title text on this title bar
    title: PropTypes.string,
    // An action button on the left, normally TitleBarActionIcon or a 24x24 view
    leftAction: PropTypes.element,
    // An action button on the right, normally TitleBarActionIcon or a 24x24 view
    rightAction: PropTypes.element,
    translateTitle: PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      title: ''
    };
  },

  getInitialState() {
    return {
      titleTranslate: new Animated.Value(this.props.translateTitle ? 1 : 0)
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.translateTitle != this.props.translateTitle) {
      Animated.timing(
        this.state.titleTranslate,
        { toValue: (nextProps.translateTitle ? 1 : 0) },
      ).start();
    }
  },

  render() {
    var actionPlaceholder = <View style={{ width: 24 }} />

    return (
      <View style={styles.container}>
        <View style={styles.actions}>
          {this.props.leftAction || actionPlaceholder}
        </View>
        <Animated.View
          style={[styles.title, {
            opacity: this.state.titleTranslate.interpolate({
              inputRange: [0, 0.7, 1],
              outputRange: [1, 0, 0]
            }),
            transform: [{
              translateY: this.state.titleTranslate.interpolate({
                inputRange: [0, 1],
                outputRange: [0, THEME.ANDROID_TITLE_BAR_HEIGHT / 2]
              })
            }]
          }]}
        >
          <Text style={styles.titleText}>
            {this.props.title}
          </Text>
        </Animated.View>
        <View style={styles.actions}>
          {this.props.rightAction || actionPlaceholder}
        </View>
      </View>
    );
  }
});

let styles = StyleSheet.create({
  container: {
    height: THEME.ANDROID_TITLE_BAR_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  actions: {
    padding: 16
  },
  title: {
    flex: 1,
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 20,
    paddingBottom: 20
  },
  titleText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '500'
  }
});

export default TitleBarView;
