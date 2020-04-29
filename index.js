var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){res.sendFile(__dirname + '/index.html');});
app.use(express.static(__dirname + '/'));

io.on('connection', function(socket){
  socket.on('count', function(count_obj){
    io.to(count_obj.room).emit('count', count_obj.total);
    var socket_room = io.sockets.adapter.rooms[count_obj.room];
    if(socket_room){
      socket_room.roomNumber = count_obj.total;
    }
  });
  socket.on('join', function(room){
    socket.join(room);
    var socket_room = io.sockets.adapter.rooms[room];
    console.log('socket', socket_room);
    var numb = socket_room && socket_room.roomNumber ? socket_room.roomNumber : 0;
    if(numb){

      io.to(room).emit('count', numb);
    }

  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
