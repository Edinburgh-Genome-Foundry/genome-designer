var Color = require('./color');
var G = require('./geometry');
var U = require('./utils');
var C = require('./viewgraph_consts');
var _ = require('underscore');

/**
 * a color gradient, which requires at least two colors
 * and two color stops
 */
var Gradient = function () {
  // each step is a color and a parameteric value 0..1 e..g {color: c, stop: 0.5}
  this.steps = [];
};


/**
 * add a color and its position
 * @param {Color || String} color
 * @param {Number} stop
 */
Gradient.prototype.addColorStop = function (stop, color) {

  U.ASSERT((U.IS_A(color, Color) || _.isString(color)) && U.IS_NUMBER(stop) && stop >= 0 && stop <= 1, "Bad parameters");

  this.steps.push({
    color: new Color(color.toString()),
    stop: stop
  });

  // keep steps sorted
  this.steps.sort(function (a, b) {
    return a.stop - b.stop;
  });

};

/**
 * clone a gradient, creating new color instances to ensure a deep copy
 * @param  {Gradient} g
 * @return {Gradient}
 */
Gradient.prototype.clone = function (g) {

  var g = new Gradient();
  g.steps = this.steps.map(function(step) {
    return {
      color: step.color.clone(),
      stop: step.stop
    }
  });
  return g;
};

/**
 * return a linear gradient object for a canvas given the context and the bounds
 * @param  {[type]} box [description]
 * @return {[type]}     [description]
 */
Gradient.prototype.canvasLinearGradient = function (context, box) {

  var lg = context.createLinearGradient(box.x, box.y, box.r, box.b);
  this.steps.forEach(function(step) {
    lg.addColorStop(step.stop, step.color.toString());
  });
  return lg;
};

/**
 * apply to the given svg linearGradient element and the given box
 * @param  {[type]} gradientEl [description]
 * @param  {[type]} box        [description]
 * @return {[type]}            [description]
 */
Gradient.prototype.svgLinearGradient = function(gradientEl, box) {

  // set limits of gradient, these are expressed a normalized values 0..1, however
  // we have been passed a pixel box representing the rendering area. We must convert
  // allowing for the stroked border
  var totalWidth = box.w + C.SW;
  var totalHeight = box.h + C.SW;

  gradientEl.setAttribute('x1', box.x / totalWidth);
  gradientEl.setAttribute('y1', box.y / totalHeight);
  gradientEl.setAttribute('x2', box.r / totalWidth);
  gradientEl.setAttribute('y2', box.b / totalHeight);

  // replace all current stop elements
  while (gradientEl.firstChild) {
    gradientEl.removeChild(gradientEl.firstChild);
  }

  // add stop element for each color/stop
  this.steps.forEach(function(step) {
    var stopEl = document.createElementNS(U.SVGNS, 'stop');
    stopEl.setAttribute('offset', step.stop * 100 + '%');
    stopEl.setAttribute('stop-color', step.color.toCSSHex());
    stopEl.setAttribute('stop-opacity', step.color.A);
    gradientEl.appendChild(stopEl);

  });
};

/**
 * serialization
 * @return {Object}
 */
Gradient.prototype.toObject = function () {

  return {
    colors: this.steps.map(function (step) {
      return step.color.toString()
    }),
    stops: this.steps.map(function (step) {
      return step.stop;
    })
  }
};

/**
 * [fromObject description]
 * @param  {Object} obj
 * @return {Gradient}
 */
Gradient.fromObject = function (obj) {

  // if given a Gradient then just clone it
  if (U.IS_A(obj, Gradient)) {
    return obj.clone();
  }

  // from a serialized object
  U.ASSERT(obj && obj.colors && obj.stops && obj.colors.length === obj.stops.length, "Bad parameters");

  var g = new Gradient();
  for (var i = 0; i < obj.colors.length; i += 1) {
    g.addColorStop(obj.stops[i], obj.colors[i]);
  }
  return g;
};

/**
 * fromString e.g. 0/green/1/red
 * @param  {Object} obj
 * @return {Gradient}
 */
Gradient.fromString = function (str) {

  var a = str.split('/');
  var g;

  if (a.length >= 4 && (a.length & 1) === 0) {

    var g = new Gradient();
    for (var i = 0; i < a.length; i += 2) {
      g.addColorStop(parseFloat(a[i]), new Color(a[i+1]));
    }

  }

  return g;
};

/**
 * gradients must have at least two colors, with first and last stops being 0 and 1 respectively
 * @return {[type]} [description]
 */
Gradient.prototype.validate = function () {

  U.ASSERT(this.steps.length >= 2);
  U.ASSERT(this.steps[0].stop === 0);
  U.ASSERT(this.steps[this.steps.length - 1].stop === 1);

};

// http://stackoverflow.com/questions/9025678/how-to-get-a-rotated-linear-gradient-svg-for-use-as-a-background-image

module.exports = Gradient;
