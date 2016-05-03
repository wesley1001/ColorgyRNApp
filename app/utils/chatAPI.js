import React,{AsyncStorage,Alert,ToastAndroid} from 'react-native';
window.navigator.userAgent='colorgy';
var io = require('./../../node_modules/socket.io-client/socket.io.js');
import colorgyAPI from './colorgyAPI';
import { doUpdateMe } from '../actions/colorgyAPIActions';

var socket = {};

var socketServer = "http://chat.colorgy.io";

function clean_storage () {
	 try {
      AsyncStorage.removeItem('chat_state_haveSignUp').done();
      AsyncStorage.removeItem('chat_state_haveSend').done();
      AsyncStorage.removeItem('chat_data_id').done();
      AsyncStorage.removeItem('lastest_answer').done();
      AsyncStorage.removeItem('chat_state_haveUploadImage').done();
    }catch(e){
    	console.log("clean_storage_fail:",e);
    	ToastAndroid.show('讀寫資料時發生錯誤，請確認網路是否穩定。',ToastAndroid.SHORT);
    }
}

function connectToChatRoom (soc,userId,chatroomId,uuid,accessToken) {
	return new Promise(function(resolve, reject){
		var _postData = {userId:userId,chatroomId:chatroomId,uuid:uuid,accessToken:accessToken};
		console.log('============= connect to chat room =============',_postData)
		soc.emit(
		    'post', 
		    {
		 			  method: 'post',
		        headers: {},
		        data: _postData,
		        url: socketServer+"/chatroom/establish_connection"
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

function chatroom_more_message(access_token,uuid,userId,chatroomId,offset){
		return new Promise(function(resolve,reject){
		console.log('============= chatroom_more_message =============')
	  fetch(socketServer + '/chatroom/more_message', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
		    uuid:uuid,
		    accessToken:access_token,
		    chatroomId:chatroomId,
		    userId:userId,
		    offset:offset,
		  })
		})
		.then(function(data) {
			resolve(data);
	  }).catch(function(error) {
	  	ToastAndroid.show('讀寫資料時發生錯誤，請確認網路是否穩定。',ToastAndroid.SHORT);
	    resolve(false);
	    console.log("error",error);
	  })
  });
}

function connectToServer(){
	return new Promise(function(resolve, reject){
		var soc = io.connect(socketServer+'?__sails_io_sdk_version=0.11.0', {jsonp: false});
		soc.on('connect',function(response){
			resolve(soc);
		})
	});
};

function users_remove_chatroom(accessToken,uuid,userId,chatroomId) {
	return new Promise(function(resolve,reject){
		console.log('============= /users/remove_chatroom =============')
	  fetch(socketServer + '/users/remove_chatroom', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
		    uuid:uuid,
		    accessToken:access_token,
		    chatroomId:chatroomId,
		    userId:userId
		  })
		})
		.then(function(data) {
			resolve(data);
	  }).catch(function(error) {
	  	ToastAndroid.show('讀寫資料時發生錯誤，請確認網路是否穩定。',ToastAndroid.SHORT);
	    resolve(false);
	    console.log("error",error);
	  })
  });
}

function get_user_data(access_token,uuid){
	return new Promise(function(resolve,reject){
		console.log('============= get_user_data =============')
	  fetch(socketServer + '/users/me', {
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
			resolve(data._bodyText);
	  }).catch(function(error) {
	  	ToastAndroid.show('讀寫資料時發生錯誤，請確認網路是否穩定。',ToastAndroid.SHORT);
	    resolve(false);
	    console.log("error",error)
	  })
  });
}

function chatroom_leave_chatroom(accessToken,uuid,userId,chatroomId) {
	return new Promise(function(resolve,reject){
		console.log('============= /chatroom/leave_chatroom =============',accessToken,uuid,userId,chatroomId);
	  fetch("http://chat.colorgy.io/chatroom/leave_chatroom", {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
		    uuid:uuid,
		    accessToken:access_token,
		    userId:userId,
		    chatroomId:chatroomId
		  })
		})
		.then(function(data) {
			console.log(data);
			resolve(data);
	  }).catch(function(error) {
	    ToastAndroid.show('讀寫資料時發生錯誤，請確認網路是否穩定。',ToastAndroid.SHORT);
	    resolve(false);
	    console.log("error",error)
	  })
  });
}

