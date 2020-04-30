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
    if(socket_room && socket_room.pass == room_ojb.password){
      socket.join(room_ojb.room);
      var total = socket_room && socket_room.roomNumber ? socket_room.roomNumber : 0;
      var max = socket_room && socket_room.maxOccupency ? socket_room.maxOccupency : 0;
      io.to(room_ojb.room).emit('join', {"total": total, "max": max, "pass": room_ojb.password});
    }else{
      if(socket_room == undefined){
        socket.emit('exception', {errorMessage: "Room No Loonger exists"});
      }else{
        socket.emit('exception', {errorMessage: 'Incorrect Password', "entered":  room_ojb.password, "correct": socket_room.pass});
      }
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

  socket.on('create', function(room_ojb){
    socket.join(room_ojb.room);
    var socket_room = io.sockets.adapter.rooms[room_ojb.room];

    if(socket_room){
      socket_room.roomNumber = room_ojb.total;
      socket_room.maxOccupency = room_ojb.max;
      socket_room.pass = room_ojb.password;
    }
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
