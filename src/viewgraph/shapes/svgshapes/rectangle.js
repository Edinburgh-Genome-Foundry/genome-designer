var D = require('../../dutils');
var G = require('../../geometry');
var S = require('./svgshape');


var Rectangle = function Rectangle() {
  S.SvgShape.apply(this, arguments);
};

Rectangle.prototype = Object.create(S.SvgShape.prototype);

Rectangle.prototype.render = function (b) {

  if (!this.rectEl) {
    this.rectEl = D.appendString(this.el, '<rect/>');
  }

  this.rectEl.setAttribute('x', b.x + 'px');
  this.rectEl.setAttribute('y', b.y + 'px');
  this.rectEl.setAttribute('width', b.w + 'px');
  this.rectEl.setAttribute('height', b.h + 'px');

  return this.rectEl;
};

/**
 * rectangle hard points
 */
Rectangle.prototype.hardPoints = function () {

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

/**
 * make a icon
 * @param  {[type]} b [description]
 * @return {[type]}   [description]
 */
Rectangle.prototype.Icon = function(svg, b) {

  var el = document.createElementNS(U.SVGNS, 'rect');
  svg.appendChild(el);
  this.render(el, b);
  return el;
};


module.exports = Rectangle;