function get_history_target(access_token,uuid,userId,gender,page){
	return new Promise(function(resolve,reject){
		console.log('============= /users/get_history_target =============',access_token,uuid,userId,gender,page)
	  fetch(socketServer + '/users/get_history_target', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
		    uuid:uuid,
		    accessToken:access_token,
		    userId:userId,
		    gender:gender,
		    page:page
		  })
		})
		.then(function(data) {
			console.log('get_history_target=>>',data);
			resolve(data);
	  }).catch(function(error) {
	  	ToastAndroid.show('讀寫資料時發生錯誤，請確認網路是否穩定。',ToastAndroid.SHORT);
	    resolve(false);
	    console.log("error",error);
	  })
  });
}


function get_question(){
		return new Promise(function(resolve,reject){
			console.log('============= get_question =============',socketServer);
		  fetch(socketServer + '/questions/get_question')
			.then(function(data) {
				resolve(JSON.parse(data._bodyInit));
		  }).catch(function(error) {
		  	ToastAndroid.show('讀寫資料時發生錯誤，請確認網路是否穩定。',ToastAndroid.SHORT);
		    resolve(false);
		    console.log("error",error);
		  })
  });
}



function check_user_available(access_token,uuid){
	return new Promise(function(resolve,reject){
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
			resolve(data)
	  }).catch(function(error) {
	  	ToastAndroid.show('讀寫資料時發生錯誤，請確認網路是否穩定。',ToastAndroid.SHORT);
	    resolve(false);
	    console.log("error",error);
	  })
  });
};

function update_from_core(access_token,uuid){
	return new Promise(function(resolve,reject){
		console.log('============= /users/update_from_core =============')
	  fetch(socketServer + '/users/update_from_core', {
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
	    	resolve(userId)
	    }else{
	    	console.log(userId);
	    	resolve(userId);
	    }
	  }).catch(function(error) {
	  	ToastAndroid.show('讀寫資料時發生錯誤，請確認網路是否穩定。',ToastAndroid.SHORT);
	    resolve(false);
	    console.log("error",error);
	  })
  });
};

function hi_get_my_list(accessToken,uuid,userId) {
	return new Promise(function(resolve, reject) {
		fetch(socketServer+'/hi/get_my_list',{
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
		  	accessToken:accessToken,
		  	uuid:uuid,
		  	userId:userId,
		  })
		})
		.then(function(data) {
	    	resolve(data);
	  }).catch(function(error) {
	  	ToastAndroid.show('讀寫資料時發生錯誤，請確認網路是否穩定。',ToastAndroid.SHORT);
		    resolve(false)
		    console.log("error",error)
	  })
	})
}

function users_update_user_status (accessToken,uuid,status) {
	return new Promise(function (resolve, reject) {
		console.log('=============/users/update_user_status=========');
		fetch(socketServer + '/users/update_user_status', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
		  	accessToken:accessToken,
		  	uuid:uuid,
		  	status:status,
		  })
		})
		.then(function(data) {
	    	resolve(data);
	  }).catch(function(error) {
	  	ToastAndroid.show('讀寫資料時發生錯誤，請確認網路是否穩定。',ToastAndroid.SHORT);
		    resolve(false)
		    console.log("error",error)
	  })
	})
}

function hi_check_hi (accessToken,uuid,userId,targetId) {
	return new Promise(function (resolve, reject) {
		console.log('=============/hi/say_hi=========');
		fetch(socketServer + '/hi/check_hi', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
		  	accessToken:accessToken,
		  	uuid:uuid,
		  	userId:userId,
		  	targetId:targetId,
		  })
		})
		.then(function(data) {
	    	resolve(data);
	  }).catch(function(error) {
	  	ToastAndroid.show('讀寫資料時發生錯誤，請確認網路是否穩定。',ToastAndroid.SHORT);
		    resolve(false)
		    console.log("error",error)
	  })
	})
}

function hi_say_hi (accessToken,uuid,userId,targetId,message) {
	return new Promise(function (resolve, reject) {
		console.log('=============/hi/say_hi=========');
		fetch(socketServer + '/hi/say_hi', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
		  	accessToken:accessToken,
		  	uuid:uuid,
		  	userId:userId,
		  	targetId:targetId,
		  	message:message,
		  })
		})
		.then(function(data) {
	    	resolve(data);
	  }).catch(function(error) {
	  	ToastAndroid.show('讀寫資料時發生錯誤，請確認網路是否穩定。',ToastAndroid.SHORT);
		    resolve(false)
		    console.log("error",error)
	  })
	})
}

