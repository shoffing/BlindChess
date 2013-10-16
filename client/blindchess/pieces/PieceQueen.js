function PieceQueen(row, col, player)
{
	this.row = row;
	this.col = col;
	this.player = player;

	this.type = "QUEEN";
	this.visionRadius = 2.5;
	this.shouldCollide = true;

	this.sprite = processing.loadImage("blindchess/imgs/pieces/" + (player ? "white_" : "black_") + "queen.png");
	this.sprite.sourceImg.addEventListener("load", function() { board.reloadBoard(); });
}

// Inherited from Piece

PieceQueen.prototype.getPosX = function()
{
	return this.col * GameBoard.TILE_WIDTH + GameBoard.TILE_WIDTH / 2;
}

PieceQueen.prototype.getPosY = function()
{
	return this.row * GameBoard.TILE_HEIGHT + GameBoard.TILE_HEIGHT / 2;
}

//


PieceQueen.prototype.move = function(toRow, toCol, isOccupied)
{
	// Valid move if angle is a multiple of 45 deg

	var deltaRow = toRow - this.row;
	var deltaCol = toCol - this.col;
	var angleInDegrees = Math.atan2(deltaCol, deltaRow) * 180 / Math.PI;

	if(angleInDegrees % 45 == 0)
	{
		this.row = toRow;
		this.col = toCol;

		return true;
	} else
		return false;
}

PieceQueen.prototype.testMove = function(toRow, toCol, isOccupied)
{
	// Valid move if angle is a multiple of 45 deg

	var deltaRow = toRow - this.row;
	var deltaCol = toCol - this.col;
	var angleInDegrees = Math.atan2(deltaCol, deltaRow) * 180 / Math.PI;

	return angleInDegrees % 45 == 0;
}

PieceQueen.prototype.render = function()
{
	processing.imageMode(processing.CORNER);
	processing.image(this.sprite, this.col * GameBoard.TILE_WIDTH, this.row * GameBoard.TILE_HEIGHT, GameBoard.TILE_WIDTH, GameBoard.TILE_HEIGHT);
}

PieceQueen.prototype.renderHolding = function(posX, posY)
{
	processing.imageMode(processing.CENTER);
	processing.image(this.sprite, posX, posY, GameBoard.TILE_WIDTH, GameBoard.TILE_HEIGHT);
}

PieceQueen.prototype.toString = function()
{
	return this.type;
}