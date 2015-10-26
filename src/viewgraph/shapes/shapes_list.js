var Capsule = require('../../lib/shapes/svgshapes/capsule');
var Ellipse = require('../../lib/shapes/svgshapes/ellipse');
var G = require('../../lib/geometry');
var GeometryLine = require('../../lib/viewgraph/line');
var LineGlyph = require('../../lib/shapes/svgshapes/line');
var Lozenge = require('../../lib/shapes/svgshapes/lozenge');
var Node = require('../../lib/viewgraph/node');
var HTMLNode = require('../../lib/viewgraph/htmlnode');
var Line = require('../../lib/viewgraph/line');
var SmartConnector = require('../../lib/viewgraph/smartconnector');
var Rectangle = require('../../lib/shapes/svgshapes/rectangle');
var SmartConnectorGlyph = require('../../lib/shapes/svgshapes/smartconnector');
var Diamond = require('../../lib/shapes/svgshapes/diamond');
var Parallelogram = require('../../lib/shapes/svgshapes/parallelogram');
var Star = require('../../lib/shapes/svgshapes/star');
var RightArrow = require('../../lib/shapes/svgshapes/rightarrow');
var RightRibbon = require('../../lib/shapes/svgshapes/rightribbon');
var LeftRibbon = require('../../lib/shapes/svgshapes/leftribbon');
var Triangle = require('../../lib/shapes/svgshapes/triangle');


/**
 * canonical list of shapes available
 * @type {Array}
 */
var ShapesList = [{
    name: "Rectangle",
    node: Node,
    glyph: "Rectangle",
    geometry: new G.Box(-50, -50, 100, 100)
  }, {
    name: "Diamond",
    node: Node,
    glyph: "Diamond",
    geometry: new G.Box(-50, -50, 100, 100)
  }, {
    name: "Parallelogram",
    node: Node,
    glyph: "Parallelogram",
    geometry: new G.Box(-75, -50, 150, 100)
  }, {
    name: "Triangle",
    node: Node,
    glyph: "Triangle",
    geometry: new G.Box(-50, -50, 100, 100)
  }, {
    name: "SVG-Line",
    node: Line,
    glyph: "Line",
    geometry: new G.LineSegment(new G.Vector2D(-100,0), new G.Vector2D(100,0))
  }, {
    name: "Right Arrow",
    node: Node,
    glyph: "RightArrow",
    geometry: new G.Box(-100,-50, 200, 50)
  }, {
    name: "Ellipse",
    node: Node,
    glyph: "Ellipse",
    geometry: new G.Box(-50, -50, 100, 100)
  }, {
    name: "SmartConnector",
    node: SmartConnector,
    glyph: "SmartConnector",
    geometry: [new G.Vector2D(-100,-100), new G.Vector2D(100,100)]
  }, {
    name: "Star",
    node: Node,
    glyph: "Star",
    geometry: new G.Box(-50, -50, 100, 100)
  }, {
    name: "RightRibbon",
    node: Node,
    glyph: "RightRibbon",
    geometry: new G.Box(-200, -50, 200, 50)
  }, {
    name: "LeftRibbon",
    node: Node,
    glyph: "LeftRibbon",
    geometry: new G.Box(-200, -50, 200, 50)
  }, {
    name: "Capsule",
    node: Node,
    glyph: "Capsule",
    geometry: new G.Box(-75, -25, 150, 50)
  }, {
    name: "Lozenge",
    node: Node,
    glyph: "Lozenge",
    geometry: new G.Box(-100, -50, 100, 100)
  }, {
    name: "HTML Box",
    node: HTMLNode,
    glyph: "HTMLShape",
    geometry: new G.Box(-200, -100, 200, 100)
  }
];

module.exports = ShapesList;
