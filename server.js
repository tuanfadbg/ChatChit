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

  	var fName=req.body.fullName;
  	var pNum=req.body.phoneNumber;
 	 var uName=req.body.userName;
  	var psw=req.body.password;
  	//check if username,phoneNum is exist
  	var querySQL ="SELECT username, phone FROM user WHERE username = '"+uName+"' OR phone = '"+pNum+"'";
  	con.query(querySQL,function(err,result){
		if(err) throw err;
		if(result.length != 0 )
			res.send(uName + " or " + pNum + " alreay exist please try again");
		else {
			var sql = "INSERT INTO user (fullname,phone,username,pass) VALUES ('"+fName+"','"+pNum+"','"+uName+"', '"+psw+"')";
			console.log(sql);
			con.query(sql, function (err) {
			if (err) throw err;
				con.query('SELECT * FROM user WHERE username = ? AND pass = ?', [uName, psw], function(error, results, fields) {
					if (results.length > 0) {
						req.session.loggedin = true;
						req.session.username = uName;
						req.session.user = results[0];
						user = results[0];
					} else {
						res.send('Incorrect Username and/or Password!');
						return;
					}			
					res.end();
				});
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

app.get('/',function(request,response){
	if (!request.session.loggedin) {
	
		response.sendFile(path.join(__dirname, './public/login/', 'login.html'));
	} else {
		if (request.session.user) {
			user = request.session.user;
			console.log(user);
			response.render("trangchu", obj);
		} else{
			response.sendFile(path.join(__dirname, './public/login/', 'login.html'));
		}
	}
});

io.on("connection",function(socket){
	
	console.log("Connected with socket id: "+ socket.id);
	if (!user)
		return; 
	// socket.user = user;
	socket.userID = user.userID;
	socket.join(socket.userID);
	socket.emit("current_room", user.userID);

	socket.on("Client_send_message",function(messageObj){
		
	
		let stringQuery = "INSERT INTO `message` (`msgID`, `content`, `groupID`, `userID`, `type`, `time`) "
		+ "VALUES (NULL,'" + messageObj.message + "', '" + messageObj.currentRoom + "', '" + socket.userID + "', '', '" + moment().format()+ "');";

		con.query(stringQuery, function(error, result, fields) {
			let stringQuery2 = "UPDATE `group_info` SET `last_message` = (SELECT msgID FROM `message` ORDER BY `message`.`msgID` DESC LIMIT 1), `updated_at` = '" + moment().format() + "' WHERE `group_info`.`groupID` = " +  messageObj.currentRoom;
			con.query(stringQuery2, function(error, result, fields) {
				
			});
		});

		socket.to("group_" + messageObj.currentRoom).emit("Message_sent",messageObj);


		///////////////////////
		var querySelectUserInGroup = "SELECT * FROM `chat_online`.`member_group` WHERE `groupID` =" + messageObj.currentRoom;
			
		con.query(querySelectUserInGroup, function(error, results, fields) {
			let userInGroup = [];
			for (let i = 0; i < results.length; i++) {
				userInGroup.push(results[i].userID);
				if (results[i].recceiver_id)
					userInGroup.push(results[i].recceiver_id);
			}
			for (let i = 0; i < userInGroup.length; i++) {
				socket.to("" + userInGroup[i]).emit("new_message",messageObj);
			}
			
			socket.to("" + messageObj.currentRoom).emit("new_message",messageObj);
			
		});
		///////////////////////
		
		console.log("messsage to " + messageObj.currentRoom + ", content " + messageObj);
	});

	var room_name;
	 
	socket.on("Joinroom",function(data){
		if (socket.currentRoom)
			socket.leave(socket.currentRoom);
		socket.join(data);
		socket.currentRoom = data;
		console.log("Joinroom" + data);
		room_name = data;
		
		var groupID = (data + "").replace("group_", "");
		var stringQuery = 'SELECT * FROM `message` where groupID = ' + groupID;

		con.query(stringQuery, function(error, result, fields) {
			// console.log(result);
			socket.emit("message_info", result, socket.userID);
		});
		
	});

	socket.on("list_friend",function(data){
		var stringQuery = 'SELECT * FROM `user` where userId != ' + socket.userID;

		con.query(stringQuery, function(error, result, fields) {
			socket.emit("list_friend", result);
		});
		
	});

	socket.on("create_chat",function(data){
		
		if (data.user.length != 0) {
			var stringQuery;
			if (data.user.length == 1) {
				stringQuery = 'INSERT INTO `group_info` (`groupID`, `group_name`, `admin`, `last_message`, `updated_at`) VALUES (NULL, "",' +  socket.userID + ' , "", "'+ moment().format() + '" );';
			} else {
				stringQuery = 'INSERT INTO `group_info` (`groupID`, `group_name`, `admin`, `last_message`, `updated_at`) VALUES (NULL, "Nhóm mới của tôi",' +  socket.userID + ' , "", "'+ moment().format() + '" );';
			}

			con.query(stringQuery, function(error, result, fields) {
				
				var stringQueryLastestGroup = 'SELECT * FROM `group_info` ORDER BY `group_info`.`groupID` DESC LIMIT 1';
				con.query(stringQueryLastestGroup, function(error, result, fields) {
				
					var groupID = result[0].groupID;
					var queryInsertToDatabase;
					if (data.user.length == 1) {
						 queryInsertToDatabase = "INSERT INTO `member_group` (`userID`, `groupID`, `recceiver_id`) VALUES (" +  socket.userID + ", " + groupID+ ", "+  data.user[0]+")";
					} else {
						 queryInsertToDatabase = "INSERT INTO `member_group` (`userID`, `groupID`) VALUES";
						queryInsertToDatabase += "(" +  socket.userID + ", " + groupID+ ")";
						for (var i = 0; i < data.user.length;i++) {
							queryInsertToDatabase += ",(" +  data.user[i]+ ", " + groupID+ ")";
						}
					}
					con.query(queryInsertToDatabase, function(error, result, fields) {
						emitGroupChatByUserID(socket);
					});
					
					if (data.user.length > 1) {
						let queryUserInGroup = "SELECT fullname FROM `user` where userID in " + convertArrayToString(data.user);
					
						con.query(queryUserInGroup, function(error, results, fields) {
							
							let name = "";
							if (data.user.length == 2) {
								name += results[0].fullname + ", " + results[1].fullname;
							} 
							if (data.user.length > 2) {
								name += results[0].fullname + ", " + results[1].fullname + " and " + (data.user.length - 2) + " others";
							} 

							let stringQuery2 = "UPDATE `group_info` SET `group_name` = '" + name+ "' WHERE `group_info`.`groupID` = " +  groupID;
							
							con.query(stringQuery2, function(error, result, fields) {
								if (error)
									throw error;
								emitGroupChatByUserID(socket);	
							});

						});
					}
				});

			});
	
		}
	});

	emitGroupChatByUserID(socket);
	 
	socket.on('disconnect', () => {
		socket.removeAllListeners();
	 });

 });

function emitGroupChatByUserID(socket) {
	let stringQuery = 'SELECT * FROM `member_group` JOIN group_info ' + 
									'ON member_group.groupID = group_info.groupID WHERE userID =' + user.userID+ ' OR recceiver_id =' + user.userID;
						
									con.query(stringQuery, function(error, result, fields) {
										let groupChats = result;
								
										// xu ly chat 2 nguoi
										let userIdQuery = [] ;
										let idLastMessage = [];
										// console.log(groupChats);
										for (let i = 0; i< groupChats.length; i++) {
											if (groupChats[i].last_message != null && groupChats[i].last_message != 0) {
												idLastMessage.push(groupChats[i].last_message);
											}
										
											if (groupChats[i].group_name == null || groupChats[i].group_name == '') {
												if(groupChats[i].userID == socket.userID)
													userIdQuery.push(groupChats[i].recceiver_id);
												else {
													userIdQuery.push(groupChats[i].userID);
												}
											}
										}
									
										
										if (userIdQuery.length > 0) {
											stringQuery = 'SELECT * FROM `user` where userID in ' + convertArrayToString(userIdQuery);	
											con.query(stringQuery, function(error, results, fields) {
												// console.log(results);
												for (let i = 0; i< groupChats.length; i++) {
													if (groupChats[i].group_name == null || groupChats[i].group_name == '') {
														let finderId;
														if(groupChats[i].userID == socket.userID)
															finderId = groupChats[i].recceiver_id;
														else {
															finderId = groupChats[i].userID;
														}
													
															for (let j = 0;j< results.length; j++) {
																if (finderId == results[j].userID || finderId == results[j].userID) {
																	groupChats[i].group_name = results[j].fullname;
																}
															}
														
													}
												}
												
												queryLastMessageAndEmitData(socket, idLastMessage, groupChats);
												
											});
										} else {
											queryLastMessageAndEmitData(socket, idLastMessage, groupChats);
										}
							
									});
}

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