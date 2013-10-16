function PieceBishop(row, col, player)
{
	this.row = row;
	this.col = col;
	this.player = player;

	this.type = "BISHOP";
	this.visionRadius = GameBoard.TILE_WIDTH * 2.5;
	this.shouldCollide = true;

	this.sprite = processing.loadImage("blindchess/imgs/pieces/" + (player ? "white_" : "black_") + "bishop.png");
	this.sprite.sourceImg.addEventListener("load", function() { board.reloadBoard(); });
}

// Inherited from Piece

PieceBishop.prototype.getPosX = function()
{
	return this.col * GameBoard.TILE_WIDTH + GameBoard.TILE_WIDTH / 2;
}

PieceBishop.prototype.getPosY = function()
{
	return this.row * GameBoard.TILE_HEIGHT + GameBoard.TILE_HEIGHT / 2;
}

//


PieceBishop.prototype.move = function(toRow, toCol, isOccupied)
{
	// Can only move at angles that are multiples of 45 degrees
	// but are not also multiples of 90 degrees

	var deltaRow = toRow - this.row;
	var deltaCol = toCol - this.col;
	var angleInDegrees = Math.atan2(deltaCol, deltaRow) * 180 / Math.PI;

	if(angleInDegrees % 45 == 0 && angleInDegrees % 90 != 0)
	{
		this.row = toRow;
		this.col = toCol;

		return true;
	} else
		return false;
}

PieceBishop.prototype.testMove = function(toRow, toCol, isOccupied)
{
	// Can only move at angles that are multiples of 45 degrees
	// but are not also multiples of 90 degrees

	var deltaRow = toRow - this.row;
	var deltaCol = toCol - this.col;
	var angleInDegrees = Math.atan2(deltaCol, deltaRow) * 180 / Math.PI;

	return angleInDegrees % 45 == 0 && angleInDegrees % 90 != 0;
}

PieceBishop.prototype.render = function()
{
	processing.imageMode(processing.CORNER);
	processing.image(this.sprite, this.col * GameBoard.TILE_WIDTH, this.row * GameBoard.TILE_HEIGHT, GameBoard.TILE_WIDTH, GameBoard.TILE_HEIGHT);
}

PieceBishop.prototype.renderHolding = function(posX, posY)
{
	processing.imageMode(processing.CENTER);
	processing.image(this.sprite, posX, posY, GameBoard.TILE_WIDTH, GameBoard.TILE_HEIGHT);
}

PieceBishop.prototype.toString = function()
{
	return this.type;
}