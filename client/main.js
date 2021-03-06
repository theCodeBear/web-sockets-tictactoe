var socket = io();

var playerPiece = '';
var player = 0;
var username = '';
var myTurn = false;

$('#usernameForm').submit(function() {
  username = $('#username').val();
  console.log(username);
  $('#usernameForm').css('display', 'none');
  $('#gameboard').css('display', 'initial');
  socket.emit('player signup', username, function(response) {
    if (!response.playable) {
      $('#userTitle').text('Viewing').css('display', 'block');
      createGameState(response.gameboard);
      alert(response.message);
      $('.square').off('click');
    } else {
      $('#userTitle').text(username).css('display', 'block');
      createGameState(response.gameboard);
      if (response.player === 1) {
        $('.square').addClass('myTurn');
        playerPiece = 'x';
        myTurn = true;
      } else {
        playerPiece = 'o';
        $('.square').addClass('notMyTurn');
      }
      player = response.player;
    }
  });
  return false;
});

$('.square').on('click', function(el) {
  if (myTurn && !$('#'+el.target.id).text()) {
    console.log(el.target.id);
    $('#'+el.target.id).text(playerPiece);
    myTurn = false;
    $('.square').removeClass('myTurn').addClass('notMyTurn');
    socket.emit('player moved', {space: el.target.id, piece: playerPiece, player: player});
  }
});

// if space is not taken then fill it with the move
socket.on('place movement', function(move) {
  if (!$('#'+move.space).text()) {
    $('#'+move.space).text(move.piece);
    myTurn = true;
    $('.square').removeClass('notMyTurn').addClass('myTurn');
  }
});

socket.on('user connected', function(gameInfo) {
  createGameState(gameInfo.gameboard);
  if (gameInfo.numOfPlayers >= 2) {
    $('#usernameForm').css('display', 'none');
    $('#gameboard').css('display', 'initial');
    $('#userTitle').text('Viewing').css('display', 'block');
    $('.square').off('click');
  }
});

function createGameState(gameboard) {
  gameboard.forEach(function(piece, index) {
    $('#'+index).text(piece);
  });
}
