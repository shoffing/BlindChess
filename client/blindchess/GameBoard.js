function GameBoard()
{
	//--------------------
	// "STATIC" VARIABLES
	//--------------------
	if(GameBoard.BOARD_ROWS === undefined)
	{
		GameBoard.BOARD_ROWS = 8;
		GameBoard.BOARD_COLS = 8;

		GameBoard.TILE_WIDTH = 64;
		GameBoard.TILE_HEIGHT = 64;

		GameBoard.FOG_RES = 16; // per tile
	}

	this.board = [];
	for(var i = 0; i < GameBoard.BOARD_ROWS; i++)
		this.board[i] = [];

	this.fogOfWar = new FogOfWar(GameBoard.BOARD_COLS * GameBoard.FOG_RES, GameBoard.BOARD_ROWS * GameBoard.FOG_RES);

	this.prevBoardStr = "";
	this.boardImage = processing.createImage(GameBoard.BOARD_COLS * GameBoard.TILE_WIDTH, GameBoard.BOARD_ROWS * GameBoard.TILE_HEIGHT, processing.RGB);


	//--------------------
	// Set up the board
	//--------------------

	// pawns
	for(var i = 0; i < GameBoard.BOARD_COLS; i++)
	{
		this.board[1][i] = new PiecePawn(1, i, false);
		this.board[6][i] = new PiecePawn(6, i, true);
	}

	// rooks
	this.board[0][0] = new PieceRook(0, 0, false);
	this.board[0][7] = new PieceRook(0, 7, false);
	this.board[7][0] = new PieceRook(7, 0, true);
	this.board[7][7] = new PieceRook(7, 7, true);

	// knights
	this.board[0][1] = new PieceKnight(0, 1, false);
	this.board[0][6] = new PieceKnight(0, 6, false);
	this.board[7][1] = new PieceKnight(7, 1, true);
	this.board[7][6] = new PieceKnight(7, 6, true);

	// bishops
	this.board[0][2] = new PieceBishop(0, 2, false);
	this.board[0][5] = new PieceBishop(0, 5, false);
	this.board[7][2] = new PieceBishop(7, 2, true);
	this.board[7][5] = new PieceBishop(7, 5, true);

	// queens
	this.board[0][3] = new PieceQueen(0, 3, false);
	this.board[7][3] = new PieceQueen(7, 3, true);

	// kings
	this.board[0][4] = new PieceKing(0, 4, false);
	this.board[7][4] = new PieceKing(7, 4, true);
}


//--------------------
// METHODS
//--------------------

GameBoard.prototype.move = function(fromRow, fromCol, toRow, toCol, playerNum)
{
	// Logic for a move succeeding:
	//	-A piece exists at the space you want to move from (NULL TO B4. CHECKMATE!)
	//	-Move is in bounds (on the board)
	//	-Move isn't to the same tile, as that would be silly
	//	-Move isn't on top of a friendly piece (for castling I might have to change this,
	//	 but that's for another day)
	//	-If the piece should collide, there is no piece in the way
	//	-The piece says the move is valid (piece movement rules)

	var inBounds =
		fromRow >= 0 && fromRow < GameBoard.BOARD_ROWS && 
		fromCol >= 0 && fromCol < GameBoard.BOARD_COLS &&
		toRow >= 0 && toRow < GameBoard.BOARD_ROWS && 
		toCol >= 0 && toCol < GameBoard.BOARD_COLS;

	var notSameTile = !(fromRow == toRow && fromCol == toCol);
	var notSamePlayer = (this.board[toRow][toCol] !== undefined) ? (this.board[toRow][toCol].player != playerNum) : true;

	if(notSameTile && notSamePlayer && inBounds && this.board[fromRow][fromCol] !== undefined)
	{
		if(this.checkCollision(fromRow, fromCol, toRow, toCol))
		{
			if(this.board[fromRow][fromCol].move( toRow, toCol, this.board[toRow][toCol] !== undefined ))
			{
				this.board[toRow][toCol] = this.board[fromRow][fromCol];
				this.board[fromRow][fromCol] = undefined;

				return true;
			}
		}
	}

	return false;
}

GameBoard.prototype.testMove = function(fromRow, fromCol, toRow, toCol, playerNum)
{
	var inBounds =
		fromRow >= 0 && fromRow < GameBoard.BOARD_ROWS && 
		fromCol >= 0 && fromCol < GameBoard.BOARD_COLS &&
		toRow >= 0 && toRow < GameBoard.BOARD_ROWS && 
		toCol >= 0 && toCol < GameBoard.BOARD_COLS;

	var notSameTile = !(fromRow == toRow && fromCol == toCol);
	var notSamePlayer = (this.board[toRow][toCol] !== undefined) ? (this.board[toRow][toCol].player != playerNum) : true;

	if(notSameTile && notSamePlayer && inBounds && this.board[fromRow][fromCol] !== undefined)
		if(this.checkCollision(fromRow, fromCol, toRow, toCol))
			if(this.board[fromRow][fromCol].testMove( toRow, toCol, this.board[toRow][toCol] !== undefined ))
				return true;
	
	return false;
}

