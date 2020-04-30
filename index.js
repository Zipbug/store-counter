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
  socket.on('join', function(room_ojb){
    var socket_room = io.sockets.adapter.rooms[room_ojb.room];

    if(socket_room){      
      if(socket_room.pass == room_ojb.password){
        socket.join(room_ojb.room);
        var total = socket_room && socket_room.roomNumber ? socket_room.roomNumber : 0;
        var max = socket_room && socket_room.maxOccupency ? socket_room.maxOccupency : 0;
        io.to(room_ojb.room).emit('join', {"total": total, "max": max, "pass": room_ojb.password});
      }else{
        socket.emit('exception', {errorMessage: 'Incorrect Password'});
      }
    }else{
      socket.join(room_ojb.room);
      socket_room = io.sockets.adapter.rooms[room_ojb.room];

      if(socket_room){
        socket_room.roomNumber = room_ojb.total ? room_ojb.total : 0;
        socket_room.maxOccupency = room_ojb.max ? room_ojb.max :  0 ;
        socket_room.pass = room_ojb.password;
      }
      io.to(room_ojb.room).emit('join', room_ojb);
    }
  });
  socket.on('change_max', function(count_obj){
    io.to(count_obj.room).emit('change_max', count_obj);
    var socket_room = io.sockets.adapter.rooms[count_obj.room];
    if(socket_room){
      socket_room.roomNumber = count_obj.total;
      socket_room.maxOccupency = count_obj.max;
    }
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
