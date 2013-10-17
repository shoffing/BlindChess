var app = require('express')()
	, server = require('http').createServer(app)
	, io = require('socket.io').listen(server, { log: false });

server.listen(8001);

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});


var games = [];

function init()
{
	io.sockets.on('connection', function(socket) {

		// Setup a new game
		socket.on('new', function() {
			games.push({
				player1: this
			});

			this.on('disconnect', function() {
				removeGame(this.id);
			});
		});

		// On connection to an existing game
		socket.on('conn', function(game_id) {
			for(var i = 0; i < games.length; i++)
			{
				if(games[i].player1.id == game_id)
				{
					console.log('[' + (new Date()) + '] Connected ' + games[i].player1.id + ' and ' + this.id + ' [' + games.length + ' games in session]');
					games[i].player2 = this;

					games[i].player1.emit('game-start', true); // Player 1 is white
					games[i].player2.emit('game-start', false); // Player 2 is black

					this.on('disconnect', function() {
						removeGame(this.id);
					});

					break;
				}
			}
		});

		// On a player moving a piece, route move -> other player
		socket.on('move', function(move) {
			for(var i = 0; i < games.length; i++)
			{
				if(games[i].player1 !== undefined && games[i].player1.id == this.id)
				{
					if(games[i].player2 !== undefined)
						games[i].player2.emit('other-move', move);

					break;
				} else if(games[i].player2 !== undefined && games[i].player2.id == this.id) {
					// player 2 move
					if(games[i].player1 !== undefined)
						games[i].player1.emit('other-move', move);

					break;
				}
			}
		});

	});
}

init();


function removeGame(id)
{
	for(var i = 0; i < games.length; i++)
	{
		if(games[i].player1.id == id || (games[i].player2 !== undefined && games[i].player2.id == id))
		{
			if(games[i].player2 !== undefined)
				console.log('[' + (new Date()) + '] Ended game between ' + games[i].player1.id + ' and ' + games[i].player2.id + ' [' + (games.length - 1) + ' games in session]');
			else
				console.log('[' + (new Date()) + '] Ended game with ' + games[i].player1.id + ' [' + (games.length - 1) + ' games in session]');

			games.splice(i,1);
		}
	}
}