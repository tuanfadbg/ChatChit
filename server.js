var express = require('express');
var app = express();
var path = require('path');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var session = require('express-session');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var con = mysql.createConnection({
	host: "localhost",
	user:"root",
	password:"",
	database: "login"
});
/*
con.connect(function(err){
	if(err) throw err;
	console.log('connected');
	var sql ="insert into user (userName,password) values ('tshady','overwatch')";
	con.query(sql,function(err,result){
		if(err) throw err;
		console.log('1 record inserted');
	});
});
*/
app.use('/css',express.static('/home/tshady/CEProject/css'));
app.use('/js',express.static('/home/tshady/CEProject/js'));

app.get('/',function(req,res){
	res.sendFile(path.join('/home/tshady/CEProject/login.html'));
});
//Registration
app.post('/registry',function(req,res){
  var fullName=req.body.fullName;
  var phoneNum=req.body.phoneNumber;
  var userName=req.body.userName;
  var password=req.body.password;

  res.write('Registration successed!.\n');
  res.write('You sent the fullName "' + req.body.fullName+'".\n');
  res.write('You sent the phoneNumber"' + req.body.phoneNumber+'".\n');
  res.write('You sent the userName "' + req.body.userName+'".\n');
  res.write('You sent the password "' + req.body.password+'".\n');

  con.connect(function(err) {
  if (err) throw err;
  var sql = "INSERT INTO user (fullName,phoneNum,userName,password) VALUES ('"+fullName+"','"+phoneNum+"','"+userName+"', '"+password+"')";
  con.query(sql, function (err) {
    if (err) throw err;
    console.log("1 record inserted");
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
		con.query('SELECT * FROM user WHERE userName = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.write('Signed In!!!!!' + '\n welcome back ' + username);
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


app.listen(3000);
