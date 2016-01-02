import React, {
  InteractionManager,
  StyleSheet,
  View,
  ScrollView,
  ListView,
  Image,
  TouchableOpacity,
  Text
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
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    return {
      selectedValue: null,
      dataSource: ds.cloneWithRows(this._getSelections({}))
    };
  },

  _getSelections(selectedValue = this.state.selected) {
    return this.props.options.map((option, i) => {
      var selected = false;
      if (selectedValue === option.value) selected = true;
      return { ...option, selected };
    });
  },

  _renderRow: function(rowData, sectionID: number, rowID: number) {
    return (
      <TouchableOpacity
        style={[styles.option, rowData.selected && styles.activeOption]}
        onPress={() => this._handleSelect(rowData.value)}
      >
        <Text
          style={[styles.optionText, rowData.selected && styles.activeOptionText]}
        >
          {rowData.name}
        </Text>
        <Image
          style={styles.checkMarkIcon}
          source={require('./icon_done_white.png')} />
      </TouchableOpacity>
    );
  },

  _handleSelect(value) {
    this.setState({
      selectedValue: value,
      dataSource: this.state.dataSource.cloneWithRows(
        this._getSelections(value)
      )
    });

    InteractionManager.runAfterInteractions(() => {
      if (this.props.onSelect) this.props.onSelect({ value: value });
    });
  },

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
        />
      </View>
    );
  }
});

let styles = StyleSheet.create({
  container: {
    marginLeft: -8,
    marginRight: -8,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    paddingVertical: 8,
    paddingHorizontal: 0
  },
  option: {
    marginLeft: 8,
    marginRight: 8,
    marginTop: 4,
    marginBottom: 4,
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
