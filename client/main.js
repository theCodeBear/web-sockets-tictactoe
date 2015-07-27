var socket = io();

var player1 = 'x';
var player2 = 'o';
var currentPlayer = player1;

$('.square').on('click', function(el) {
  console.log(el.target.id);
  socket.emit('player moved', el.target.id);
});

socket.on('place movement', function(id) {
  $('#'+id).text(currentPlayer);
  console.log('put place at', id);
  (currentPlayer === player1) ? currentPlayer = player2 : currentPlayer = player1;
});