function PiecePawn(row, col, player)
{
	this.row = row;
	this.col = col;
	this.player = player;

	this.type = "PAWN";
	this.visionRadius = GameBoard.TILE_WIDTH * 1.5;
	this.shouldCollide = true;

	this.sprite = processing.loadImage("blindchess/imgs/pieces/" + (player ? "white_" : "black_") + "pawn.png");

	//

	this.hasMoved = false;
}

// Inherited from Piece

PiecePawn.prototype.getPosX = function()
{
	return this.col * GameBoard.TILE_WIDTH + GameBoard.TILE_WIDTH / 2;
}

PiecePawn.prototype.getPosY = function()
{
	return this.row * GameBoard.TILE_HEIGHT + GameBoard.TILE_HEIGHT / 2;
}

//


PiecePawn.prototype.move = function(toRow, toCol, isOccupied)
{
	// Can only move forward (PLAYER1 > 0, PLAYER2 < 0)
	// Can move one square @ 90°, or if !moved 2 squares (only if !occupied)
	// Can also move if occupied && forward-left || forward-right

	var deltaRow = toRow - this.row;
	var deltaCol = toCol - this.col;
	var angleInDegrees = Math.atan2(deltaCol, deltaRow) * 180 / Math.PI;

	var isMovingForward = (deltaCol == 0) && (this.player ? (deltaRow < 0) : (deltaRow > 0));
	var isWithinDistanceLimit = Math.abs(deltaRow) <= (this.hasMoved ? 1 : 2);

	if( (!isOccupied && isMovingForward && isWithinDistanceLimit) || (isOccupied && Math.abs(deltaRow) == 1 && Math.abs(deltaCol) == 1) )
	{
		this.row = toRow;
		this.col = toCol;
		
		this.hasMoved = true;

		return true;
	} else
		return false;
}

PiecePawn.prototype.testMove = function(toRow, toCol, isOccupied)
{
	// Can only move forward (PLAYER1 > 0, PLAYER2 < 0)
	// Can move one square @ 90°, or if !moved 2 squares (only if !occupied)
	// Can also move if occupied && forward-left || forward-right

	var deltaRow = toRow - this.row;
	var deltaCol = toCol - this.col;
	var angleInDegrees = Math.atan2(deltaCol, deltaRow) * 180 / Math.PI;

	var isMovingForward = (deltaCol == 0) && (this.player ? (deltaRow < 0) : (deltaRow > 0));
	var isWithinDistanceLimit = Math.abs(deltaRow) <= (this.hasMoved ? 1 : 2);

	return (!isOccupied && isMovingForward && isWithinDistanceLimit) || (isOccupied && Math.abs(deltaRow) == 1 && Math.abs(deltaCol) == 1);
}

PiecePawn.prototype.render = function()
{
	processing.imageMode(processing.CORNER);
	processing.image(this.sprite, this.col * GameBoard.TILE_WIDTH, this.row * GameBoard.TILE_HEIGHT, GameBoard.TILE_WIDTH, GameBoard.TILE_HEIGHT);
}

PiecePawn.prototype.renderHolding = function(posX, posY)
{
	processing.imageMode(processing.CENTER);
	processing.image(this.sprite, posX, posY, GameBoard.TILE_WIDTH, GameBoard.TILE_HEIGHT);
}

PiecePawn.prototype.toString = function()
{
	return this.type;
}