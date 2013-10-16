var processing;

//

var playerNumber;

var board;

var holdPiece; // for rendering the piece on the cursor

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

		board = new GameBoard();

		holdPiece = undefined;

		playerNumber = true;
	}
	
	processing.draw = function()
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
	};

	processing.mousePressed = function()
	{
		if(processing.mouseButton == processing.LEFT)// && canMove)
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
				playerNumber = !playerNumber;

				$("#turn").html(playerNumber ? "White Player's Turn!" : "Black Player's Turn!");
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