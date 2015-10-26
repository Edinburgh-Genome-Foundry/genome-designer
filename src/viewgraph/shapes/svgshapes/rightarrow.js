var _ = require('underscore');
var D = require('../../dutils');
var G = require('../../geometry');
var S = require('./svgshape');

var RightArrow = function() {
  S.SvgShape.apply(this, arguments);
};

RightArrow.prototype = Object.create(S.SvgShape.prototype);
/**
 * right arrow ->
 */
RightArrow.prototype.render = function(b) {

  if (!this.pathEl) {
    this.pathEl = D.appendString(this.el, '<path/>');
  }
  // thickness of stem is 50% height
  var t = b.h / 2;
  // arrow head depth is equal to height
  var d = b.h;

  var da = _.sprintf('M %f %f L %f %f L %f %f L %f %f L %f %f L %f %f L %f %f Z',
    b.x, b.cy - t / 2,
    b.r - d, b.cy - t / 2,
    b.r - d, b.y,
    b.r, b.cy,
    b.r - d, b.b,
    b.r - d, b.cy + t / 2,
    b.x, b.cy + t / 2);

  this.pathEl.setAttribute('d', da);

  return this.pathEl;
};


/**
 * right triangle
 */
RightArrow.prototype.hardPoints = function() {

  return [
    new G.Vector2D(0, 0.5),
    new G.Vector2D(0.5, 0.5),
    new G.Vector2D(1, 0.5)
  ];

};

module.exports = RightArrow;
