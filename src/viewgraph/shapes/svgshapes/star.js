var _ = require('underscore');
var D = require('../../dutils');
var G = require('../../geometry');
var S = require('./svgshape');


var Star = function() {
  S.SvgShape.apply(this, arguments);
};

Star.prototype = Object.create(S.SvgShape.prototype);

Star.prototype.render = function(b) {

  if (!this.pathEl) {
    this.pathEl = D.appendString(this.el, '<path/>');
  }

  var p = new G.Polygon();
  var d = Math.min(b.width, b.height);
  p.star(b.cx, b.cy, 5, d / 2, d / 2 * 0.4);

  var da = _.sprintf('M %f %f', p.get(0).x, p.get(0).y);
  for (var i = 1; i < p.count; i += 1) {
    da += _.sprintf(' L %f %f', p.get(i).x, p.get(i).y);
  }
  da += ' Z';

  this.pathEl.setAttribute('d', da);

  return this.pathEl;
};

/**
 * rectangle hard points
 */
Star.prototype.hardPoints = function() {

  return [
    new G.Vector2D(0.5, 0.5),
  ];
};

module.exports = Star;
