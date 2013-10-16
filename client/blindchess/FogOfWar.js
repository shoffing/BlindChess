/*=====

Pass it a width, height, and an array of visions like:
	[
		{
			x: 10,
			y: 31,
			radius: 5
		},
		{
			x: 17,
			...
	]
	
And it will return a 2d array of numbers ([x][y]) between 0 (clear) and 1 (opaque)

=====*/

function FogOfWar(width, height)
{
	this.width = width;
	this.height = height;

	this.fog = [];
}

FogOfWar.prototype.update = function(visions)
{
	// fill fog as opaque
	for(var x = 0; x < this.width; x++)
	{
		this.fog[x] = [];
		for(var y = 0; y < this.height; y++)
			this.fog[x][y] = 1;
	}

	for(var i = 0; i < visions.length; i++)
	{
		for(var cx = Math.max(visions[i].x - visions[i].radius, 0); cx <= Math.min(visions[i].x + visions[i].radius, this.width - 1); cx++)
		{
			for(var cy = Math.max(visions[i].y - visions[i].radius, 0); cy <= Math.min(visions[i].y + visions[i].radius, this.height - 1); cy++)
			{
				// Get ratio of (distance from current vision to current fog cell) / current vision radius
				var distVisionRatio = processing.dist(cx, cy, visions[i].x, visions[i].y) / visions[i].radius;

				if(distVisionRatio <= 1)
				{
					this.fog[cx][cy] = Math.min(distVisionRatio, this.fog[cx][cy]);
				}
			}
		}
	}

	return this.fog;
}