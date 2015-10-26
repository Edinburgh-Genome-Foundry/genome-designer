var U = require('../utils');

var Shapes = {};

/**
 * base class for the various types of shape e.g. CanvasShape, SvgShape.
 */
Shapes.Generic = function(node) {
  this.node = node;
};

/**
 * called from the nodes editor, return a list of hard points for this shape
 * @return {[Array]G.Vector2D}
 */
Shapes.Generic.prototype.getHardPoints = function() {
  return this.hardPoints();
};

/**
 * return shape matching name
 * @param  {String} shapeName
 * @return {Object} null or the matching shape from Shapes.list
 */
Shapes.getShapeFromName = function(shapeName) {
  return _.find(Shapes.list, function(shape) {
    return shape.name === shapeName;
  });
};


module.exports = Shapes;
