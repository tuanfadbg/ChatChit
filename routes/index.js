var express = require('express');
var router = express.Router();

// var mysql = require('mysql')
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : '',
//   database : 'chat_online'
// });

var name = "Tuan";
// connection.connect()

// connection.query('SELECT * from user', function (err, rows, fields) {
//   name = rows[0].name;
// })
// connection.end()


router.get('/', function(req, res, next) {
  res.render('index', { title: `Express chao moi nguoi${name}`, des: name });
});


module.exports = router;
