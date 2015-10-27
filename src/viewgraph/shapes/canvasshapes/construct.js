var CanvasShape = require('./canvasshape');
var G = require('../../geometry');

/**
 * group rectangle shape
 */
var Construct = function () {
  CanvasShape.apply(this, arguments);

  // make n random spans
  this.totalWidth = 0;
  this.spans = [];
  let n = 20;
  for (let i = 0; i < n; i += 1) {
    let w = 20 + Math.random() * 100;
    this.spans.push(w);
    this.totalWidth += w;
  }
};

Construct.prototype = Object.create(CanvasShape.prototype);

Construct.colors = [
  '#f1faf2',
  '#f9c8cb',
  '#8ca4d4',
  '#cce6bf'
];

Construct.prototype.render = function (c, b) {

  // fill / stroke rectangle
  c.fillRect(b.x, b.y, b.w, b.h);
  c.strokeRect(b.x, b.y, b.w, b.h);

  // scale spans to fit the Box
  let scale = b.w / this.totalWidth;
  let x = 0;
  for(let i = 0; i < this.spans.length; i += 1) {
    c.beginPath();
    c.fillStyle = Construct.colors[i % Construct.colors.length];
    c.strokeStyle = 'black';
    c.lineWidth = 1;
    let w = this.spans[i] * scale;
    c.fillRect(b.x + x, b.y + 0, w, b.h);
    c.strokeRect(b.x + x, b.y + 0, w, b.h);
    x += w;
  }
};

/**
 *  group rectangle hard points
 */
Construct.prototype.hardPoints = function () {

  return [
    new G.Vector2D(0.5, 0.5),
    new G.Vector2D(0, 0),
    new G.Vector2D(0, 1),
    new G.Vector2D(1, 0),
    new G.Vector2D(1, 1)
  ];
};

module.exports = Construct;
