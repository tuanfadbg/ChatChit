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

app.use('/css',express.static('/home/tshady/CEProject/css'));
app.use('/js',express.static('/home/tshady/CEProject/js'));

app.get('/',function(req,res){
	if (session.login == true) {
res.sendFile(path.join('/home/tshady/MyProject/login.html'));
	} else {
	res.sendFile(path.join('/home/tshady/CEProject/login.html'));
}
});
//Registration
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

/*
app.post('/signin', function(request, response) {
	var username = request.body.userName;
	var password = request.body.password;
	if (username && password) {
		con.query('SELECT * FROM user WHERE userName = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.write('Signed In!!!!!' + '\n welcome back ' + username + results.length);
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
*/
app.post('/signin',function(request,response){
	var username=request.body.userName;
	var password=request.body.password;
	response.send(username +" "+password);
	var sql = "SELECT userName,password FROM user WHERE userName='root' AND password='a'";
	con.query(sql,function(err,result){
		if(err) throw err;
		if(username ==result[0].userName)
		console.log(result[0].userName);
		else
		console.log("Wrong username");
	});
});
app.listen(3000);