function get_available_target(accessToken,uuid,userId,gender,page){
	return new Promise(function(resolve,reject){
		console.log('============= get_available_target =============')
	  fetch(socketServer + '/users/get_available_target', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
		  	accessToken:accessToken,
		  	uuid:uuid,
		  	userId:userId,
		    page:page,
		    gender:gender,
		  })
		})
		.then(function(data) {
				console.log("============= get_available_target==>",data);
	    	resolve(data);
	  }).catch(function(error) {
	  		ToastAndroid.show('讀寫資料時發生錯誤，請確認網路是否穩定。',ToastAndroid.SHORT);
		    resolve(false)
		    console.log("error",error)
	  })
  });
}

function hi_get_list (accessToken,uuid,userId) {
	return new Promise(function (resolve, reject) {
		console.log('=============/hi/get_list=========',accessToken,uuid,userId);
		fetch(socketServer + '/hi/get_list', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
		  	accessToken:accessToken,
		  	uuid:uuid,
		  	userId:userId,
		  })
		})
		.then(function(data) {
	    	resolve(data);
	  }).catch(function(error) {
	  		ToastAndroid.show('讀寫資料時發生錯誤，請確認網路是否穩定。',ToastAndroid.SHORT);
		    resolve(false)
		    console.log("error",error)
	  })
	})
}

function send_email_verify(accessToken,email) {
	return new Promise(function (resolve, reject) {
		console.log('=============/v1/me/emails.json=========');
		fetch("https://colorgy.io/api/docs/v1/me/emails.json", {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
		  	accessToken:accessToken,
		  	email:email,
		  })
		})
		.then(function(data) {
	    	resolve(data);
	  }).catch(function(error) {
	  	ToastAndroid.show('讀寫資料時發生錯誤，請確認網路是否穩定。',ToastAndroid.SHORT);
		    resolve(false)
		    console.log("error",error)
	  })
	})
}

function hi_response (accessToken,uuid,userId,hiId,response) {
	console.log(accessToken,uuid,userId,hiId,response);
	if (response) {
		var route = '/hi/accept_hi';
	}else{
		var route = '/hi/reject_hi';
	};
	return new Promise(function (resolve, reject) {
		console.log('=============hi_get_list=========');
		fetch(socketServer + route, {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
		  	accessToken:accessToken,
		  	uuid:uuid,
		  	userId:userId,
		  	hiId:hiId,
		  })
		})
		.then(function(data) {
	    	resolve(data);
	  }).catch(function(error) {
	  	ToastAndroid.show('讀寫資料時發生錯誤，請確認網路是否穩定。',ToastAndroid.SHORT);
		    resolve(false)
		    console.log("error",error)
	  })
	})
}

function update_about(accessToken,uuid,userId,about){
	return new Promise(function(resolve,reject){
		console.log('============= /users/update_about =============')
	  fetch(socketServer + '/users/update_about', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
		  	accessToken:accessToken,
		  	uuid:uuid,
		  	userId:userId,
		    about:about,
		  })
		})
		.then(function(data) {
	    	resolve(data);
	  }).catch(function(error) {
	  	ToastAndroid.show('讀寫資料時發生錯誤，請確認網路是否穩定。',ToastAndroid.SHORT);
	    resolve(false)
	    console.log("error",error)
	  })
  });
};



function update_name(accessToken,uuid,userId,name){
	return new Promise(function(resolve,reject){
		console.log('============= update_name =============')
	  fetch(socketServer + '/users/update_name', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
		  	accessToken:accessToken,
		  	uuid:uuid,
		  	userId:userId,
		    name:name,
		  })
		})
		.then(function(data) {
	    	resolve(data);
	  }).catch(function(error) {
	  	ToastAndroid.show('讀寫資料時發生錯誤，請確認網路是否穩定。',ToastAndroid.SHORT);
	    resolve(false)
	    console.log("error",error)
	  })
  });
};

function get_other_user_data(userId){
	return new Promise(function(resolve,reject){
		console.log('============= /users/get_user =============')
	  fetch(socketServer + '/users/get_user', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
		  	userId:userId,
		  })
		})
		.then(function(data) {
	    	resolve(data);
	  }).catch(function(error) {
	  	ToastAndroid.show('讀寫資料時發生錯誤，請確認網路是否穩定。',ToastAndroid.SHORT);
	    resolve(false)
	    console.log("error",error)
	  })
  });
}

function answer_question(accessToken,uuid,userId,date,answer){
	return new Promise(function(resolve,reject){
		console.log('============= answer =============')
	  fetch(socketServer + '/users/answer_question', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
		    accessToken:accessToken,
		    uuid:uuid,
		    userId:userId,
		    date:date,
		    answer:answer
		  })
		})
		.then(function(data) {
	    	resolve(data);
	  }).catch(function(error) {
	  	ToastAndroid.show('讀寫資料時發生錯誤，請確認網路是否穩定。',ToastAndroid.SHORT);
	    resolve(false)
	    console.log("error",error)
	  })
  });
}

