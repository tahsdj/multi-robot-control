var io = require("socket.io");       //    引
var express = require("express");   //     用
var app = express();               //      需
app.use(express.static('robot')); //       要
var fs = require('fs');          //        模組
 
var server = app.listen(5438, function(req, res) {
  console.log("網站伺服器在5438埠口開工了！");
  app.get('/', function(req, res) {
    fs.readFile(__dirname + '/robotchat.html', 'utf8', function(err, text){   // 開啟聊天網頁頁面
        res.send(text);
    });
  });
}); 
 
var io = io(server);
 
io.on('connection', function(socket){
  console.log("Connected");
 
  // 接收'connection'事件訊息
     socket.on('arduino', function (data) {
	   socket.username = data.msg;	 
　　   console.log(data.msg+" "+"connect");
       io.emit('guest add', socket.username ); //客戶端上線
    });
    socket.on('new guest', function(msg){
      socket.username = msg;	 
	  console.log(msg+" "+"connect");
	  io.emit('guest add', socket.username);
    });
  
     socket.on('disconnect', function(){
	   console.log(socket.username+" "+"disconnect"); 
	   socket.broadcast.emit('guest left', socket.username); //客戶端離線
    });
	 socket.on('chat',function(msg){
	   console.log(socket.username +":"+msg);  //客戶端傳送訊息
	   socket.broadcast.emit('chat',{ username : socket.username,   //客戶名稱
                                      msg  : msg                    //訊息內容
	   });
	 });
	 socket.on('arduinoChat',function(data){
	   console.log(socket.username +":"+data.msg);
	   socket.broadcast.emit('chat',{ username : socket.username,
                                      msg  : data.msg
	   });
	 });
 
  // 接收'atime'事件訊息
  socket.on('atime', function (data) {
　　console.log('來自Arduino的訊息：' + data.msg);
  });
});