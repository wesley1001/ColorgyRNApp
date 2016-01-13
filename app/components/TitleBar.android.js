import React, {
  PropTypes,
  StyleSheet,
  Animated,
  View,
  Text,
  ToolbarAndroid
} from 'react-native';

import THEME from '../constants/THEME';

let TitleBar = React.createClass({
  propTypes: {
    // The title text on this title bar
    title: PropTypes.string,
    actions: PropTypes.array,
    onActionSelected: PropTypes.func,
    translateTitle: PropTypes.bool,
    pure: PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      title: '',
      actions: []
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

  _handleActionSelect(position) {
    var actions = this.props.actions.slice(0) || [];
    actions.shift();
    var action = actions[position];

    if (action && action.onPress) {
      action.onPress();
    }
  },

  render() {
    var actions = this.props.actions.slice(0) || [];
    var leftAction = actions.shift();
    var leftIcon = leftAction ? leftAction.icon : undefined;
    var handleLeftIconPress = leftAction ? leftAction.onPress : undefined;

    var toolbar = (
      <ToolbarAndroid
        style={styles.toolbar}
        navIcon={leftIcon}
        actions={actions}
        onActionSelected={this._handleActionSelect}
        onIconClicked={handleLeftIconPress}
      >
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
      </ToolbarAndroid>
    );

    if (this.props.pure) {
      return toolbar;
    } else {
      return (
        <View style={styles.container}>
          {toolbar}
        </View>
      );
    }
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
  toolbar: {
    flex: 1,
    height: THEME.ANDROID_TITLE_BAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    flex: 1,
    paddingLeft: 2,
    paddingRight: 2,
    paddingTop: 14,
    paddingBottom: 14
  },
  titleText: {
    fontSize: 20,
    lineHeight: THEME.ANDROID_TITLE_BAR_HEIGHT - 14,
    color: '#FFFFFF',
    fontWeight: '500'
  }
});

export default TitleBar;
