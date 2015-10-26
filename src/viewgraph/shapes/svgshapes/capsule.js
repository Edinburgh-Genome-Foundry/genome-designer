var D = require('../../dutils');
var G = require('../../geometry');
var S = require('./svgshape');

var Capsule = function () {
  S.SvgShape.apply(this, arguments);
};

Capsule.prototype = Object.create(S.SvgShape.prototype);

Capsule.prototype.render = function (b) {

  if (!this.rectEl) {
    this.rectEl = D.appendString(this.el, '<rect/>');
  }

  this.rectEl.setAttributeNS(null, 'x', b.x + 'px');
  this.rectEl.setAttributeNS(null, 'y', b.y + 'px');
  this.rectEl.setAttributeNS(null, 'width', b.w + 'px');
  this.rectEl.setAttributeNS(null, 'height', b.h + 'px');

  this.rectEl.setAttributeNS(null, 'rx', b.h / 2);
  this.rectEl.setAttributeNS(null, 'ry', b.h / 2);

  return this.rectEl;
};

/**
 * rectangle hard points
 */
Capsule.prototype.hardPoints = function () {

  return [
    new G.Vector2D(0.5, 0.5),
    new G.Vector2D(0.5, 0),
    new G.Vector2D(1, 0.5),
    new G.Vector2D(0.5, 1),
    new G.Vector2D(0, 0.5)
  ];
};

module.exports = Capsule;
