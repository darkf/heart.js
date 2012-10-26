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
			  _bg: {r: 127, g: 127, b: 127}, /* background color */
			  _size: {w: 800, h: 600}, /* size of viewport */
			  _imagesLoading: [], /* for synchronous image loading */
			  _keysDown: {} /* which keys are down (char -> bool) */
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

	getBackgroundColor: function() {
		return heart._bg;
	},

	setBackgroundColor: function(r, g, b) {
		heart._bg = {r: r, g: g, b: b};
	},

	newImage: function(src, callback) {
		/* load an image */
		/* XXX: does not handle errors */
		var img = new Image();
		heart._imagesLoading.push(img);
		img.onload = function() {
			heart._imagesLoading.splice(heart._imagesLoading.indexOf(img), 1); /* remove img from the loading sequence */
			callback(new HeartImage(img));
		};
		img.src = src;
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
	},

	getTargetFPS: function() {
		return heart._targetFPS;
	},

	setTargetFPS: function(fps) {
		heart._targetFPS = fps;
	},

	getTime: function() {
		return new Date().getTime();
	}
};

heart.keyboard = {
	isDown: function(key) {
		return heart._keysDown[key];
	},

	isUp: function(key) {
		return !heart.keyboard.isDown(key);
	}
};

heart._init = function() {
	/* if we're waiting on images to load, spinlock */
	if(heart._imagesLoading.length !== 0) {
		setTimeout(heart._init, 30 /* ms */);
		return;
	}

	if(heart.load !== undefined)
		heart.load();
	if(heart.canvas === undefined || heart.ctx === undefined)
		alert("no canvas");

	heart._tick(); /* first tick */
};

heart._tick = function() {
	var time = new Date().getTime();
	heart._dt = time - heart._lastTick;
	heart._lastTick = time;
	heart._fps = Math.floor(1000 / heart._dt);

	if(heart.update)
		heart.update(heart._dt / 1000);

	heart.ctx.fillStyle = "rgb("+heart._bg.r+","+heart._bg.g+","+heart._bg.b+")";
	heart.ctx.fillRect(0, 0, heart._size.w, heart._size.h);
	if(heart.draw)
		heart.draw();

	setTimeout(heart._tick, 1000 / heart._targetFPS);
};

heart.attach = function(canvas) {
	var el = document.getElementById(canvas);
	if(!el)
		return false;
	heart.canvas = el;
	heart.ctx = heart.canvas.getContext("2d");
	if(!heart.ctx)
		alert("couldn't get canvas context")
};

heart._getKeyChar = function(c) {
	/* supply a hacky keymap */
	switch(c) {
		/* arrow keys */
		case 38: return "up";
		case 37: return "left";
		case 39: return "right";
		case 40: return "down";
	}

	return String.fromCharCode(c).toLowerCase();
};

// XXX: we need a keymap, since browsers decide on being annoying and
// not having a consistent keymap. (also, this won't work with special characters.)
window.onkeydown = function(e) {
	var c = heart._getKeyChar(e.keyCode);
	heart._keysDown[c] = true;
	if(heart.keydown !== undefined)
		heart.keydown(c);
};

window.onkeyup = function(e) {
	var c = heart._getKeyChar(e.keyCode);
	heart._keysDown[c] = false;
	if(heart.keyup !== undefined)
		heart.keyup(c);
};

window.onload = function() {
	if(heart.preload !== undefined)
		heart.preload();
	heart._init();
};