var express = require('express');
var app = express();
var path = require('path');
var mysql = require('mysql');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var con = mysql.createConnection({
	host: "localhost",
	user:"root",
	password:"",
	database: "PData",
});

app.use('/css',express.static('/home/tshady/MyProject/css'));
app.use('/js',express.static('/home/tshady/MyProject/js'));
app.get('/',function(req,res){
	res.sendFile(path.join('/home/tshady/MyProject/login.html'));
});
//Save data into mySQL
app.post('/bill',function(req,res){
  var cusName=req.body.cusName;
  var pdtName=req.body.pdtName;
  var quantity=req.body.quantity;
  var price=req.body.price;
  con.connect(function(err){
  	if(err) throw err;
  	  var sql = "INSERT INTO bill (customerName,productName,Quantity,Price) VALUES ('"+cusName+"','"+pdtName+"','"+quantity+"', '"+price+"')";
  	  con.query(sql, function (err) {
    if (err) throw err;
     res.send("Đã Lưu ");
     res.end();
  });
  });
});

app.listen(8080);