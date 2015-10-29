var _ = require('underscore');
var D = require('../../dutils');
var G = require('../../geometry');
var S = require('./svgshape');

var Lozenge = function() {
  S.SvgShape.apply(this, arguments);
};

Lozenge.prototype = Object.create(S.SvgShape.prototype);

Lozenge.prototype.render = function (b) {

  if (!this.pathEl) {
    this.pathEl = D.appendString(this.el, '<path/>');
  }

  // the radius of the end caps is 2 * height of lozenge.
  // To calculate where the end cap intersects the top/bottom edge we use
  // some basic Pythagoras. We also need to angle subtended by the ends of
  // the cap and the center of the circle.
  // the cap and the center of the circle.
  var r = b.h * 2;
  var x = b.h / 2;
  var t = Math.sqrt((r * r) - (x * x));
  var inset = r - t;
  //var a = Math.asin(x / r);

  // move to top left
  var d = _.sprintf('M %f %f', b.x + inset, b.y);
  // line across top
  d += _.sprintf(' L %f %f', b.r - inset, b.y);
  // right arc
  d += _.sprintf(' A %f %f 0 0 1 %f %f', r, r, b.r - inset, b.b);
  // line across bottom
  d += _.sprintf(' L %f %f', b.x + inset, b.b);
  // left arc
  d += _.sprintf(' A %f %f 0 0 1 %f %f Z', r, r, b.x + inset, b.y);

  this.pathEl.setAttribute('d', d);

  return this.pathEl;

};

/**
 * rectangle hard points
 */
Lozenge.prototype.hardPoints = function () {

  return [
    new G.Vector2D(0.5, 0.5),
    new G.Vector2D(0.5, 0),
    new G.Vector2D(1, 0.5),
    new G.Vector2D(0.5, 1),
    new G.Vector2D(0, 0.5)
  ];
};

module.exports = Lozenge;
