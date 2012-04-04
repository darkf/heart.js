/* heart.js v0.0.1
   copyright (c) 2012 darkf
   licensed under the terms of the MIT license, see LICENSE for details

   A Canvas-based graphics library inspired by (i.e. cloned from) Love 2D (https://love2d.org/)
   It's currently in its pre-alpha development stage, so don't expect anything to work,
   and feel free to send pull requests / file issues!

   Thank you for using heart.js! :-)
*/

var heart = {_lastTick: new Date().getTime(), _dt: 0, _fps: 0, _targetFPS: 30, bg: {r: 127, g: 127, b: 127}, _size: {w: 800, h: 600}};
var love = heart; /* for interoperability with the love API */

heart.graphics = {
	rectangle: function(mode, x, y, w, h) {
		if(mode === "fill")
			heart.ctx.fillRect(x, y, w, h);
		else
			heart.ctx.strokeRect(x, y, w, h);
	},

	print: function(text, x, y) {
		heart.ctx.fillText(text, x, y);
	},

	setColor: function(r, g, b) {
		heart.ctx.fillStyle = heart.ctx.strokeStyle = "rgb("+r+","+g+","+b+")";
	},
};

heart.timer = {
	getFPS: function() {
		return heart._fps;
	}
};

heart._init = function() {
	if(heart.load !== undefined)
		heart.load();
	if(heart.canvas === undefined || heart.ctx === undefined)
		alert("no canvas");
};

heart._tick = function() {
	var time = new Date().getTime();
	heart._dt = time - heart._lastTick;
	heart._lastTick = time;
	heart._fps = Math.floor(1000 / heart._dt);

	if(heart.update)
		heart.update(heart._dt / 1000);

	heart.ctx.fillStyle = "rgb("+heart.bg.r+","+heart.bg.g+","+heart.bg.b+")";
	heart.ctx.fillRect(0, 0, heart._size.w, heart._size.h);
	if(heart.draw)
		heart.draw();

	setTimeout(heart._tick, 1000 / heart._targetFPS);
}

heart.attach = function(canvas) {
	var el = document.getElementById(canvas);
	if(!el)
		return false;
	heart.canvas = el;
	heart.ctx = heart.canvas.getContext("2d");
	if(!heart.ctx)
		akert("couldn't get canvas context")
};


window.onload = function() {
	heart._init();
	heart._tick();
};