var CanvasShape = require('./canvasshape');
var G = require('../../geometry');

/**
 * group rectangle shape
 */
var Group = function() {
  CanvasShape.apply(this, arguments);
};

Group.prototype = Object.create(CanvasShape.prototype);

Group.prototype.render = function (c, b) {

};

/**
 *  group rectangle hard points
 */
Group.prototype.hardPoints = function () {

  return [
    new G.Vector2D(0.5, 0.5),
    new G.Vector2D(0, 0),
    new G.Vector2D(0, 1),
    new G.Vector2D(1, 0),
    new G.Vector2D(1, 1)
  ];
};

module.exports = Group;
