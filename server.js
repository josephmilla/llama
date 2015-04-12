'use strict';
var express = require('express');
var app  = express();
var port = 4000;
// var request = require('request');
// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
//var fs      = require('fs');
//var vm      = require('vm');
//include("./dataStructures.js");

var usersLang = {};
var usersHist = {};
var messageHist = {};
var messageList = {};
var messageUnseen = {};

/* Message */
var Message = function (username, from, msg) {
    this.username = username;
    this.from     = from;
    this.msg      = msg;
    this.time     = new Date().getTime();
};

function addMessage(msg) {
	var user = msg.username;
	var from = msg.from;
	if (!messageList[user]) {
		messageList[user] = [];
	}
	messageList[user].push(msg);

	if (!usersHist[user]) {
		usersHist[user] = [];
	}
	usersHist[user].push(msg);
	if (!usersHist[from]) {
		usersHist[from] = [];
	}
	usersHist[from].push(msg);


	if (!messageHist[user]) {
		messageHist[user] = {};
	}
	if (!messageHist[user][from]) {
		messageHist[user][from] = [];
	}
	messageHist[user][from].push(msg);
	if (!messageHist[from]) {
		messageHist[from] = {};
	}
	if (!messageHist[from][user]) {
		messageHist[from][user] = [];
	}
	messageHist[from][user].push(msg);
}

function getMessages(username) {
	var list = messageList[username];
	if (list) {
//			send(list);
//		for (var i=0; i<messageList.length; i++) {
			// TODO: Finish sending
//		}
		delete messageList[username];
		return list;
	}
}

/* UserList */
var UserList = function () {
	this.users = {};
}

/* User */
var User = function (username, from, to) {
    this.username = username;
    this.from = from || "en-US";
    this.to   = to   || "zh-CN";
};

/* UserList */
var UserList = function () {
	this.users = {};
}

UserList.prototype.addUser = function(username, from, to) {
	var exists = this.has(username);
	if (!exists) {
		var user = new User(username, from, to);
		this.users[username] = user;
		var key = langKey(from, to);
		if (!usersLang[key]) {
			usersLang[key] = [];
		}
		usersLang[key].push(user);
		console.log("Registered: " + username);
	}
	return !exists;
}

UserList.prototype.randomUser = function(username) {
	var has = this.has(username);
	if (has) {
		var user = this.get(username);
		var from = user.from;
		var to   = user.to;
		var key  = langKey(to, from);
		var list = usersLang[key];
		var pos  = Math.floor(Math.random() * list.length);
		var res  = list[pos];
		console.log("Chose: " + res.username);
		return res.username;
	}
}

UserList.prototype.has = function(username) {
	return this.users[username] !== undefined;
}

UserList.prototype.get = function(username) {
	return this.users[username];
}

function userCount(from, to) {
	var key  = langKey(from, to);
	var list = usersLang[key];
	if (list) {
		return list.length;
	}
	return 0;
}

function langKey(from, to) {
	return from + "_" + to;
}

function randomUser(username) {
	return userList.randomUser(username);
}

/* Register User */
function registerUser(username, from, to) {
	return userList.addUser(username, from, to);
}

function sendMessage(msg, from, to) {
	if (msg && userList.has(from) && userList.has(to)) {
		var userFrom = userList.get(from);
		var userTo   = userList.get(to);
		var message = new Message(userTo.username, userFrom.username, msg);
		addMessage(message);
	}
}

var userList = new UserList();
function init() {
    registerUser("a", "en-US", "zh-CN");
    registerUser("b", "zh-CN", "en-US");
    registerUser("c", "zh-CN", "en-US");
    registerUser("d", "zh-CN", "en-US");
    registerUser("e", "zh-CN", "en-US");
	sendMessage("Hey", "a", "b");
	sendMessage("Yo", "a", "b");
	sendMessage("I like you", "b", "a");
	sendMessage("asds", "c", "a");
}
init();

app.get('/send/:from/:to/:msg', function(req, res) {
	res.set("Connection", "close");
	res.end();
	var msg  = req.params.msg;
	var from = req.params.from;
	var to   = req.params.to;
	console.log("Sent " + msg + " from " + from + " to " + to);
	sendMessage(msg, from, to);
});

// 104.236.28.245:4730/register/aaa
app.get('/register/:user/:from/:to', function(req, res) {
    res.type('application/json');
	var user = req.params.user;
	var from = req.params.from || "en-US";
	var to   = req.params.to   || "zh-CN";
	if (!user || !registerUser(user, from, to)) {
		res.send({status:"failed"});
	}
	else {
		console.log("Registered: " + user);
		res.send({status:"success"});
	}
});

// 104.236.28.245:4730/get/Gibolt
app.get('/get/:user', function(req, res) {
    res.type('application/json');
	var user = req.params.user;
	var msgs = getMessages(user) || [];
	console.log(msgs);
	res.send(msgs);
});

app.get('/random/:user', function(req, res) {
    res.type('application/json');
	var user = req.params.user;
	var random = randomUser(user);
	if (random) {
		res.send({user:random});
	}
	else {
		console.log("No user: ");
		res.send({status:"failed"});
	}
});

app.get('/count/:from/:to', function(req, res) {
    res.type('application/json');
	var from  = req.params.from;
	var to    = req.params.to;
	var count = userCount(from, to);
	res.send({user:count});
});

app.get('/hist/:user', function(req, res) {
    res.type('application/json');
	var user = req.params.user;
	var list = messageHist[user] || [];
	var text = JSON.stringify(list);
	res.send(text);
});

app.get('/hist/:user/:from', function(req, res) {
    res.type('application/json');
	var user = req.params.user;
	var list = messageHist[user] || [];
	var text = JSON.stringify(list);
	res.send(text);
});

console.log("Connecting to port: " + port);
app.listen(process.env.PORT || port, '0.0.0.0');
