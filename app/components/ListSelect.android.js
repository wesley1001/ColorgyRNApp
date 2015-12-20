import React, {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';

let ListSelect = React.createClass({
  propTypes: {
    options: React.PropTypes.array,
    onSelect: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      options: [
        { name: 'Option A', value: 'a' },
        { name: 'Option B', value: 'b' },
        { name: 'Option C', value: 'c' },
        { name: 'Option D', value: 'd' },
        { name: 'Option E', value: 'e' },
        { name: 'Option F', value: 'f' },
        { name: 'Option G', value: 'g' },
        { name: 'Option H', value: 'h' },
        { name: 'Option I', value: 'i' },
        { name: 'Option J', value: 'j' },
        { name: 'Option K', value: 'k' },
        { name: 'Option L', value: 'l' },
        { name: 'Option M', value: 'm' },
        { name: 'Option N', value: 'n' },
        { name: 'Option O', value: 'o' },
        { name: 'Option P', value: 'p' }
      ]
    };
  },

  getInitialState() {
    return {
      selected: null
    };
  },

  _getSelections() {
    return this.props.options.map((option, i) => {
      var selected = false;
      if (this.state.selected === option.value) selected = true;

      return (
        <TouchableOpacity
          key={option.value}
          style={[styles.option, selected && styles.activeOption]}
          onPress={() => this._handleSelect(option.value)}
        >
          <Text
            style={[styles.optionText, selected && styles.activeOptionText]}
          >
            {option.name}
          </Text>
          <Image
            style={styles.checkMarkIcon}
            source={require('../assets/images/icon_done_white.png')} />
        </TouchableOpacity>
      );
    });
  },

  _handleSelect(value) {
    this.setState({ selected: value });
    if (this.props.onSelect) this.props.onSelect({ value: value });
  },

  render() {
    return (
      <ScrollView style={[styles.view, this.props.style]} contentContainerStyle={styles.container}>
        {this._getSelections()}
      </ScrollView>
    );
  }
});

let styles = StyleSheet.create({
  view: {
    marginLeft: -9,
    marginRight: -9
  },
  container: {
    justifyContent: 'space-between',
    alignItems: 'stretch',
    padding: 8
  },
  option: {
    marginBottom: 8,
    height: 44,
    borderWidth: 1.8,
    borderColor: '#E0E0E0',
    borderStyle: 'dotted',
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 14,
    opacity: 0.9
  },
  optionText: {
    flex: 1,
    fontSize: 16
  },
  activeOption: {
    borderWidth: 0,
    backgroundColor: '#51ADE1',
    opacity: 1,
    transform: [{ scale: 1.02 }]
  },
  activeOptionText: {
    color: 'white'
  },
  checkMarkIcon: {
    width: 24,
    height: 24
  }
});

export default ListSelect;
