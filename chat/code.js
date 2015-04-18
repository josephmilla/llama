var user = "a";
var to   = "b";

function callUrl(url, async, fn) {
	// console.log(url);
	if (async != false) {
		async = true;
	}
	var req = new XMLHttpRequest();
    req.open("GET", url, async);
	if (arguments.length == 3) {
		req.onreadystatechange = function () {
			if (req.readyState == 4) {
				fn(req.responseText);
			}
		}
	}
	try {
		req.send();
	}
	catch(e) {}
}

var api = {
	url : "http://45.55.134.228:4000/",
	send : function(msg, to) {
		var uri = this.url + "send/" + user + "/" + to + "/" + msg;
		callUrl(uri, true, function(){});
	},
	get : function() {
		var uri = this.url + "get/" + user;
		callUrl(uri, true, getMessageHandler);
	},
}

function sendMessageApi() {
	console.log("hello");
	var input = document.getElementById("input");
	var value = input.value;
	api.send(value, to);
	input.value = "";
	createChatListItem("Mama Llama", "images/bengal.jpg", value, new Date().getTime());
}

function getMessageApi() {
	var milliseconds = 1000;
	console.log("hello");
	window.setInterval(function() {
		api.get();
	}, milliseconds);
}

function getMessageHandler(res) {
	console.log(res);
	var json = JSON.parse(res);
	for (var i=0; i<json.length; i++) {
		var el = json[i];
		createChatListItem("Llama Slama", "images/abyssinian.jpg", el.msg, el.time);
	}
}

function checkKey(event) {
	console.log(event);
}

function createChatListItem(user, avatar, text, timestamp) {
	var html = '<x-chat-list color="{{message.color}}" avatar="' + avatar + '" username="' + user + '" text="' + text + '"  status="{{message.status}}"' + 'timestamp="' + timestamp + '">';
	var obj = document.createElement('object');
	document.getElementsByClassName('chat-list')[0].appendChild(obj);
	obj.outerHTML = html;
	return obj;
}

getMessageApi();
