import React, { requireNativeComponent, PropTypes, View, UIManager, findNodeHandle } from 'react-native';

var TableCreateCoursePageLayoutAndroid = React.createClass({
  propTypes: {
    ...View.propTypes,
    toolbarTitle: PropTypes.string,
    toolbarTitleColor: PropTypes.string,
    toolbarExpandedTitleColor: PropTypes.string,
    toolbarHeight: PropTypes.number,
    toolbarPaddingTop: PropTypes.number,
    contentScrimColor: PropTypes.string,
    onPrimaryInputTextChange: PropTypes.func,
    onSecondaryInputTextChange: PropTypes.func,
    primaryInputInitialValue: PropTypes.string,
    secondaryInputInitialValue: PropTypes.string,
    primaryInputLabel: PropTypes.string,
    secondaryInputLabel: PropTypes.string,
    primaryInputHint: PropTypes.string,
    secondaryInputHint: PropTypes.string
  },

  getDefaultProps: function() {
    return {};
  },

  componentDidUpdate: function() {
    this._setChildrenLayout();
  },

  _setChildrenLayout: function() {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this),
      UIManager.RCTTableCreateCoursePageLayoutAndroid.Commands.setLayout,
      []
    );
  },

  _onChange: function(event) {
    event = event.nativeEvent;

    switch (event.type) {
      case 'primaryInputChange':
        if (this.props.onPrimaryInputTextChange) this.props.onPrimaryInputTextChange(event.string);
        break;
      case 'secondaryInputChange':
        if (this.props.onSecondaryInputTextChange) this.props.onSecondaryInputTextChange(event.string);
        break;
    }
  },

  render: function() {
    return (
      <RCTTableCreateCoursePageLayoutAndroid {...this.props} onChange={this._onChange} />
    );
  }
});

var RCTTableCreateCoursePageLayoutAndroid = requireNativeComponent('RCTTableCreateCoursePageLayoutAndroid', TableCreateCoursePageLayoutAndroid, {
  nativeOnly: { onChange: true }
});

export default TableCreateCoursePageLayoutAndroid;
