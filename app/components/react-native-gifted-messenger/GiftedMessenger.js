'use strict';

var React = require('react-native');
var ImageWand = require('./../react-native-imagewand');

var {
  Text,
  View,
  ListView,
  TextInput,
  Dimensions,
  Animated,
  Image,
  TouchableNativeFeedback,
  DeviceEventEmitter,
  Platform,
  TouchableOpacity,
  PixelRatio,
  Alert,
} = React;

var moment = require('moment');
var extend = require('extend');

import InvertibleScrollView from 'react-native-invertible-scroll-view';
var GiftedSpinner = require('react-native-gifted-spinner');
var Button = require('react-native-button');
var textInputHeight = 0;
var ImageResizing = React.createClass({
  getInitialState(){
    return{
      width:200,
      height:200,
    }
  },
  render(){
    return(
      <TouchableOpacity onPress={()=>this.props.show_big_image(this.props.uri)}>
        <ImageWand
          style={{flex: 1,height: this.state.height,width:this.state.width}}
          src={this.props.uri}
          shouldNotifyLoadEvents={true}
          onImageInfo={this._imageInfo}/>
      </TouchableOpacity>
    )
  },
  _imageInfo(event){
    // Alert.alert('event',JSON.stringify(event))
    var bi = event.height/event.width
    this.setState({height:bi*200});
  }
})

