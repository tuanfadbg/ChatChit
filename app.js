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
server.listen(3001);

var con = mysql.createConnection({
  host: "localhost",
  user:"root",
	password:"",
	database: "chatchit"
});

var user;

var groupChats;


io.on("connection",function(socket){
    
    console.log("Connected with socket id: "+ socket.id);
    
    socket.on("Client_send_message",function(data){
        console.log("tin nhan da duoc gui len" + data);
        socket.to(room_name).emit("Message_sent",data);
    });

    var room_name = socket.request.headers.referer; // link of page, where user connected to socket
    
     //connecting to room
    socket.on("Joinroom",function(data){
        socket.join(data);
        console.log(data);
        room_name = data;
    });
     
 });
   

app.get("/",function(req,res){
    //res.render("trangchu")
    res.render("login")
});


//Registration
app.post('/registry',function(req,res){

  var fullName=req.body.fullName;
  var phoneNum=req.body.phoneNumber;
  var userName=req.body.userName;
  var password=req.body.password;
  
//   res.write('Registration successed!.\n');
//   res.write('You sent the fullName "' + req.body.fullName+'".\n');
//   res.write('You sent the phoneNumber"' + req.body.phoneNumber+'".\n');
//   res.write('You sent the userName "' + req.body.userName+'".\n');
//   res.write('You sent the password "' + req.body.password+'".\n');

  
  con.connect(function(err){
  if(err) throw err;
  var sql = "INSERT INTO user (fullname,phone,username,pass) VALUES ('"+fullName+"','"+phoneNum+"','"+userName+"', '"+password+"')";
  con.query(sql, function (err) {
    if (err) throw function() {
        res.render("login");
    };
    
    //res.render("trangchu");
    res.end();
  });
});

});
//Login
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.post('/signin', function(request, response) {
	var username = request.body.userName;
	var password = request.body.password;
	if (username && password) {
		con.query('SELECT * FROM user WHERE username ="'+username+'" AND pass ="'+password+'"', function(error, results, fields) {
      
      if (results.length>0) {
				request.session.loggedin = true;
        user = results[0];
        
        // console.log(user);

        var stringQuery = 'SELECT * FROM `member_group` JOIN group_info ' + 
        'ON member_group.groupID = group_info.groupID WHERE userID =' + user.userID+ ' OR recceiver_id =' + user.userID;

        // console.log(stringQuery);
        con.query(stringQuery, function(error, results, fields) {
          console.log("1");
          
      
          groupChats = results;
          
          console.log(groupChats);
          // xu ly chat 2 nguoi
          // let userIdQuery = [] ;
        
          // for (let i = 0; i< groupChats.length; i++) {
          //   if (groupChats[i].group_name == null || groupChats[i].group_name == '') {

          //     if(groupChats[i].userID == user.userID)

          //     userIdQuery.push(groupChats[i].recceiver_id);
          //     else {
          //       userIdQuery.push(groupChats[i].userID);
          //     }
          //   }
          // }

          //stringQuery = 'SELECT * FROM `user` where userID in ' + convertArrayToString(userIdQuery);

        // console.log(stringQuery);
        // con.query(stringQuery, function(error, results, fields) {
        //   // console.log(results);
        //   for (let i = 0; i< groupChats.length; i++) {
        //     if (groupChats[i].group_name == null || groupChats[i].group_name == '') {
        //       if(groupChats[i].userID == user.userID) {
        //         for (let j = 0;j< results.length; j++) {
        //           if (groupChats[i].recceiver_id == results[j].userID) {
        //             groupChats[i].group_name = results[j].fullname;
        //             // results.pop(j);
        //             // j--;
        //           }
        //         }
        //       }
        //     }
        //   }
        // });

        //console.log(groupChats);
        });
        console.log(groupChats);
				response.render("trangchu");
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
      response.end();
      
    // });
  });
	} else {
		response.send('Please enter Username and Password!');
		response.end();
  }
  //res.render("trangchu");
});

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

