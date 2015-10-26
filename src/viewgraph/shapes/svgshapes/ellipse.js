var D = require('../../utils');
var G = require('../../geometry');
var S = require('./svgshape');

var Ellipse = function () {
  S.SvgShape.apply(this, arguments);
};

Ellipse.prototype = Object.create(S.SvgShape.prototype);

Ellipse.prototype.render = function (b) {

  if (!this.rectEl) {
    this.rectEl = D.appendString(this.el, '<ellipse/>');
  }

  this.rectEl.setAttribute('cx', b.cx + 'px');
  this.rectEl.setAttribute('cy', b.cy + 'px');
  this.rectEl.setAttribute('rx', b.w / 2 + 'px');
  this.rectEl.setAttribute('ry', b.h / 2 + 'px');

  return this.rectEl;
};

/**
 * rectangle hard points
 */
Ellipse.prototype.hardPoints = function () {

  return [
    new G.Vector2D(0.5, 0.5),
  ];
};

module.exports = Ellipse;
