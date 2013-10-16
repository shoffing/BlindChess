function PieceRook(row, col, player)
{
	this.row = row;
	this.col = col;
	this.player = player;

	this.type = "ROOK";
	this.visionRadius = GameBoard.TILE_WIDTH * 2.5;
	this.shouldCollide = true;

	this.sprite = processing.loadImage("blindchess/imgs/pieces/" + (player ? "white_" : "black_") + "rook.png");
}

// Inherited from Piece

PieceRook.prototype.getPosX = function()
{
	return this.col * GameBoard.TILE_WIDTH + GameBoard.TILE_WIDTH / 2;
}

PieceRook.prototype.getPosY = function()
{
	return this.row * GameBoard.TILE_HEIGHT + GameBoard.TILE_HEIGHT / 2;
}

//


PieceRook.prototype.move = function(toRow, toCol, isOccupied)
{
	// Can only move at angles that are multiples of 90 deg

	var deltaRow = toRow - row;
	var deltaCol = toCol - col;
	var angleInDegrees = Math.atan2(deltaCol, deltaRow) * 180 / Math.PI;

	if(angleInDegrees % 90 == 0)
	{
		this.row = toRow;
		this.col = toCol;

		return true;
	} else
		return false;
}

PieceRook.prototype.testMove = function(toRow, toCol, isOccupied)
{
	// Can only move at angles that are multiples of 90 deg

	var deltaRow = toRow - this.row;
	var deltaCol = toCol - this.col;
	var angleInDegrees = Math.atan2(deltaCol, deltaRow) * 180 / Math.PI;

	return angleInDegrees % 90 == 0;
}

PieceRook.prototype.render = function()
{
	processing.imageMode(processing.CORNER);
	processing.image(this.sprite, this.col * GameBoard.TILE_WIDTH, this.row * GameBoard.TILE_HEIGHT, GameBoard.TILE_WIDTH, GameBoard.TILE_HEIGHT);
}

PieceRook.prototype.renderHolding = function(posX, posY)
{
	processing.imageMode(processing.CENTER);
	processing.image(this.sprite, posX, posY, GameBoard.TILE_WIDTH, GameBoard.TILE_HEIGHT);
}

PieceRook.prototype.toString = function()
{
	return this.type;
}