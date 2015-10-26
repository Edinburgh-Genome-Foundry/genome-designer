var _ = require('underscore');
var D = require('../../dutils');
var G = require('../../geometry');
var S = require('./svgshape');

var RightRibbon = function() {
  S.SvgShape.apply(this, arguments);
};

RightRibbon.prototype = Object.create(S.SvgShape.prototype);
/**
 * right arrow ->
 */
RightRibbon.prototype.render = function(b) {

  if (!this.pathEl) {
    this.pathEl = D.appendString(this.el, '<path/>');
  }
  // arrow is proportional to height
  var t = b.h / 2;


  var da = _.sprintf('M %f %f L %f %f L %f %f L %f %f L %f %f Z',
    b.x, b.y,
    b.r - t, b.y,
    b.r, b.y + t,
    b.r - t, b.b,
    b.x, b.b);

  this.pathEl.setAttribute('d', da);

  return this.pathEl;
};


/**
 * right triangle
 */
RightRibbon.prototype.hardPoints = function() {

  return [
    new G.Vector2D(0.5, 0.5),
    new G.Vector2D(0, 0),
    new G.Vector2D(0, 1),
    new G.Vector2D(1, 0),
    new G.Vector2D(1, 1),
    new G.Vector2D(0.5, 0),
    new G.Vector2D(1, 0.5),
    new G.Vector2D(0.5, 1),
    new G.Vector2D(0, 0.5)
  ];

};

module.exports = RightRibbon;
