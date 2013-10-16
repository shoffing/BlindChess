var processing;

var board;

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
	}

	processing.draw = function()
	{
		processing.background(128);

		board.render(false);
	};
}

onload = function()
{
	var canvas = document.getElementById("canvas");
	var p = new Processing(canvas, sketchProc);
}