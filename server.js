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

// local database
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)


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
	request.session.img = "img" + getRandomInt(7);
	db.update('count_user', n => n + 1)
	.write();
	response.send('success');
	response.end();
});

app.post('/logout', function(request, response) {
	request.session.destroy();
	response.send('success');
	response.end();
});


var user;
var obj = {};
var dataRoom = [];
app.get('/',function(request, response){
	db.defaults({ count_message: 0, count_user:0})
  	.write()
	console.log(request.session);
	if (request.session.room != null && request.session.name != null) {
		user = {name: request.session.name, room: request.session.room, img: request.session.img };
		response.render("homepage", obj);
	} else {
		response.render("login", obj);
	}
});

app.get('/r/:room',function(request, response){
	var room = request.params.room;
	if (request.session.room != null && request.session.name != null) {
		user = {name: request.session.name, room: room, img: request.session.img};
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

	if (dataRoom[socket.user.room] == null || dataRoom[socket.user.room].length == 0) {

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
		db.update('count_message', n => n + 1)
		  .write();
		  
		var dataNewMessage = socket.user;
		dataNewMessage.message = newMessage.message;
		socket.to(socket.user.room).emit('NewMessage', {dataNewMessage});
	});

	socket.on("UpdateStatus", function(newMessage) {
		for (let i = 0; i < dataRoom[socket.user.room].length; i++) {
			if (dataRoom[socket.user.room][i].name == socket.user.name) {
				dataRoom[socket.user.room][i].status = newMessage.message;
				break;
			}
		}
		io.in(socket.user.room).emit("Member", dataRoom[socket.user.room]);
	});

	socket.on("Logout", function(newMessage) {
		logout();
		console.log("Logout");
	});

	socket.on('disconnect', () => {
		logout();
		socket.removeAllListeners();
	 });

	 function logout() {
		for (let i = 0; i < dataRoom[socket.user.room].length; i++) {
			if (dataRoom[socket.user.room][i].name == socket.user.name) {
				dataRoom[socket.user.room].splice(i, 1);
				break;
			}
		}
		socket.to(socket.user.room).emit('Member', dataRoom[socket.user.room]);
	 }
 });

 function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
  }

// // Set some defaults (required if your JSON file is empty)
// db.defaults({ posts: [], user: {}, count: 0 })
//   .write()

// // Add a post
// db.get('posts')
//   .push({ id: 1, title: 'lowdb is awesome'})
//   .write()

// // Set a user using Lodash shorthand syntax
// db.set('user.name', 'typicode')
//   .write()
  
// // Increment count
// db.update('count', n => n + 1)
//   .write()