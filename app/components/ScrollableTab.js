import React, {
  PropTypes,
  Dimensions,
  View,
  PanResponder,
  Animated,
  Text
} from 'react-native';
import TabBar from './TabBar';

var deviceWidth = Dimensions.get('window').width;

var ScrollableTab = React.createClass({
  propTypes: {
    initialTab: PropTypes.number,
    currentTab: PropTypes.number,
    onTabChanged: PropTypes.func,
    tabBarPosition: PropTypes.string,
    edgeHitWidth: PropTypes.number,
    springTension: PropTypes.number,
    springFriction: PropTypes.number,
    color: PropTypes.string,
    backgroundColor: PropTypes.string,
    activeColor: PropTypes.string,
    tabBar: PropTypes.any,
    autoHeight: PropTypes.bool
  },

  getDefaultProps() {
    return {
      tabBarPosition: 'top',
      edgeHitWidth: 45,
      springTension: 50,
      springFriction: 10,
      color: 'black',
      backgroundColor: 'white',
      activeColor: 'blue',
      tabBar: TabBar
    }
  },

  getInitialState() {
    var currentTab = this.props.currentTab || this.props.initialTab || 0;

    return {
      currentTab: currentTab,
      currentActiveTab: currentTab,
      scrollValue: new Animated.Value(currentTab),
      viewPosition: currentTab * deviceWidth
    };
  },

  componentWillReceiveProps(nextProps) {
    if (typeof this.props.currentTab === 'number' &&
        typeof nextProps.currentTab === 'number' &&
        this.props.currentTab != nextProps.currentTab) {

      this.setState({
        currentTab: nextProps.currentTab,
        currentActiveTab: nextProps.currentTab
      });

      this.animateToTab(nextProps.currentTab);
    }
  },

  getCurrentTab() {
    if (typeof this.props.currentTab === 'number') return this.props.currentTab;
    return this.state.currentTab;
  },

  componentWillMount() {
    let onTouchRelease = (e, gestureState) => {
      this.setState({ animating: false });
      var relativeGestureDistance = gestureState.dx / deviceWidth,
          lastTabIndex = this.props.children.length - 1,
          vx = gestureState.vx,
          newTab = this.getCurrentTab();

      if (relativeGestureDistance < -0.5 || (relativeGestureDistance < 0 && vx <= -0.5)) {
        newTab = newTab + 1;
      } else if (relativeGestureDistance > 0.5 || (relativeGestureDistance > 0 && vx >= 0.5)) {
        newTab = newTab - 1;
      }

      this.props.hasTouch && this.props.hasTouch(false);
      this.goToTab(Math.max(0, Math.min(newTab, this.props.children.length - 1)));
    };

    let onTouchMove = (e, gestureState) => {
      this.setState({ animating: true });
      var { dx, vx } = gestureState;
      var lastTabIndex = this.props.children.length - 1;
      var relativeGestureDistance = dx / deviceWidth;
      var newTab = this.getCurrentTab();

      var offsetX = dx - (this.getCurrentTab() * deviceWidth);
      this.state.scrollValue.setValue(-1 * offsetX / deviceWidth);
    };

    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (e, gestureState) => {
        var { dx, dy, moveX } = gestureState;
        var { edgeHitWidth, locked, hasTouch } = this.props;

        if (Math.abs(dx) > Math.abs(dy)) {
          if ((moveX <= edgeHitWidth ||
               moveX >= deviceWidth - edgeHitWidth) &&
              locked !== true) {
            hasTouch && hasTouch(true);
            return true;
          }
        }
      },

      onPanResponderMove: onTouchMove,

      onPanResponderRelease: onTouchRelease,
      onPanResponderTerminate: onTouchRelease
    });
  },

  goToTab(tabNumber) {
    this.props.onTabChanged && this.props.onTabChanged(tabNumber);

    if (typeof this.props.currentTab !== 'number') {
      this.animateToTab(tabNumber);
    } else {
      this.animateToTab(this.getCurrentTab());
    }
  },

  animateToTab(tabNumber) {
    this.setState({
      currentTab: tabNumber,
      currentActiveTab: tabNumber,
      animating: true
    }, () => {
      Animated.spring(this.state.scrollValue, { toValue: tabNumber, friction: this.props.springFriction, tension: this.props.springTension }).start();
    });

    var stopAnimate = () => {
      var viewPosition = -this.getCurrentTab() * deviceWidth;
      this.setState({
        animating: false,
        viewPosition: viewPosition
      });
    };

    // TODO: listen to the animate stop event instead of just counting down
    if (this.animateTimer) clearTimeout(this.animateTimer);
    this.animateTimer = setTimeout(stopAnimate, 1000);
  },

  renderTabBar(props) {
    var ViewTabBar = this.props.tabBar;
    if (this.props.renderTabBar === false) {
      return null;
    } else if (this.props.renderTabBar) {
      return React.cloneElement(this.props.renderTabBar(), props);
    } else {
      return <ViewTabBar {...props} />;
    }
  },

  render() {
    var sceneContainerStyle = {
      width: deviceWidth * this.props.children.length,
      flex: 1,
      flexDirection: 'row'
    };

    var translateX = this.state.scrollValue.interpolate({
      inputRange: [0, 1], outputRange: [0, -deviceWidth]
    });

    var tabBarProps = {
      ...this.props,
      goToTab: this.goToTab,
      tabs: this.props.children.map((child) => child.props.tabLabel),
      activeTab: this.getCurrentTab(),
      scrollValue: this.state.scrollValue
    };

    var viewStyle = [sceneContainerStyle, {
      marginLeft: this.state.viewPosition
    }];

    if (this.state.animating) viewStyle = [sceneContainerStyle, { transform: [{ translateX }] }];

    return (
      <View style={{ flex: 1 }}>
        {this.props.tabBarPosition === 'top' ? this.renderTabBar(tabBarProps) : null}
        <Animated.View
          style={viewStyle}
          pointerEvents={(this.state.animating ? 'box-only' : 'auto')}
          {...this._panResponder.panHandlers}
          >
          {(() => {
            if (this.props.autoHeight) {
              return (this.props.children.map((c, i) => <View key={i} style={{ width: deviceWidth, flex: 1 }}><View style={{ width: deviceWidth, position: (this.state.animating || i === this.getCurrentTab()) ? 'relative' : 'absolute', flex: 1 }}>{c}</View></View>));
            } else {
              return (this.props.children.map((c, i) => <View key={i} style={{ width: deviceWidth, flex: 1 }}>{c}</View>));
            }
          })()}
        </Animated.View>

        {this.props.tabBarPosition === 'bottom' ? this.renderTabBar(tabBarProps) : null}
      </View>
    );
  }
});

export default ScrollableTab;
