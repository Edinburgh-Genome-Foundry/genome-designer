var _ = require('underscore');
var D = require('../../dutils');
var G = require('../../geometry');
var S = require('./svgshape');

var LeftRibbon = function() {
  S.SvgShape.apply(this, arguments);
};

LeftRibbon.prototype = Object.create(S.SvgShape.prototype);
/**
 * right arrow ->
 */
LeftRibbon.prototype.render = function(b) {

  if (!this.pathEl) {
    this.pathEl = D.appendString(this.el, '<path/>');
  }
  // arrow is proportional to height
  var t = b.h / 2;


  var da = _.sprintf('M %f %f L %f %f L %f %f L %f %f L %f %f Z',
    b.r, b.y,
    b.x + t, b.y,
    b.x, b.y + t,
    b.x + t, b.b,
    b.r, b.b);

  this.pathEl.setAttribute('d', da);

  return this.pathEl;
};


/**
 * right triangle
 */
LeftRibbon.prototype.hardPoints = function() {

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

module.exports = LeftRibbon;
