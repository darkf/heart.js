/* heart.js v0.0.1 TypeScript definitions
   copyright (c) 2012-2013 darkf
   licensed under the terms of the MIT license, see LICENSE for details
*/

declare module heart {
	export var ctx : CanvasRenderingContext2D;

	export function attach(canvasID:string) : void;

	// overridable callbacks
	export var preload : () => void;
	export var load : () => void;
	export var keydown : (char:string) => void;
	export var keyup : (char:string) => void;
	export var update : (dt:number) => void;
	export var draw : () => void;

	export class HeartImage {
		img : HTMLImageElement;
		getWidth() : number;
		getHeight() : number;
	}

	// submodules
	export module graphics {
		export function setColor(r:number, g:number, b:number, a?:number) : void;
		export function rectangle(mode:string, x:number, y:number, w:number, h:number) : void;
		export function print(msg:string, x:number, y:number) : void;
		export function draw(drawable:HeartImage, x:number, y:number) : void;
		export function newImage(path:string, callback : (result:HeartImage) => void);
		export function getWidth() : number;
		export function getHeight() : number;
		export function push() : void;
		export function pop() : void;
		export function translate(x:number, y:number) : void;
		export function rotate(angle:number) : void;
	}

	export module timer {
		export function getFPS() : number;
		export function getTargetFPS() : number;
		export function setTargetFPS(fps : number) : void;
		export function getTime() : number;
	}
}