GameBoard.prototype.checkCollision = function(fromRow, fromCol, toRow, toCol)
{
	// check collisions with basic "raytracing"

	var success = true;

	if(this.board[fromRow][fromCol].shouldCollide)
	{
		// Get the delta vector
		var deltaRow = toRow - fromRow;
		var deltaCol = toCol - fromCol;

		// Returns either (-1, 0, 1) because we're only working with 45 degree angles
		deltaRow = deltaRow != 0 ? deltaRow / Math.abs(deltaRow) : 0;
		deltaCol = deltaCol != 0 ? deltaCol / Math.abs(deltaCol) : 0;

		var curRow = fromRow;
		var curCol = fromCol;

		var isStillOnBoard;

		do
		{
			curRow += deltaRow;
			curCol += deltaCol;

			isStillOnBoard = curRow >= 0 && curRow < GameBoard.BOARD_ROWS && curCol >= 0 && curCol < GameBoard.BOARD_COLS;
		} while(isStillOnBoard && !(curRow == toRow && curCol == toCol) && this.board[curRow][curCol] === undefined );

		// If we hit a piece along the way and that piece is not at the target location, move fails
		if(!isStillOnBoard || !(curRow == toRow && curCol == toCol) && this.board[curRow][curCol] !== undefined)
			success = false;
	}

	return success;
}

GameBoard.prototype.render = function(player)
{
	if(player !== undefined)
	{

		if(!(this.toString() == this.prevBoardStr)) // board has changed, need to re-render
		{
			var myPieces = [];

			// Draw board and pieces
			processing.noStroke();
			for(var r = 0; r < GameBoard.BOARD_ROWS; r++)
			{
				for(var c = 0; c < GameBoard.BOARD_COLS; c++)
				{
					// Draw board tiles
					processing.fill((r + c) % 2 == 0 ? 255 : 64);
					processing.rect(c * GameBoard.TILE_WIDTH, r * GameBoard.TILE_HEIGHT, GameBoard.TILE_WIDTH, GameBoard.TILE_HEIGHT);

					// Draw pieces
					if(this.board[r][c] !== undefined)
					{
						this.board[r][c].render();

						// If this is my piece, push it to the array of my pieces for vision calculation
						if(this.board[r][c].player == player)
						{
							myPieces.push(this.board[r][c]);
						}
					}
				}
			}


			//=================
			// FOG OF WAR
			//=================

			var pieceVisions = [];
			for(var i = 0; i < myPieces.length; i++)
			{
				pieceVisions.push({
					x: myPieces[i].col * GameBoard.FOG_RES + 0.5 * GameBoard.FOG_RES,
					y: myPieces[i].row * GameBoard.FOG_RES + 0.5 * GameBoard.FOG_RES,
					radius: myPieces[i].visionRadius * GameBoard.FOG_RES
				});
			}

			var fog = this.fogOfWar.update(pieceVisions);

			processing.noStroke();
			processing.rectMode(processing.CORNER);

			var fogSizeX = GameBoard.TILE_WIDTH / GameBoard.FOG_RES;
			var fogSizeY = GameBoard.TILE_HEIGHT / GameBoard.FOG_RES;
			for(var x = 0; x < fog.length; x++)
			{
				for(var y = 0; y < fog[0].length; y++)
				{
					processing.fill(0, 0, 0, 255 * Math.pow(fog[x][y], 2)); // Falloff = x^2
					processing.rect(x * fogSizeX, y * fogSizeY, fogSizeX, fogSizeY);
				}
			}


			// Update board image
			processing.loadPixels();
			this.boardImage.pixels.set(processing.pixels.toArray());
			this.boardImage.updatePixels();

			this.prevBoardStr = this.toString();
		}
		
		processing.imageMode(processing.CORNER);
		processing.image(this.boardImage, 0, 0);

	} else {

		// Draw board and pieces
		processing.noStroke();
		for(var r = 0; r < GameBoard.BOARD_ROWS; r++)
		{
			for(var c = 0; c < GameBoard.BOARD_COLS; c++)
			{
				// Draw board tiles
				processing.fill((r + c) % 2 == 0 ? 255 : 64);
				processing.rect(c * GameBoard.TILE_WIDTH, r * GameBoard.TILE_HEIGHT, GameBoard.TILE_WIDTH, GameBoard.TILE_HEIGHT);

				// Draw pieces
				if(this.board[r][c] !== undefined)
				{
					this.board[r][c].render();
				}
			}
		}

	}
}

// Hacky function to manually refresh/re-render the game board by changing the previous string.
GameBoard.prototype.reloadBoard = function()
{
	console.log("MANUAL REFRESH");
	this.prevBoardStr = "BANANA";
}

GameBoard.prototype.getPieceAt = function(row, col)
{
	return this.board[row][col];
}

GameBoard.prototype.toString = function()
{
	var result = "";

	for(var r = 0; r < GameBoard.BOARD_ROWS; r++)
		for(var c = 0; c < GameBoard.BOARD_COLS; c++)
			result += this.board[r][c] !== undefined ? this.board[r][c].toString() : " ";
	
	return result;
}