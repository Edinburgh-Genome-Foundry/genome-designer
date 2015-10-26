// svg shape types
var Rectangle = require('./svgshapes/rectangle');
var Capsule = require('./svgshapes/capsule');
var Diamond = require('./svgshapes/diamond');
var Ellipse = require('./svgshapes/ellipse');
var Line = require('./svgshapes/line');
var Lozenge = require('./svgshapes/lozenge');
var Parallelogram = require('./svgshapes/parallelogram');
var RightArrow = require('./svgshapes/rightarrow');
var SmartConnector = require('./svgshapes/smartconnector');
var Star = require('./svgshapes/star');
var RightRibbon = require('./svgshapes/rightribbon');
var LeftRibbon = require('./svgshapes/leftribbon');
var Triangle = require('./svgshapes/triangle');
var HTMLShape = require('./htmlshapes/htmlshape');

// canvas shapes
var Group = require('./canvasshapes/group');


module.exports = function(name, node) {

  switch (name) {
    case 'Rectangle': return new Rectangle(node);
    case 'Capsule': return new Capsule(node);
    case 'Diamond': return new Diamond(node);
    case 'Ellipse': return new Ellipse(node);
    case 'Line': return new Line(node);
    case 'Lozenge': return new Lozenge(node);
    case 'Parallelogram': return new Parallelogram(node);
    case 'RightArrow': return new RightArrow(node);
    case 'SmartConnector': return new SmartConnector(node);
    case 'Star': return new Star(node);
    case 'RightRibbon': return new RightRibbon(node);
    case 'LeftRibbon': return new LeftRibbon(node);
    case 'Triangle': return new Triangle(node);
    case 'Group': return new Group(node);
    case 'HTMLShape' : return new HTMLShape(node);
    default: {
      throw new Error('Unknown Glyph Name:' + name);
    }
  }
};
