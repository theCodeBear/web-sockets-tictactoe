var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + './../client'));

io.on('connection', function(socket) {
  socket.emit('user connected');
  console.log('user connected');

  socket.on('player moved', function(id) {
    console.log('player touched square', id);
    io.emit('place movement', id);
  });
});

http.listen(3333, function() {
  console.log('serving on port 3333');
});
