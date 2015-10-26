var D = require('../../dutils');
var G = require('../../geometry');
var S = require('./svgshape');

var SmartConnector = function() {
  S.SvgShape.apply(this, arguments);
};

SmartConnector.prototype = Object.create(S.SvgShape.prototype);

/**
 * render a smart connector polyline as a path with optional rounded corners
 * @param  {G.Box} b - bounds of rendering area
 */
SmartConnector.prototype.render = function (b) {

  if (!this.pathEl) {
    this.pathEl = D.appendString(this.el, '<path/>');
  }

  // get node route offset to include our rendering box
  var p = this.node.route.map(function(point) {
    return point.add(b.topLeft);
  });

  // inset from start/end by a small amount to accommodate markers
  var ms = this.node.markerSize();
  G.insetPath(p, ms.x, ms.x);

  // convert to a path element, either orthogonal of with rounded corners
  var d = false ? this.pointsToPathData(p) : this.pointsToPathWithCurvedCorners(p);

  // attach path to our element
  this.pathEl.setAttribute('d', d);

  // no fill required
  this.noFill();

  // add markers as required
  this.updateStartMarker(this.pathEl);
  this.updateEndMarker(this.pathEl);

  return this.pathEl;
};

/**
 * hard points are empty
 */
SmartConnector.prototype.hardPoints = function () {
  return [];
};

module.exports = SmartConnector;
