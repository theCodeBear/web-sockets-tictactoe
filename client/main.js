var socket = io();

var playerPiece = '';
var username = '';

$('#usernameForm').submit(function() {
  username = $('#username').val();
  console.log(username);
  $('#usernameForm').css('display', 'none');
  $('#gameboard').css('display', 'initial');
  socket.emit('player signup', username, function(response) {
    if (!response.playable) {
      $('#userTitle').text('Viewing').css('display', 'block');
      alert(response.message);
      $('.square').off('click');
    } else {
      $('#userTitle').text(username).css('display', 'block');
      (response.player === 1) ? playerPiece = 'x' : playerPiece = 'o'
    }
  });
  return false;
});

$('.square').on('click', function(el) {
  console.log(el.target.id);
  socket.emit('player moved', {space: el.target.id, piece: playerPiece});
});

// if space is not taken then fill it with the move
socket.on('place movement', function(move) {
  if (!$('#'+move.space).text()) {
    $('#'+move.space).text(move.piece);
  }
});

socket.on('user connected', function(numOfPlayers) {
  if (numOfPlayers >= 2) {
    $('#usernameForm').css('display', 'none');
    $('#gameboard').css('display', 'initial');
    $('#userTitle').text('Viewing').css('display', 'block');
    $('.square').off('click');
  }
});
