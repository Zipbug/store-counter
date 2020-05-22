var express = require('express');
var app = express();
var http = require('http').Server(app);

var port = process.env.PORT || 3000;

app.get('/', function(req, res){res.sendFile(__dirname + '/index.html');});
app.use(express.static(__dirname + '/'));

http.listen(port, function(){
  console.log('listening on *:' + port);
});