function check_answered_latest(accessToken,uuid,userId){
	return new Promise(function(resolve,reject){
		console.log('============= check_answered_latest =============',accessToken,uuid,userId)
	  fetch(socketServer + '/users/check_answered_latest', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
		    accessToken:accessToken,
		    uuid:uuid,
		    userId:userId
		  })
		})
		.then(function(data) {
				console.log('check_answered_latest:',data);
	    	resolve(data);
	  }).catch(function(error) {
	  	ToastAndroid.show('讀寫資料時發生錯誤，請確認網路是否穩定。',ToastAndroid.SHORT);
	    resolve(false)
	    console.log("error",error)
	  })
  });
}

function users_block_user(accessToken,uuid,userId,targetId){
	return new Promise(function(resolve,reject){
		console.log('============= /users/block_user =============')
	  fetch(socketServer + '/users/block_user', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
		    accessToken:accessToken,
		    uuid:uuid,
		    userId:userId,
		    targetId:targetId,
		  })
		})
		.then(function(data) {
	    	resolve(data);
	  }).catch(function(error) {
	  	ToastAndroid.show('讀寫資料時發生錯誤，請確認網路是否穩定。',ToastAndroid.SHORT);
	    resolve(false)
	    console.log("error",error)
	  })
  });
}

function chatroom_update_target_alias(accessToken,uuid,userId,chatroomId,alias){
	return new Promise(function(resolve,reject){
		console.log('============= /chatroom/update_target_alias =============')
	  fetch(socketServer + '/chatroom/update_target_alias', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
		    accessToken:accessToken,
		    uuid:uuid,
		    userId:userId,
		    chatroomId:chatroomId,
		    alias:alias,
		  })
		})
		.then(function(data) {
				console.log('chatroom_update_target_alias=>>',data);
	    	resolve(data);
	  }).catch(function(error) {
	  	ToastAndroid.show('讀寫資料時發生錯誤，請確認網路是否穩定。',ToastAndroid.SHORT);
	    resolve(false)
	    console.log("error",error)
	  })
  });
}

function report_report_user(accessToken,uuid,userId,targetId,type,reason){
	return new Promise(function(resolve,reject){
		console.log('============= /report/report_user =============')
	  fetch(socketServer + '/report/report_user', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
		    accessToken:accessToken,
		    uuid:uuid,
		    userId:userId,
		    targetId:targetId,
		    type:type,
		    reason:reason,
		  })
		})
		.then(function(data) {
	    	resolve(data);
	  }).catch(function(error) {
	  	ToastAndroid.show('讀寫資料時發生錯誤，請確認網路是否穩定。',ToastAndroid.SHORT);
	    resolve(false)
	    console.log("error",error)
	  })
  });
}

function check_name_exists(name){
	return new Promise(function(resolve,reject){
		console.log('============= check_name_exists =============')
	  fetch(socketServer + '/users/check_name_exists', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
		    name:name
		  })
		})
		.then(function(data) {
	    	resolve(data);
	  }).catch(function(error) {
	  	ToastAndroid.show('讀寫資料時發生錯誤，請確認網路是否穩定。',ToastAndroid.SHORT);
	    resolve(false)
	    console.log("error",error)
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
  get_user_data:get_user_data,
  get_question:get_question,
  check_name_exists:check_name_exists,
  update_name:update_name,
  update_about:update_about,
  update_from_core:update_from_core,
  get_other_user_data:get_other_user_data,
  answer_question:answer_question,
  check_answered_latest:check_answered_latest,
  get_available_target:get_available_target,
  hi_say_hi:hi_say_hi,
  hi_check_hi:hi_check_hi,
  hi_get_list:hi_get_list,
  hi_response:hi_response,
  get_history_target:get_history_target,
  report_report_user:report_report_user,
  users_block_user:users_block_user,
  chatroom_update_target_alias:chatroom_update_target_alias,
  clean_storage:clean_storage,
  chatroom_leave_chatroom:chatroom_leave_chatroom,
  users_remove_chatroom:users_remove_chatroom,
  send_email_verify:send_email_verify,
  hi_get_my_list:hi_get_my_list,
  chatroom_more_message:chatroom_more_message,
  users_update_user_status:users_update_user_status,
};

if (window) window.socket = socket;

export default socket;