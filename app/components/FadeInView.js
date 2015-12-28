import React, {
  Animated
} from 'react-native';

let FadeInView = React.createClass({
  propTypes: {
  },

  getDefaultProps() {
    return {
    };
  },

  getInitialState() {
    return {
      opacity: new Animated.Value(0)
    };
  },

  componentDidMount() {
    Animated.timing(this.state.opacity, { toValue: 1, duration: 300 }).start();
  },

  render() {
    return (
      <Animated.View
        style={{
          opacity: this.state.opacity
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }
});

export default FadeInView;
