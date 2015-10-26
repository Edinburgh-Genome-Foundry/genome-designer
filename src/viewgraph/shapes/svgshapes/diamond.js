var _ = require('underscore');
var D = require('../../dutils');
var G = require('../../geometry');
var S = require('./svgshape');

var Diamond = function (b) {
  S.SvgShape.apply(this, arguments);
};

Diamond.prototype = Object.create(S.SvgShape.prototype);

Diamond.prototype.render = function(b) {

    if (!this.pathEl) {
      this.pathEl = D.appendString(this.el, '<path/>');
    }

    this._render(this.pathEl, b);
    return this.pathEl;
};

Diamond.prototype._render = function(el, b) {

  el.setAttribute('d', _.sprintf('M %f %f L %f %f L %f %f L %f %f Z', b.cx, b.y, b.r, b.cy, b.cx, b.b, b.x, b.cy));
};

/**
 * make a icon
 * @param  {[type]} b [description]
 * @return {[type]}   [description]
 */
Diamond.prototype.icon = function(svg, b) {

  var el = document.createElementNS(U.SVGNS, 'path');
  svg.appendChild(el);
  this._render(el, b);
  return el;
};

/**
 * rectangle hard points
 */
Diamond.prototype.hardPoints = function () {

  return [
    new G.Vector2D(0.5, 0.5),
    new G.Vector2D(0.5, 0),
    new G.Vector2D(1, 0.5),
    new G.Vector2D(0.5, 1),
    new G.Vector2D(0, 0.5),
  ];
};

module.exports = Diamond;
