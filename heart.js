/* heart.js v0.0.1
   copyright (c) 2012 darkf
   licensed under the terms of the MIT license, see LICENSE for details

   A Canvas-based graphics library inspired by (i.e. cloned from) Love 2D (https://love2d.org/)
   It's currently in its pre-alpha development stage, so don't expect anything to work,
   and feel free to send pull requests / file issues!

   Thank you for using heart.js! :-)
*/

var heart = { _lastTick: new Date().getTime(), /* time of the last tick */
			  _dt: 0, /* time since last tick in seconds */
			  _fps: 0, /* frames per second */
			  _targetFPS: 30, /* the target FPS cap */
			  bg: {r: 127, g: 127, b: 127}, /* background color */
			  _size: {w: 800, h: 600}, /* size of viewport */
			  _syncLoading: [] /* for synchronous image loading */
			};

var HeartImage = function(img) {
	this.img = img;
};

HeartImage.prototype.getWidth = function() {
	return this.img.width;
};

HeartImage.prototype.getHeight = function() {
	return this.img.height;
};

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

	getWidth: function() {
		return heart._size.w;
	},

	getHeight: function() {
		return heart._size.h;
	},

	newImage: function(src) {
		/* synchronously load image */
		/* XXX: does not handle errors */
		var img = new Image();
		var i = heart._syncLoading.length;
		heart._syncLoading.push(img);
		img.onload = function() {
			heart._syncLoading.splice(i, 1); /* remove img from the loading sequence */
		};
		img.src = src;
		return new HeartImage(img);
	},

	draw: function(drawable, x, y) {
		if(drawable.img !== undefined) {
			heart.ctx.drawImage(drawable.img, x, y);
		}
	}
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
	/* if we're waiting on images to load, skip the frame */
	if(heart._syncLoading.length === 0) {
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
	}

	setTimeout(heart._tick, 1000 / heart._targetFPS);
}

heart.attach = function(canvas) {
	var el = document.getElementById(canvas);
	if(!el)
		return false;
	heart.canvas = el;
	heart.ctx = heart.canvas.getContext("2d");
	if(!heart.ctx)
		alert("couldn't get canvas context")
};


window.onload = function() {
	heart._init();
	heart._tick();
};