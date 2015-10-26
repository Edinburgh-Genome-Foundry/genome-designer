var G = require('../../geometry');
var Shapes = require('../shape');
var U = require('../../utils');
var C = require('../../viewgraph_consts');


/**
 * base class for canvas glyphs
 * @constructor
 */
var CanvasShape = function (node) {

  Shapes.Generic.call(this, node);

  this.el = document.createElement('canvas');
  this.el.classList.add('canvasLine');
  this.el.style.left = -(C.SW / 2) + 'px';
  this.el.style.top = -(C.SW / 2) + 'px';

  this.node.el.appendChild(this.el);

  this.context = this.el.getContext('2d');
};

U.extends(Shapes.Generic, CanvasShape);


/**
 * update rendering to current state of node
 */
CanvasShape.prototype.update = function () {

  // all shapes size to the node
  this.el.width = this.node.width + C.SW;
  this.el.height = this.node.height + C.SW;

  // makde node dimensions easier to access
  this.w = this.node.width;
  this.h = this.node.height;

  // create a box which is the canvas rectangle that intersects the actual node
  // and does not include the overflow provided for thick strokes. This defines
  // the area in which rendering occurs and the limits for gradients
  var b = new G.Box(C.SW / 2, C.SW / 2, this.w, this.h);

  // for most shapes, this initialization will be the same
  this.context.strokeStyle = this.node.stroke;

  if (this.node.fillGradient) {
    this.context.fillStyle = this.node.fillGradient.canvasLinearGradient(this.context, b);
  } else {
    this.context.fillStyle = this.node.fill;
  }

  this.context.lineWidth = this.node.strokeWidth.toString();
  this.context.beginPath();
  this.context.lineCap = 'butt';


  // the shape property is literally the name of the function that draws the shape.
  // We pass the context box since this means you don't have to use this.b, this.context numerous times.

  this.render(this.context, b);
};

/**
 * helper function to draw arrow at the of the line
 * @param  {[type]} line [description]
 * @return {[type]}      [description]
 */
CanvasShape.prototype.drawArrow = function(c, line, fill) {

  var a = line.getArrowHead(true);
  c.fillStyle = fill;

  c.beginPath();
  c.moveTo(a[0].x, a[0].y);
  c.lineTo(a[1].x, a[1].y);
  c.lineTo(a[2].x, a[2].y);
  c.closePath();
  c.fill();
};

/**
 * to be overridden by subclass
 * returns element
 * @param {Box} b
 * @return {DOM Node}
 */
CanvasShape.prototype.render = function(b) {
};

module.exports = CanvasShape;
