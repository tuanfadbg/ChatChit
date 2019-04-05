var express = require("express");
var app = express();
app.use(express.static("./public"));
app.set("view engine","ejs");
app.set("views","./views");
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

var mangUser = [];




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
    res.render("trangchu")
});