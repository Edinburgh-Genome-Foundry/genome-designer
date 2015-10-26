var _ = require('underscore');
var D = require('../../dutils');
var G = require('../../geometry');
var S = require('./svgshape');

var Triangle = function() {
  S.SvgShape.apply(this, arguments);
};

Triangle.prototype = Object.create(S.SvgShape.prototype);

/**
 * isoceles triangle
 */
Triangle.prototype.render = function (b) {

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
Triangle.prototype._render = function(el, b) {

  var d = _.sprintf('M %f %f L %f %f L %f %f Z', b.cx, b.y, b.r, b.b, b.x, b.b);
  el.setAttribute('d', d);

};

/**
 * isoceles triangle hard points
 */
Triangle.prototype.hardPoints = function () {

  return [
    new G.Vector2D(0.5, 0.5),
    new G.Vector2D(0.5, 0),
    new G.Vector2D(0, 1),
    new G.Vector2D(1, 1)
  ];
};

/**
 * make a icon
 * @param  {[type]} b [description]
 * @return {[type]}   [description]
 */
Triangle.prototype.icon = function(svg, b) {

  var el = document.createElementNS(U.SVGNS, 'path');
  svg.appendChild(el);
  this._render(el, b);
  return el;
};

module.exports = Triangle;
