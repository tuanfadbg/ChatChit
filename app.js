var express = require("express");
	// test router
	// var router = express.Router();
var app = express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.set("views","./views");

var server = require("http").Server(app);
server.listen(3001);
// var things = require('./things.js');
// app.use('/things',things);
// app.listen(8080);

app.get("/", function(req, res){
	let data = [
		{
			user: 'tuan'
		},
		{
			user: 'tuan'
		},
		{
			user: 'tuan'
		},
		{
			user: 'tuan'
		},
		{
			user: 'tuan'
		},
		{
			user: 'tuan'
		}
	];
	app.locals.data=data;
	res.render('trangchu',);
	//res.render("footer");

});
// app.get("/things", function(req, res){
// 	res.render('login');
// });