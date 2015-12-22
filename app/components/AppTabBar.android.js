import React from 'react-native';

var {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  PanResponder,
  Animated,
  Image
} = React;

var deviceWidth = Dimensions.get('window').width;

var styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 20
  },
  tabContentWrapper: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabs: {
    height: 52,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopColor: '#B2B2B2',
    borderTopWidth: 1
  }
});

var AppTabBar = React.createClass({
  propTypes: {
    goToTab: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
    color: React.PropTypes.string,
    backgroundColor: React.PropTypes.string,
    activeColor: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      color: 'black',
      backgroundColor: 'white',
      activeColor: '#F89680'
    };
  },


  renderTabOption(name, i) {
    var isTabActive = (this.props.activeTab === i);
    var textStyle = {
      fontSize: 12,
      marginTop: 2,
      color: isTabActive ? '#F89680' : '#898989',
      opacity: isTabActive ? 0.87 : 0.54,
    };

    var icon = '';

    switch (i) {
      case 0:
        if (isTabActive) {
          icon = require('../assets/images/tab-1-a.png');
        } else {
          icon = require('../assets/images/tab-1.png');
        }
        break;
      case 1:
        if (isTabActive) {
          icon = require('../assets/images/tab-2-a.png');
        } else {
          icon = require('../assets/images/tab-2.png');
        }
        break;
      case 2:
        if (isTabActive) {
          icon = require('../assets/images/tab-0-a.png');
        } else {
          icon = require('../assets/images/tab-0.png');
        }
        break;
    }

    return (
      <TouchableHighlight underlayColor="#EEEEEE" style={[styles.tab]} key={name} onPress={() => this.props.goToTab(i)}>
        <View style={styles.tabContentWrapper}>
          <Image source={icon} style={{ width: 22, height: 22 }} />
          <Text style={textStyle}>{name.toUpperCase()}</Text>
        </View>
      </TouchableHighlight>
    );
  },

  render() {
    var numberOfTabs = this.props.tabs.length;
    var tabUnderlineStyle = {
      position: 'absolute',
      width: deviceWidth / numberOfTabs,
      height: 2,
      backgroundColor: this.props.activeColor,
      bottom: 0,
    };

    var left = this.props.scrollValue.interpolate({
      inputRange: [0, 1], outputRange: [0, deviceWidth / numberOfTabs]
    });

    var backgroundColor = this.props.backgroundColor;

    return (
      <View style={[styles.tabs, { backgroundColor }]}>
        {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
      </View>
    );
  },
});

export default AppTabBar;
