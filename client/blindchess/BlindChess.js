var processing;
var socket;

//

var gameStarted;

var playerNumber;
var playerNumberRecieved;

var canMove;

var board;

var holdPiece; // for rendering the piece on the cursor

var gameOver;
var winner;



function sketchProc(inProcessing)
{
	processing = inProcessing;
	
	processing.setup = function()
	{
		// Preloading images
		/* @pjs preload="blindchess/imgs/pieces/black_bishop.png,
			blindchess/imgs/pieces/black_king.png,
			blindchess/imgs/pieces/black_knight.png,
			blindchess/imgs/pieces/black_pawn.png,
			blindchess/imgs/pieces/black_queen.png,
			blindchess/imgs/pieces/black_rook.png,
			blindchess/imgs/pieces/white_bishop.png,
			blindchess/imgs/pieces/white_king.png,
			blindchess/imgs/pieces/white_knight.png,
			blindchess/imgs/pieces/white_pawn.png,
			blindchess/imgs/pieces/white_queen.png,
			blindchess/imgs/pieces/white_rook.png";
		*/

		processing.size(512, 512);
		processing.frameRate(24);

		board = new GameBoard();

		holdPiece = undefined;

		gameStarted = false;
		gameOver = false;
		winner = false;

		playerNumber = false;
		playerNumberRecieved = false;

		canMove = false;

		
		//
		// Networking stuff
		//

		// Connect to server
		socket = io.connect('http://97.107.134.245:8001');

		// On first connect to server
		socket.on('connect', function() {
			if(getParameterByName('g') == '')
			{
				// No query parameter for game, is waiting for another player
				var connectURL = window.location.href + '?g=' + socket.socket.sessionid;
				$('#info').html('Tell a friend to connect at: <br/> <b>' + connectURL + '</b>');
				socket.emit('new');
			} else {
				socket.emit('conn', getParameterByName('g'));
			}
		});

		// Called once when both players are connected
		socket.on('game-start', function(assignedPlayerNumber) {
			playerNumber = assignedPlayerNumber; // set player number to the one assigned by the server

			if(playerNumber) { // white
				canMove = true;
				$('#info').html('It is your turn.');
			} else { // black
				canMove = false;
				$('#info').html("Other player's turn...");
			}

			playerNumberRecieved = true;
			gameStarted = true;

			board.reloadBoard();
		});

		// Called when the server sends information about the ball location
		socket.on('other-move', function(move) {
			board.move(move.fromRow, move.fromCol, move.toRow, move.toCol, !playerNumber);
			canMove = true;
			$('#info').html('It is your turn.');
		});
	}
	
	processing.draw = function()
	{
		if(gameStarted)
		{
			board.render(playerNumber);
			
			// Draw hold piece
			if(holdPiece !== undefined)
			{
				processing.noStroke();
				
				// Draw rect over start tile
				processing.fill(255, 0, 0, 96);
				processing.rect(holdPiece.col * GameBoard.TILE_WIDTH, holdPiece.row * GameBoard.TILE_HEIGHT, GameBoard.TILE_WIDTH, GameBoard.TILE_HEIGHT);

				// Draw possible move rects
				processing.fill(0, 255, 0, 48);
				for(var r = 0; r < GameBoard.BOARD_ROWS; r++)
				{
					for(var c = 0; c < GameBoard.BOARD_COLS; c++)
					{
						var canMovePieceHere = board.testMove(holdPiece.row, holdPiece.col, r, c, playerNumber);
						if(canMovePieceHere)
						{
							processing.noStroke();
							processing.rect(c * GameBoard.TILE_WIDTH, r * GameBoard.TILE_HEIGHT, GameBoard.TILE_WIDTH, GameBoard.TILE_HEIGHT);

							if(board.getPieceAt(r, c) !== undefined) // Piece to capture here?
							{
								processing.stroke(255, 0, 0);
								processing.strokeWeight(6);
								processing.line(c * GameBoard.TILE_WIDTH + 0.1 * GameBoard.TILE_WIDTH, r * GameBoard.TILE_HEIGHT + 0.1 * GameBoard.TILE_HEIGHT,
									c * GameBoard.TILE_WIDTH + 0.9 * GameBoard.TILE_WIDTH, r * GameBoard.TILE_HEIGHT + 0.9 * GameBoard.TILE_HEIGHT);
								processing.line(c * GameBoard.TILE_WIDTH + 0.1 * GameBoard.TILE_WIDTH, r * GameBoard.TILE_HEIGHT + 0.9 * GameBoard.TILE_HEIGHT,
									c * GameBoard.TILE_WIDTH + 0.9 * GameBoard.TILE_WIDTH, r * GameBoard.TILE_HEIGHT + 0.1 * GameBoard.TILE_HEIGHT);
							}
						}
					}
				}


				processing.noStroke();

				// Draw hover tile rect
				processing.fill(255, 0, 0, 128);
				var hoverRow = Math.floor((processing.mouseY / processing.height) * GameBoard.BOARD_ROWS);
				var hoverCol = Math.floor((processing.mouseX / processing.width) * GameBoard.BOARD_COLS);
				processing.rect(hoverCol * GameBoard.TILE_WIDTH, hoverRow * GameBoard.TILE_HEIGHT, GameBoard.TILE_WIDTH, GameBoard.TILE_HEIGHT);

				// Render the piece on the mouse cursor
				holdPiece.renderHolding(processing.mouseX, processing.mouseY);
			}


			// Darken the screen when it's not your turn
			if(!canMove || gameOver)
			{
				processing.fill(0, 0, 0, 64);
				processing.rect(0, 0, processing.width, processing.height);
			}

			// Render gameover screen
			if(gameOver)
			{
				processing.fill(255, 0, 0);
				processing.textSize(32);
				processing.textAlign(processing.CENTER);
				processing.text((winner ? "White " : "Black ") + "player wins!", processing.width/2, processing.height/2);

				if( $('#info').html() != "Game Over." )
					$('#info').html("Game Over.");
			}
		} else {
			processing.background(0);

			processing.fill(255, 255, 255);
			processing.textSize(32);
			processing.textAlign(processing.CENTER);
			processing.text("Invite another player\n to start the game!", processing.width/2, processing.height/2);
		}
	};

	processing.mousePressed = function()
	{
		if(processing.mouseButton == processing.LEFT && canMove && !gameOver)
		{
			var clickRow = Math.floor((processing.mouseY / processing.height) * GameBoard.BOARD_ROWS);
			var clickCol = Math.floor((processing.mouseX / processing.width) * GameBoard.BOARD_COLS);

			if(board.getPieceAt(clickRow, clickCol) !== undefined && board.getPieceAt(clickRow, clickCol).player == playerNumber)
				holdPiece = board.getPieceAt(clickRow, clickCol);
		} else {
			holdPiece = undefined;
		}
	}

	processing.mouseReleased = function()
	{
		var releaseRow = Math.floor((processing.mouseY / processing.height) * GameBoard.BOARD_ROWS);
		var releaseCol = Math.floor((processing.mouseX / processing.width) * GameBoard.BOARD_COLS);

		if(holdPiece !== undefined)
		{
			var fr = holdPiece.row;
			var fc = holdPiece.col;
			var tr = releaseRow;
			var tc = releaseCol;

			if(board.move(fr, fc, tr, tc, playerNumber))
			{
				console.log("Move success!");

				socket.emit('move', {
					fromRow: fr,
					fromCol: fc,
					toRow: tr,
					toCol: tc
				});

				canMove = false;

				$('#info').html("Other player's turn...");
			} else {
				console.log("Move failed!");
			}

			holdPiece = undefined;
		}
	}

}

$(document).ready(function() {
	var canvas = document.getElementById("canvas");
	var p = new Processing(canvas, sketchProc);
});



// Get the query parameter
function getParameterByName(name)
{
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(window.location.search);
	if(results == null)
		return "";
	else
		return decodeURIComponent(results[1].replace(/\+/g, " "));
}