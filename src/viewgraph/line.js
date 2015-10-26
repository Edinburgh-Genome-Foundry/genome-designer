var G = require('./geometry');
var Node = require('./node');
var U = require('./utils');
var viewGraphConsts = require('./viewgraph_consts');
var _ = require('underscore');

/**
 * simple straight line class
 * @param {[type]} viewGraph [description]
 */
var Line = function (viewGraph) {
  Node.call(this, viewGraph);
  this.typeName = "Line";
  // end/start marker styles for lines / connectors
  this.endMarkerStyle = viewGraphConsts.markerStyles.arrow;
  this.startMarkerStyle = viewGraphConsts.markerStyles.arrow;

};

U.extends(Node, Line);

/**
 * a line bounds already includes the stroke, so this pass
 * through to the stroke-less test
 */
Line.prototype.containsGlobalPointWithStroke = function (p) {
  return Node.prototype.containsGlobalPoint.call(this, p);
};

/**
 * add our line object to the serializable version of the node
 * @param {Object} o - object that carries our serializable properties
 */
Line.prototype.addPropertiesToObject = function (o) {

  // base class
  Node.prototype.addPropertiesToObject.call(this, o);
  // line
  o.line = this.line.toObject();
  // start/end marker styles
  o.startMarkerStyle = this.startMarkerStyle;
  o.endMarkerStyle = this.endMarkerStyle;
};

/**
 * for snapping lines return end points not AABB edges
 */
Line.prototype.getYSnaps = function () {
  return [this.line.start.y, this.line.end.y];
};

/**
 * likewise for x
 * @return {[type]} [description]
 */
Line.prototype.getXSnaps = function () {
  return [this.line.start.x, this.line.end.x];
};

/**
 * update line via new center point
 */
Line.prototype.moveTo = function (p) {

  // apply delta to line end points
  var delta = p.sub(this.transform.translate);
  this.line.start = this.line.start.add(delta);
  this.line.end = this.line.end.add(delta);

  // transform must be update to date when leaving this method
  this.updateTransform();

};

/**
 * ungroup a line. We need to find the current center point and length of
 * the line and reposition in world space accordingly by calculating the world
 * space end points of the line.
 */
Line.prototype.ungroup = function () {

  var m = this.getTransformationMatrix();
  var tm = G.Matrix2D.translate(this.width / 2, this.height / 2);
  m = m.multiplyMatrix(tm);

  // find start,end in world space using inverse world matrix

  this.line.start = m.multiplyVector(new G.Vector2D(-(this.width / 2), 0));
  this.line.end = m.multiplyVector(new G.Vector2D(this.width / 2, 0));

  this.detach();
  this.appendTo(this.viewGraph.root);
};

/**
 * inherit so we can have our line object set
 */
Line.prototype.set = function (obj) {

  Node.prototype.set.call(this, obj);

  _.each(obj, function (value, key) {

    switch (key) {
    case "line":
      this.line = G.LineSegment.fromObject(value);
      break;
    }

  }, this);
};

/**
 * adjust rectangle so that it is appropriate for the line
 */
Line.prototype.update = function () {

  // transform is derived from line
  this.updateTransform();

  // base class updates rectangle display properties
  Node.prototype.update.call(this);
};

/**
 * transform update is extract from update method here so we update it without
 * updating our appearance. Necessary for function like moveTo to work correctly
 */
Line.prototype.updateTransform = function () {

  // width is length of line, height is thickness
  this.width = this.line.len();
  this.height = Math.max(viewGraphConsts.MIN_LINEHEIGHT, this.strokeWidth);

  // mid point of line is our translation
  this.transform.translate = this.line.pointOnLine(0.5);

  // rotation is angle between end points
  this.transform.rotate = this.line.start.angleBetween(this.line.end);
};

/**
 * return the required size of the end cap markers, derived from the
 * current strokeWidth of the node
 * @return {[type]} [description]
 */
Line.prototype.markerSize = function() {
  var s = Math.max(8, this.strokeWidth * 2);
  return new G.Vector2D(s, s);
};

module.exports = Line;
