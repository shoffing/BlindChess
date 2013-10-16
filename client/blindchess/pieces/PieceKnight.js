function PieceKnight(row, col, player)
{
	this.row = row;
	this.col = col;
	this.player = player;

	this.type = "KNIGHT";
	this.visionRadius = GameBoard.TILE_WIDTH * 2.5;
	this.shouldCollide = true;

	this.sprite = processing.loadImage("blindchess/imgs/pieces/" + (player ? "white_" : "black_") + "knight.png");
}

// Inherited from Piece

PieceKnight.prototype.getPosX = function()
{
	return this.col * GameBoard.TILE_WIDTH + GameBoard.TILE_WIDTH / 2;
}

PieceKnight.prototype.getPosY = function()
{
	return this.row * GameBoard.TILE_HEIGHT + GameBoard.TILE_HEIGHT / 2;
}

//


PieceKnight.prototype.move = function(toRow, toCol, isOccupied)
{
	// Can only move at angles that aren't multiples of 45 deg, where dist == sqrt(5)

	var deltaRow = toRow - this.row;
	var deltaCol = toCol - this.col;
	var angleInDegrees = Math.atan2(deltaCol, deltaRow) * 180 / Math.PI;

	if(angleInDegrees % 45 != 0 && processing.dist(this.row, this.col, toRow, toCol) == Math.sqrt(5))
	{
		this.row = toRow;
		this.col = toCol;

		return true;
	} else 
		return false;
}

PieceKnight.prototype.testMove = function(toRow, toCol, isOccupied)
{
	// Can only move at angles that aren't multiples of 45 deg, where dist == sqrt(5)

	var deltaRow = toRow - this.row;
	var deltaCol = toCol - this.col;
	var angleInDegrees = Math.atan2(deltaCol, deltaRow) * 180 / Math.PI;

	return angleInDegrees % 45 != 0 && processing.dist(this.row, this.col, toRow, toCol) == Math.sqrt(5);
}

PieceKnight.prototype.render = function()
{
	processing.imageMode(processing.CORNER);
	processing.image(this.sprite, this.col * GameBoard.TILE_WIDTH, this.row * GameBoard.TILE_HEIGHT, GameBoard.TILE_WIDTH, GameBoard.TILE_HEIGHT);
}

PieceKnight.prototype.renderHolding = function(posX, posY)
{
	processing.imageMode(processing.CENTER);
	processing.image(this.sprite, posX, posY, GameBoard.TILE_WIDTH, GameBoard.TILE_HEIGHT);
}

PieceKnight.prototype.toString = function()
{
	return this.type;
}