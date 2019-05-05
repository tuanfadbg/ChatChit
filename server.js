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

var con = mysql.createConnection({
	host: "localhost",
	user:"root",
	password:"",
	database: "chat_online"
});

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use('/public',express.static(path.join(__dirname, './public')));

app.post('/registry',function(req,res){

	console.log(req.body);
  var fName=req.body.fullName;
  var pNum=req.body.phoneNumber;
  var uName=req.body.userName;
  var psw=req.body.password;
  //check if username,phoneNum is exist
  var querySQL ="SELECT userName,phoneNum FROM user WHERE userName = '"+uName+"' OR phoneNum = '"+pNum+"'";
  con.query(querySQL,function(err,result){
  	if(err) throw err;
  	console.log(result);
  	console.log(result.length);
  	if(result.length != 0 )
  	res.send(uName + " or " + pNum + " alreay exist please try again");
   	else
  	{
  		var sql = "INSERT INTO user (fullName,phoneNum,userName,password) VALUES ('"+fName+"','"+pNum+"','"+uName+"', '"+psw+"')";
  con.query(sql, function (err) {
    if (err) throw err;
    	session.login = true;
     res.end();
  });
  	}
	});
});

app.post('/signin', function(request, response) {
	var username = request.body.userName;
	var password = request.body.password;

	if (username && password) {
		con.query('SELECT * FROM user WHERE username = ? AND pass = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				request.session.user = results[0];
				user = results[0];
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

var user;
var groupChats;

var obj = {};
   
  
// app.get("/",function(req,res){
//     //res.render("trangchu")
//     res.render("login")
// });

app.get('/',function(request,response){
	if (!request.session.loggedin) {
	
		response.sendFile(path.join(__dirname, './public/login/', 'login.html'));
	} else {
		if (request.session.user) {
			user = request.session.user;
			console.log(user);
			var stringQuery = 'SELECT * FROM `member_group` JOIN group_info ' + 
			'ON member_group.groupID = group_info.groupID WHERE userID =' + user.userID+ ' OR recceiver_id =' + user.userID;

			con.query(stringQuery, function(error, result, fields) {
			groupChats = result;
	
			// xu ly chat 2 nguoi
			let userIdQuery = [] ;
			
			for (let i = 0; i< groupChats.length; i++) {
				if (groupChats[i].group_name == null || groupChats[i].group_name == '') {

				if(groupChats[i].userID == user.userID)

				userIdQuery.push(groupChats[i].recceiver_id);
				else {
					userIdQuery.push(groupChats[i].userID);
				}
				}
			}
			
			if (userIdQuery.length > 0) {
				stringQuery = 'SELECT * FROM `user` where userID in ' + convertArrayToString(userIdQuery);	
				con.query(stringQuery, function(error, results, fields) {
		
					for (let i = 0; i< groupChats.length; i++) {
						if (groupChats[i].group_name == null || groupChats[i].group_name == '') {
						if(groupChats[i].userID == user.userID) {
							for (let j = 0;j< results.length; j++) {
							if (groupChats[i].recceiver_id == results[j].userID) {
								groupChats[i].group_name = results[j].fullname;
							
							}
							}
						}
						}
					}
					obj = {groupChats: groupChats};
					response.render("trangchu", obj);
				});
			} else {
				obj = {groupChats: groupChats};
				response.render("trangchu", obj);
				}
			});

			io.on("connection",function(socket){
    
				console.log("Connected with socket id: "+ socket.id);
				
				socket.join(user.userID);
				socket.emit("current_room", user.userID);
			
				socket.on("Client_send_message",function(messageObj){
					console.log(messageObj);
				
					let stringQuery = "INSERT INTO `message` (`msgID`, `content`, `groupID`, `userID`, `type`, `time`) "
					
					+ "VALUES (NULL,'" + messageObj.message + "', '" + messageObj.currentRoom + "', '" + user.userID + "', '', '" + moment().format()+ "')";
					console.log(stringQuery);
					con.query(stringQuery, function(error, result, fields) {
						
					});
					socket.to(messageObj.currentRoom).emit("Message_sent",messageObj);
				});
			
				var room_name;
				 
				socket.on("Joinroom",function(data){
					socket.join(data);
					console.log("Joinroom");
					console.log(data);
					room_name = data;
					
					var groupID = (data + "").replace("group_", "");
					var stringQuery = 'SELECT * FROM `message` where groupID = ' + groupID;
	
					con.query(stringQuery, function(error, result, fields) {
						console.log(result);
						socket.emit("message_info", result, user.userID);
					});
					
				});
				socket.emit("groups_info",groupChats,user);
				 
			 });


		} else{
			response.sendFile(path.join(__dirname, './public/login/', 'login.html'));
		}
	}
});
// app.listen(3000);


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