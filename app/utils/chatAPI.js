window.navigator.userAgent='colorgy';
var io = require('./../../node_modules/socket.io-client/socket.io.js');
import colorgyAPI from './colorgyAPI';
import { doUpdateMe } from '../actions/colorgyAPIActions';

var socket = {};

var socketServer = "http://52.68.177.186:1337";

function connectToChatRoom (soc,userId,friendId,uuid,accessToken) {
	return new Promise(function(resolve, reject){
		var _postData = {userId:userId,friendId:friendId,uuid:uuid,accessToken:accessToken};
		console.log('============= connect to chat room =============',_postData)
		soc.emit(
		    'post', 
		    {
		 			  method: 'post',
		        headers: {},
		        data: _postData,
		        url: "http://52.68.177.186:1337/chatroom/establish_connection"
		    },
		    function (data) {
		    	resolve(data);
		    }
		);
	})
};

function sendMessage (soc,chatroomId, userId, socketId, type, content){
		var _postData = {
			chatroomId:chatroomId,
			userId:userId,
			socketId:socketId,
			type: type,
			content:content
		}
		soc.emit(
			'post',
			{
					method:'post',
					headers: {},
					data: _postData,
					url:'/chatroom/send_message'
			}
		)
}

function connectToServer(){
	return new Promise(function(resolve, reject){
		var soc = io.connect('http://52.68.177.186:1337?__sails_io_sdk_version=0.11.0', {jsonp: false});
		soc.on('connect',function(response){
			resolve(soc);
		})
	});
}

function check_user_available(access_token,uuid){
	return new Promise(function(){
		console.log('============= check_user_available =============')
	  fetch(socketServer + '/users/check_user_available', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
		    uuid:uuid,
		    accessToken:access_token
		  })
		})
		.then(function(data) {
	    var userId = JSON.parse(data._bodyText).userId;
	    var status = JSON.parse(data._bodyText).status;
	    if (status == "not_registered") {
	    	console.log("not_registered: userId:", userId);
	    	return {userId:userId,status:status};
	    };
	  }).catch(function(error) {
	    console.log('request failed', error)
	  })
  });
};


socket = {
  ...socket,
  sendMessage:sendMessage,
  connectToChatRoom: connectToChatRoom,
  connectToServer:connectToServer,
  socketServer: socketServer,
  check_user_available:check_user_available,
};

if (window) window.socket = socket;

export default socket;