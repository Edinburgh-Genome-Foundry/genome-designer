var _ = require('underscore');
var U = require('../../utils');
var D = require('../../dutils');
var G = require('../../geometry');
var S = require('./svgshape');
var C = require('../../viewgraph_consts');

var Parallelogram = function() {
  S.SvgShape.apply(this, arguments);
};

Parallelogram.prototype = Object.create(S.SvgShape.prototype);

Parallelogram.prototype.render = function(b) {

  if (!this.pathEl) {
    this.pathEl = D.appendString(this.el, '<path/>');
  }

  this._render(this.pathEl, b);
  return this.pathEl;

};

/**
 * internal render
 * @param  {[type]} el [description]
 * @param  {[type]} b  [description]
 * @return {[type]}    [description]
 */
Parallelogram.prototype._render = function(el, b) {

  // get length of inset given the angle Θ e.g
  /*
       ------------------------------------
      /                                  /| <- Θ
     /                                  / |
    /                                  /  | H     Given Θ then length of S is:
   /                                  /   |       Tan * H
  /----------------------------------/----|
                                     | S  |
  */

  var i = Math.tan(U.D2R(C.PARI)) * b.h;

  // draw diamond from left/center point clockwise
  var d = _.sprintf('M %f %f L %f %f L %f %f L %f %f Z', b.x + i, b.y, b.r, b.y, b.r - i, b.b, b.x, b.b);
  el.setAttribute('d', d);

};

/**
 * rectangle hard points
 */
Parallelogram.prototype.hardPoints = function() {

  // get inset as coeffecient of our width
  var w = this.node.width;
  var i = Math.min(C.PARI, w / 2) / Math.max(1, w);

  return [
    // center
    new G.Vector2D(0.5, 0.5),

    // top right, bottom left corners
    new G.Vector2D(1, 0),
    new G.Vector2D(0, 1),

    // inset corners
    new G.Vector2D(i, 0),
    new G.Vector2D(1 - i, 1),

    // middle of sloping sides
    new G.Vector2D(i / 2, 0.5),
    new G.Vector2D(1 - i / 2, 0.5),

    // middles of sloping sides
    new G.Vector2D(i / 2, 0.5),
    new G.Vector2D(1 - i / 2, 0.5)
  ];
};

/**
 * make a icon
 * @param  {[type]} b [description]
 * @return {[type]}   [description]
 */
Parallelogram.prototype.icon = function(svg, b) {

  var el = document.createElementNS(U.SVGNS, 'path');
  svg.appendChild(el);
  this.renderParallelogram(el, b);
  return el;
};

module.exports = Parallelogram;
