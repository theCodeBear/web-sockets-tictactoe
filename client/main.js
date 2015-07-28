var socket = io();

var player1 = 'x';
var player2 = 'o';
var currentPlayer = player1;
var username = '';

$('#usernameForm').submit(function() {
  username = $('#username').val();
  console.log(username);
  $('#usernameForm').css('display', 'none');
  $('#gameboard').css('display', 'initial');
  socket.emit('player signup', username, function(response) {
    if (!response.playable) {
      alert(response.message);
      $('.square').off('click');
      $('#userTitle').text('Viewing').css('display', 'block');
    } else {
      $('#userTitle').text(username).css('display', 'block');
    }
  });
  return false;
});

$('.square').on('click', function(el) {
  console.log(el.target.id);
  socket.emit('player moved', el.target.id);
});

socket.on('place movement', function(id) {
  $('#'+id).text(currentPlayer);
  (currentPlayer === player1) ? currentPlayer = player2 : currentPlayer = player1;
});

socket.on('user connected', function(numOfPlayers) {
  console.log(numOfPlayers);
  if (numOfPlayers >= 2) {
    $('#usernameForm').css('display', 'none');
    $('#gameboard').css('display', 'initial');
    $('#userTitle').text('Viewing').css('display', 'block');
    $('.square').off('click');
  }
});
