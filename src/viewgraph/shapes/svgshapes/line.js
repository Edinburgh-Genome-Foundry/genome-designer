var D = require('../../dutils');
var G = require('../../geometry');
var S = require('./svgshape');

var Line = function() {
  S.SvgShape.apply(this, arguments);
};

Line.prototype = Object.create(S.SvgShape.prototype);

Line.prototype.render = function (b) {

  if (!this.lineEl) {
    this.lineEl = D.appendString(this.el, '<line/>');
  }

  var startInset = this.node.strokeWidth * 2;
  var endInset = this.node.strokeWidth * 2;

  this.lineEl.setAttribute('x1', b.x + startInset + 'px');
  this.lineEl.setAttribute('y1', b.cy + 'px');
  this.lineEl.setAttribute('x2', b.r - endInset + 'px');
  this.lineEl.setAttribute('y2', b.cy + 'px');

  this.updateStartMarker(this.lineEl);
  this.updateEndMarker(this.lineEl);

  // parent should not specify a fill
  this.noFill();

  return this.lineEl;
};

/**
 * rectangle hard points
 */
Line.prototype.hardPoints = function () {

  return [
    new G.Vector2D(0, 0.5),
    new G.Vector2D(0.25, 0.5),
    new G.Vector2D(0.5, 0.5),
    new G.Vector2D(0.75, 0.5),
    new G.Vector2D(1, 0.5),
  ];
};

module.exports = Line;
