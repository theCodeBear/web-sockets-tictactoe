var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + './../client'));

var numOfPlayers = 0;
var gameboard = new Array(9);

io.on('connection', function(socket) {
  socket.emit('user connected', {numOfPlayers: numOfPlayers, gameboard: gameboard});
  console.log('user connected', numOfPlayers);

  socket.on('player signup', function(username, cb) {
    if (numOfPlayers++ >= 2) {
      numOfPlayers--;
      cb({
        message: 'Sorry, both player slots have been filled already.',
        gameboard: gameboard,
        playable: false
      });
    } else {
      cb({
        message: 'Hi ' + username + '! You have signed up as player ' + numOfPlayers,
        player: numOfPlayers,
        gameboard: gameboard,
        playable: true
      });
    }
    console.log(username, 'signed up');
    cb('you signed up as ' + username);
  });

  socket.on('player moved', function(move) {
    gameboard[move.space] = move.piece;
    socket.broadcast.emit('place movement', move);
  });
});

http.listen(3333, function() {
  console.log('serving on port 3333');
});