var GiftedMessenger = React.createClass({
  
  getDefaultProps() {
    return {
      displayNames: true,
      placeholder: '留言...',
      styles: {},
      autoFocus: true,
      onErrorButtonPress: (message, rowID) => {},
      loadEarlierMessagesButton: false,
      loadEarlierMessagesButtonText: 'Load earlier messages',      
      onLoadEarlierMessages: (oldestMessage, callback) => {},
      parseText: false,
      handleUrlPress: (url) => {},
      handlePhonePress: (phone) => {},
      handleEmailPress: (email) => {},
      initialMessages: [],
      messages: [],
      handleSend: (message, rowID) => {},
      maxHeight: Dimensions.get('window').height,
      senderName: '傳送',
      senderImage: null,
      sendButtonText: '傳送',
      onImagePress: null,
      inverted: true,
      hideTextInput: false,
      submitOnReturn: false,
    };
  },
  
  propTypes: {
    displayNames: React.PropTypes.bool,
    placeholder: React.PropTypes.string,
    styles: React.PropTypes.object,
    autoFocus: React.PropTypes.bool,
    onErrorButtonPress: React.PropTypes.func,
    loadEarlierMessagesButton: React.PropTypes.bool,
    loadEarlierMessagesButtonText: React.PropTypes.string,      
    onLoadEarlierMessages: React.PropTypes.func,
    parseText: React.PropTypes.bool,
    handleUrlPress: React.PropTypes.func,
    handlePhonePress: React.PropTypes.func,
    handleEmailPress: React.PropTypes.func,
    initialMessages: React.PropTypes.array,
    messages: React.PropTypes.array,
    handleSend: React.PropTypes.func,
    maxHeight: React.PropTypes.number,
    senderName: React.PropTypes.string,
    senderImage: React.PropTypes.object,
    sendButtonText: React.PropTypes.string,
    onImagePress: React.PropTypes.func,
    inverted: React.PropTypes.bool,
    hideTextInput: React.PropTypes.bool,
  },

  getInitialState: function() {
    this._data = [];
    this._rowIds = [];
    
    var textInputHeight = 0;
    if (this.props.hideTextInput === false) {
      textInputHeight = 0;
    }
    
    this.listViewMaxHeight = this.props.maxHeight;
    
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => {
      if (typeof r1.status !== 'undefined') {
        return true;
      }
      return r1 !== r2;
    }});
    return {
      dataSource: ds.cloneWithRows([]),
      text: '',
      disabled: true,
      height: new Animated.Value(this.props.maxHeight),
      isLoadingEarlierMessages: false,
      allLoaded: false,
      isRefreshing:false
    };
  },
  
  getMessage(rowID) {
    if (typeof this._rowIds[this._rowIds.indexOf(rowID)] !== 'undefined') {
      if (typeof this._data[this._rowIds[this._rowIds.indexOf(rowID)]] !== 'undefined') {
        return this._data[this._rowIds[this._rowIds.indexOf(rowID)]];
      }
    }
    return null;
  },

  getPreviousMessage(rowID) {
    if (typeof this._rowIds[this._rowIds.indexOf(rowID - 1)] !== 'undefined') {
      if (typeof this._data[this._rowIds[this._rowIds.indexOf(rowID - 1)]] !== 'undefined') {
        return this._data[this._rowIds[this._rowIds.indexOf(rowID - 1)]];
      }
    }
    return null;
  },
  
  getNextMessage(rowID) {
    if (typeof this._rowIds[this._rowIds.indexOf(rowID + 1)] !== 'undefined') {
      if (typeof this._data[this._rowIds[this._rowIds.indexOf(rowID + 1)]] !== 'undefined') {
        return this._data[this._rowIds[this._rowIds.indexOf(rowID + 1)]];
      }
    }
    return null;
  },

  renderName(rowData = {}, rowID = null) {
    // if (this.props.displayNames === true) {
    //   var diffMessage = null;
    //   if (this.props.inverted === false) {
    //     diffMessage = null; // force rendering
    //   } else if (rowData.isOld === true) {
    //     diffMessage = this.getNextMessage(rowID);
    //   } else {
    //     diffMessage = this.getPreviousMessage(rowID);
    //   }
    //   if (diffMessage === null || (this._data[rowID].name !== diffMessage.name || this._data[rowID].id !== diffMessage.id)) {
    //     return (
    //       <Text style={[this.styles.name]}>
    //         {rowData.name}
    //       </Text>
    //     );
    //   }
    // }
    return null;
  },

  renderDate(rowData = {}, rowID = null) {
    // var diffMessage = null;
    // if (this.props.inverted === false) {
    //   diffMessage = null; // force rendering
    // } else if (rowData.isOld === true) {
    //   diffMessage = this.getNextMessage(rowID);
    // } else {
    //   diffMessage = this.getPreviousMessage(rowID);
    // }
    // if (rowData.date instanceof Date) {
    //   if (diffMessage === null) {
    //     return (
    //       <Text style={[this.styles.date]}>
    //         {moment(rowData.date).calendar()}
    //       </Text>
    //     );
    //   } else if (diffMessage.date instanceof Date) {
    //     let diff = moment(rowData.date).diff(moment(diffMessage.date), 'minutes');
    //     if (diff > 5) {
    //       return (
    //         <Text style={[this.styles.date]}>
    //           {moment(rowData.date).calendar()}
    //         </Text>
    //       );
    //     }
    //   }
    // }
    return null;
  },
  
  renderImage(rowData = {}, rowID = null) {
    if (rowData.image !== null) {
      
      var diffMessage = null;
      if (this.props.inverted === false) {
        diffMessage = null; // force rendering
      } else {
        diffMessage = this.getNextMessage(rowID);
      }
      
      // if (diffMessage === null || (this._data[rowID].name !== diffMessage.name || this._data[rowID].id !== diffMessage.id)) {
        if (typeof this.props.onImagePress === 'function') {
          return (
            <TouchableNativeFeedback 
              underlayColor='transparent'
              onPress={() => this.props.onImagePress(rowData, rowID)}
              style={this.styles.imagePosition}
            >
              <View>
                <Image source={rowData.image} style={[this.styles.imagePosition, this.styles.image, (rowData.position === 'left' ? this.styles.imageLeft : this.styles.imageRight)]}/>
              </View>
            </TouchableNativeFeedback>
          );
        } else {
          return (
            <Image source={rowData.image} style={[this.styles.imagePosition, this.styles.image, (rowData.position === 'left' ? this.styles.imageLeft : this.styles.imageRight)]}/>
          );
        }
      // } else {
      //   return (
      //     <View style={this.styles.imagePosition}/>
      //   );
      // }
    }
    return (
      <View style={this.styles.spacer}/>
    );
  },
  
  renderErrorButton(rowData = {}, rowID = null) {
    if (rowData.status === 'ErrorButton') {
      return (
        <ErrorButton
          onErrorButtonPress={this.props.onErrorButtonPress}
          rowData={rowData}
          rowID={rowID}
          styles={{
            errorButtonContainer: this.styles.errorButtonContainer,
            errorButton: this.styles.errorButton,
          }}
        />
      )
    }
    return null;
  },
  
  renderStatus(rowData = {}, rowID = null) {
    if (rowData.status !== 'ErrorButton' && typeof rowData.status === 'string') {
      if (rowData.status.length > 0) {
        return (
          <View>
            <Text style={this.styles.status}>{rowData.status}</Text>
          </View>
        );
      }
    }
    return null;
  },

  renderText(rowData = {}, rowID = null) {
    /*
    if (this.props.parseText === true && Platform.OS !== 'android') {
      let parse = [
        {type: 'url', style: [this.styles.link, (rowData.position === 'left' ? this.styles.linkLeft : this.styles.linkRight)], onPress: this.props.handleUrlPress},
        {type: 'phone', style: [this.styles.link, (rowData.position === 'left' ? this.styles.linkLeft : this.styles.linkRight)], onPress: this.props.handlePhonePress},
        {type: 'email', style: [this.styles.link, (rowData.position === 'left' ? this.styles.linkLeft : this.styles.linkRight)], onPress: this.props.handleEmailPress},
      ];
      return (
        <ParsedText
          style={[this.styles.text, (rowData.position === 'left' ? this.styles.textLeft : this.styles.textRight)]}
          parse={parse}
        >
          {rowData.text}
        </ParsedText>
      );
    }
    */
    return (
      <Text
        style={[this.styles.text, (rowData.position === 'left' ? this.styles.textLeft : this.styles.textRight)]}
      >
        {rowData.text}
      </Text>
    );
  },

  renderImageContent:function(url){
    return(
      <ImageResizing uri={url} show_big_image={this.props.show_big_image}/>
    )
  },
  renderRow(rowData = {}, sectionID = null, rowID = null) {
    if (rowData.type == 'chat' || rowData.type == undefined) {
      var content = this.renderText(rowData, rowID);
    }else if(rowData.type == 'image'){
      var content = this.renderImageContent(rowData.content);
    }
    if (rowData.position == 'left' && rowData.image == null) {
      Alert.alert('system',JSON.stringify(rowData.image));
    }
    return (
      <View style={rowData.type == 'image'?{flex:1}:{flex:1}}>
      {this.renderDate(rowData, rowID)}
      {rowData.position === 'left' ? this.renderName(rowData, rowID) : null}
      <View style={rowData.position === 'right' ?[this.styles.rowContainer,{alignSelf:'flex-end',flex:1}]:[this.styles.rowContainer,{alignSelf:'flex-start',flex:1}]}>
        {rowData.position === 'left' ? this.renderImage(rowData, rowID) : null}
        {rowData.position === 'right' ? this.renderErrorButton(rowData, rowID) : null}
        <View style={[(rowData.type == 'image' ? { borderRadius: 0,paddingLeft: 2,paddingRight: 2,paddingBottom: 2,paddingTop: 2,} : this.styles.bubble ), (rowData.position === 'left' ? this.styles.bubbleLeft : this.styles.bubbleRight), (rowData.status === 'ErrorButton' ? this.styles.bubbleError : null)]}>
          {content}
        </View>
        {rowData.position === 'right' ? this.renderImage(rowData, rowID) : null}
      </View>
      {rowData.position === 'right' ? this.renderStatus(rowData, rowID) : null}
      </View>
    );
  },

  onChangeText(text) {
    this.setState({
      text: text
    })
    if (text.trim().length > 0) {
      this.setState({
        disabled: false
      })
    } else {
      this.setState({
        disabled: true
      })
    }
  },

  componentDidMount() {
    this.scrollResponder = this.refs.listView.getScrollResponder();
    
    if (this.props.messages.length > 0) {
      this.appendMessages(this.props.messages);
    } else if (this.props.initialMessages.length > 0) {
      this.appendMessages(this.props.initialMessages);
    } else {
      this.setState({
        allLoaded: true
      });
    }
  },

  componentWillReceiveProps(nextProps) {
    this._data = [];
    this._rowIds = [];
    this.appendMessages(nextProps.messages);
  },

  onKeyboardWillHide(e) {
    // Animated.timing(this.state.height, {
    //   toValue: this.props.maxHeight,
    //   duration: 150,
    // }).start();
  },
  
  onKeyboardWillShow(e) {
    // Animated.timing(this.state.height, {
    //   toValue: this.props.maxHeight - 20,
    //   duration: 200,
    // }).start();
  },
  
  onSend() {
    if (this.state.text.trim().length>0) {
      var message = {
        text: this.state.text.trim(),
        name: this.props.senderName,
        image: null,
        type: 'chat',
        position: 'right',
        date: new Date(),
      };
      // var rowID = this.appendMessage(message);
      this.props.handleSend(message, null);
      this.onChangeText('');
      this.scrollResponder.scrollTo(0);
    };
  },
  
  postLoadEarlierMessages(messages = [], allLoaded = false) {
    this.prependMessages(messages);
    this.setState({
      isLoadingEarlierMessages: false
    });
    if (allLoaded === true) {
      this.setState({
        allLoaded: true,
      });
    }
  },
  
  preLoadEarlierMessages() {
    this.setState({
      isLoadingEarlierMessages: true
    });
    this.props.onLoadEarlierMessages(this._data[this._rowIds[this._rowIds.length - 1]], this.postLoadEarlierMessages);
  },
  
  renderLoadEarlierMessages() {
    if (this.props.loadEarlierMessagesButton === true) {
      if (this.state.allLoaded === false) {
        if (this.state.isLoadingEarlierMessages === true) {
          return (
            <View style={this.styles.loadEarlierMessages}>
              <GiftedSpinner />
            </View>
          );
        } else {
          return (
            <View style={this.styles.loadEarlierMessages}>
              <Button
                style={this.styles.loadEarlierMessagesButton}
                onPress={() => {this.preLoadEarlierMessages()}}
              >
                {this.props.loadEarlierMessagesButtonText}
              </Button>
            </View>
          );
        }
      }
    }
    return null;
  },

  prependMessages(messages = []) {
    var rowID = null;
    for (let i = 0; i < messages.length; i++) {
      messages[i].isOld = true;
      this._data.push(messages[i]);
      this._rowIds.push(this._data.length - 1);
      rowID = this._data.length - 1;
    }
    
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this._data, this._rowIds),
    });
    
    return rowID;
  },
  
  prependMessage(message = {}) {
    var rowID = this.prependMessages([message]);
    return rowID;
  },
  
  appendMessages(messages = []) {
    var rowID = null;
    for (let i = 0; i < messages.length; i++) {
      this._data.push(messages[i]);
      this._rowIds.unshift(this._data.length - 1);
      rowID = this._data.length - 1;
    }
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this._data, this._rowIds),
    });
    return rowID;
  },
  
  appendMessage(message = {}) {
    var rowID = this.appendMessages([message]);
    return rowID;
  },

  refreshRows() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this._data, this._rowIds),
    });
  },
  
  setMessageStatus(status = '', rowID) {
    if (status === 'ErrorButton') {
      if (this._data[rowID].position === 'right') {
        this._data[rowID].status = 'ErrorButton';
        this.refreshRows();
      }
    } else {
      if (this._data[rowID].position === 'right') {
        this._data[rowID].status = status;
      
        // only 1 message can have a status
        for (let i = 0; i < this._data.length; i++) {
          if (i !== rowID && this._data[i].status !== 'ErrorButton') {
            this._data[i].status = '';
          }
        }
        this.refreshRows();
      }
    }
  },
  handleScroll: function(event: Object) {
   if (event.nativeEvent.contentOffset.y == event.nativeEvent.contentSize.height - event.nativeEvent.layoutMeasurement.height) {
    if (!this.props.isRefreshing) {
      this.props.getMoreMessages();
    }
    console.log('update');
   };
  },
  renderAnimatedView() {
    if (this.props.inverted === true) {
      return (
        <Animated.View
          style={{
            height: this.props.maxHeight,
          }}
        >
            {this.props.isRefreshing?
              <Image
              style={{width:30,height:30,alignSelf:'center'}}
              source={require('../../assets/images/loaging.gif')} />
             :null}
            <ListView
              ref='listView'
              dataSource={this.state.dataSource}
              renderRow={this.renderRow}
              onScroll={this.handleScroll}
              renderFooter={this.renderLoadEarlierMessages}
              style={this.styles.listView}
      
              renderScrollComponent={props => <InvertibleScrollView {...props} handleScroll={this.props.handleScroll} inverted />}
      
              // not working android RN 0.14.2
              onKeyboardDidShow={this.onKeyboardWillShow}
              onKeyboardDidHide={this.onKeyboardWillHide}
      
              /*
                keyboardShouldPersistTaps={false} // @issue keyboardShouldPersistTaps={false} + textInput focused = 2 taps are needed to trigger the ParsedText links
                keyboardDismissMode='interactive'
              */
          
              keyboardShouldPersistTaps={true}
              keyboardDismissMode='on-drag'
          
              {...this.props}
            />
            {this.renderTextInput()}
        </Animated.View>
      );
    }
    return (
      <Animated.View
        style={{
          height: this.props.maxHeight,
        }}
      >
          {this.props.isRefreshing?<Text></Text>:null}
        <ListView
          ref='listView'
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderFooter={this.renderLoadEarlierMessages}
          style={this.styles.listView}
  
          // When not inverted: Using Did instead of Will because onKeyboardWillShow is not working in Android RN 0.14.2
          onKeyboardDidShow={this.onKeyboardWillShow}
          onKeyboardDidHide={this.onKeyboardWillHide}
  
          /*
            keyboardShouldPersistTaps={false} // @issue keyboardShouldPersistTaps={false} + textInput focused = 2 taps are needed to trigger the ParsedText links
            keyboardDismissMode='interactive'
          */
      
          keyboardShouldPersistTaps={true}
          keyboardDismissMode='on-drag'
      
          {...this.props}
        />
        {this.renderTextInput()}
      </Animated.View>
    );

  },
  
  render() {
    return (
      <View
        style={this.styles.container}
        ref='container'
      >        
        {this.renderAnimatedView()}         
      </View>
    )
  },
  
  renderTextInput() {
    if (this.props.hideTextInput === false) {
      return (
        <View style={this.styles.textInputContainer}>
          {this.props.photoAvilible?<TouchableNativeFeedback onPress={this.props.showImagePicker}><View style={{width:45,justifyContent:'center'}}>
            <Image
              style={{width:64/2,height:50/2}}
              source={require('../../assets/images/icon_chat_camera.png')} />
          </View></TouchableNativeFeedback>:null}
          <TextInput
            multiline={true}
            style={this.styles.textInput}
            placeholder={this.props.placeholder}
            ref='textInput'
            onChangeText={this.onChangeText}
            value={this.state.text}
            autoFocus={this.props.autoFocus}
            returnKeyType={this.props.submitOnReturn ? 'send' : 'default'}
            onSubmitEditing={this.props.submitOnReturn ? this.onSend : null}
            
            blurOnSubmit={false}
          />
          <View style={this.styles.allCenter}>
            <TouchableNativeFeedback onPress={this.onSend}>
              <View style={this.styles.mainBtn}>
                <Text style={this.styles.mainBtnText}>{this.props.sendButtonText}</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      ); 
    }
    return null;
  },

  componentWillMount() {
    // DeviceEventEmitter.addListener('keyboardDidShow', this.onKeyboardWillShow.bind(this))
    // DeviceEventEmitter.addListener('keyboardDidHide', this.onKeyboardWillHide.bind(this))
    this.styles = {
      container: {
        flex: 1,
        backgroundColor: '#FAF7F5',
      },
      listView: {
        flex: 1,
      },
      allCenter:{
        justifyContent:'center',
        alignItems:'center'
      },
      mainBtn:{
        borderWidth:1,
        borderColor:'#F89680',
        paddingTop:5,
        paddingBottom:5,
        paddingLeft:15,
        paddingRight:15
      },
      mainBtnText:{
        color:'#F89680'
      },
      textInputContainer: {
        height: 44,
        borderTopWidth: 1,
        borderColor: '#F89680',
        flexDirection: 'row',
        backgroundColor:"#FFF",
        paddingLeft: 10,
        paddingRight: 10,
      },
      textInput: {
        alignSelf: 'center',
        height: 30,
        width: 100,
        backgroundColor: "#FFF",
        flex: 1,
        padding: 0,
        margin: 0,
        fontSize: 15,
      },
      sendButton: {
        marginTop: 11,
        marginLeft: 10,
        borderColor:'#F89680',
        borderWidth:2
      },
      name: {
        color: '#aaaaaa',
        fontSize: 12,
        marginLeft: 60,
        marginBottom: 5,
      },
      date: {
        color: '#aaaaaa',
        fontSize: 12,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 8,
      },
      rowContainer: {
        flexDirection: 'row',
        marginBottom: 10,
      },
      imagePosition: {
        height: 30,
        width: 30,
        alignSelf: 'flex-end',
        marginLeft: 8,
        marginRight: 8,        
      },
      image: {
        alignSelf: 'center',
        borderRadius: 15,
      },
      imageLeft: {
      },
      imageRight: {
      },
      bubble: {
        borderRadius: 15,
        paddingLeft: 14,
        paddingRight: 14,
        paddingBottom: 10,
        paddingTop: 8,
        flex: 1,
      },
      text: {
        color: '#000',
      },
      textLeft: {
        // textAlign:'left'
        width:Dimensions.get('window').width/3*2
      },
      textRight: {
        color: '#fff',
        // textAlign:'right'
        width:Dimensions.get('window').width/3*2
      },
      bubbleLeft: {
        // marginRight: 70,
        backgroundColor: '#e6e6eb',
      },
      bubbleRight: {
        // marginLeft: 70,
        backgroundColor: '#007aff',
        // marginRight:10,
      },
      bubbleError: {
        backgroundColor: '#e01717'
      },
      link: {
        color: '#007aff',
        textDecorationLine: 'underline',
      },
      linkLeft: {
        color: '#000',
      },
      linkRight: {
        color: '#fff',
      },
      errorButtonContainer: {
        marginLeft: 8,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#e6e6eb',
        borderRadius: 15,
        width: 30,
        height: 30,
      },
      errorButton: {
        fontSize: 22,
        textAlign: 'center',
      },
      status: {
        color: '#aaaaaa',
        fontSize: 12,
        textAlign: 'right',
        marginRight: 15,
        marginBottom: 10,
        marginTop: -5,
      },
      loadEarlierMessages: {
        height: 44, 
        justifyContent: 'center',
        alignItems: 'center',
      },
      loadEarlierMessagesButton: {
        fontSize: 14,
      },
      spacer: {
        width: 10,
      },
    };
    
    extend(this.styles, this.props.styles);
  },  
});

var ErrorButton = React.createClass({
  getInitialState() {
    return {
      isLoading: false,
    };
  },
  getDefaultProps() {
    return {
      onErrorButtonPress: () => {},
      rowData: {},
      rowID: null,
      styles: {},
    };
  },
  onPress() {
    this.setState({
      isLoading: true,
    });
    
    this.props.onErrorButtonPress(this.props.rowData, this.props.rowID);
  },
  render() {
    if (this.state.isLoading === true) {
      return (
        <View style={[this.props.styles.errorButtonContainer, {
          backgroundColor: 'transparent',
          borderRadius: 0,
        }]}>
          <GiftedSpinner />
        </View>
      );
    }
    return (
      <View style={this.props.styles.errorButtonContainer}>
        <TouchableNativeFeedback 
          underlayColor='transparent'
          onPress={this.onPress}
        >
          <Text style={this.props.styles.errorButton}>↻</Text>
        </TouchableNativeFeedback>
      </View>
    );
  }
});

module.exports = GiftedMessenger;
