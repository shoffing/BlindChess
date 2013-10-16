function PieceKing(row, col, player)
{
	this.row = row;
	this.col = col;
	this.player = player;

	this.type = "KING";
	this.visionRadius = GameBoard.TILE_WIDTH * 2.5;
	this.shouldCollide = true;

	this.sprite = processing.loadImage("blindchess/imgs/pieces/" + (player ? "white_" : "black_") + "king.png");
	this.sprite.sourceImg.addEventListener("load", function() { board.reloadBoard(); });
}

// Inherited from Piece

PieceKing.prototype.getPosX = function()
{
	return this.col * GameBoard.TILE_WIDTH + GameBoard.TILE_WIDTH / 2;
}

PieceKing.prototype.getPosY = function()
{
	return this.row * GameBoard.TILE_HEIGHT + GameBoard.TILE_HEIGHT / 2;
}

//


PieceKing.prototype.move = function(toRow, toCol, isOccupied)
{
	// Valid move if distance <= Math.sqrt(2)

	if(processing.dist(this.row, this.col, toRow, toCol) <= Math.sqrt(2))
	{
		this.row = toRow;
		this.col = toCol;
		
		return true;
	} else
		return false;
}

PieceKing.prototype.testMove = function(toRow, toCol, isOccupied)
{
	// Valid move if distance <= Math.sqrt(2)

	return processing.dist(this.row, this.col, toRow, toCol) <= Math.sqrt(2);
}

PieceKing.prototype.render = function()
{
	processing.imageMode(processing.CORNER);
	processing.image(this.sprite, this.col * GameBoard.TILE_WIDTH, this.row * GameBoard.TILE_HEIGHT, GameBoard.TILE_WIDTH, GameBoard.TILE_HEIGHT);
}

PieceKing.prototype.renderHolding = function(posX, posY)
{
	processing.imageMode(processing.CENTER);
	processing.image(this.sprite, posX, posY, GameBoard.TILE_WIDTH, GameBoard.TILE_HEIGHT);
}

PieceKing.prototype.toString = function()
{
	return this.type;
}