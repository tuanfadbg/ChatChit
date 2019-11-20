var express = require("express");
var app = express();
var path = require('path');
var mysql = require('mysql');
app.use(express.static("./public"));
app.set("view engine","ejs");
app.set("views","./views");
var server = require("http").Server(app);
var io = require("socket.io")(server);
var session = require('express-session');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
server.listen(3000);
var moment = require('moment');
var clients = {};

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use('/public',express.static(path.join(__dirname, './public')));

app.post('/login', function(request, response) {
	var room = request.body.room;
	var name = request.body.name;
	
	request.session.room = room;
	request.session.name = name;

	response.send('success');
	response.end();
});

var user;
var obj = {};
var dataRoom = [];
app.get('/',function(request, response){
	console.log(request.session);
	if (request.session.room != null && request.session.name != null) {
		user = {name: request.session.name, room: request.session.room};
		response.render("homepage", obj);
	} else {
		response.render("login", obj);
	}
});

app.get('/r/:room',function(request, response){
	var room = request.params.room;
	if (request.session.room != null && request.session.name != null) {
		user = {name: request.session.name, room: room};
		response.render("homepage", obj);
	} else {
		response.render("login", obj);
	}
});

var user;

io.on("connection",function(socket){
	if (user == null)
		return;
	socket.user = user;
	console.log("Connected with socket user: ")
	console.log(socket.user);

	socket.join(socket.user.room);

	if (dataRoom[socket.user.room] == null) {
		dataRoom[socket.user.room] = [socket.user];
	} else {
		for (let i = 0; i < dataRoom[socket.user.room].length; i++) {
			if (dataRoom[socket.user.room][i].name == socket.user.name) {
				dataRoom[socket.user.room].splice(i, 1);
				break;
			}
		}
			dataRoom[socket.user.room].push(socket.user);
	}

	io.in(socket.user.room).emit("NewMember", socket.user);
	io.in(socket.user.room).emit("Member", dataRoom[socket.user.room]);

	socket.on("NewMessage", function(newMessage) {
		socket.to(socket.user.room).emit('NewMessage', {message: newMessage.message});
	});
	// socket.on("Client_send_message",function(messageObj){

	// 	socket.to(messageObj.currentRoom).emit("Message_sent",messageObj);
	// 	console.log("messsage to " + messageObj.currentRoom + ", content " + messageObj);
	// });
	

	// socket.on("list_friend",function(data){
	// 	var stringQuery = 'SELECT * FROM `user` where userId != ' + socket.userID;

	// 	con.query(stringQuery, function(error, result, fields) {
	// 		socket.emit("list_friend", result);
	// 	});
		
	// });

	socket.on('disconnect', () => {
		socket.removeAllListeners();
	 });

 });

function queryLastMessageAndEmitData(socket, idLastMessage, groupChats) {
	if (idLastMessage.length > 0) {
		let queryLastMessage = 'SELECT * FROM `message` where msgID in ' + convertArrayToString(idLastMessage);	
		// console.log(queryLastMessage);

		con.query(queryLastMessage, function(error, results, fields) {
			// console.log(results);
			for (let i = 0; i < groupChats.length; i++) {
				if (groupChats[i].last_message_string == null)
				console.log(groupChats[i]);
					for (let j = 0; j < results.length; j++) {
						if (results[j].msgID == groupChats[i].last_message) {
							groupChats[i].last_message_string = results[j].content;
							break;
						}
					}
			}
			console.log(groupChats);
			socket.emit("groups_info", groupChats);
		});
	} else {
		socket.emit("groups_info", groupChats);
	}
}

function convertArrayToString(arr) {
  
	let result = "(";
	for (let i = 0; i < arr.length; i++) {
	  if (i == arr.length - 1)
	  result += arr[i];
	  else
	  result += arr[i] + ",";
	}
	result += ")";
  return result;
  }