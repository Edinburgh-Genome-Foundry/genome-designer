var _ = require('underscore');
var D = require('../../dutils');
var G = require('../../geometry');
var Shapes = require('../shape');
var U = require('../../utils');
var C = require('../../viewgraph_consts');

var S = {};

/**
 * namespace for SVG elements
 * @const {string}
 */
S.SvgShapeNS = 'http://www.w3.org/2000/svg';

/**
 * namespace for xlink element e.g. <use href="xxx"/>
 * NOTE: You must use this or document.setAttributeNS will silently fail
 * @const {string}
 */
S.XLNS = 'http://www.w3.org/1999/xlink';

/**
 *
 * used to uniqueify ID's
 * @type {Number}
 */
S.nextID = 0;

/**
 * svg wrapper
 * @constructor
 */
S.SvgShape = function (node) {

  Shapes.Generic.call(this, node);

  // create SVG tag
  var svg = _.sprintf('<svg xmlns="%s"  xmlns:xlink="%s">', S.SvgShapeNS, S.XLNS);
  this.el = D.appendString(this.node.el, svg);


  // set size/position of SVG to accommodate stroke width in addition to node dimensions
  this.el.style.left = -C.SW * 2 + 'px';
  this.el.style.top = -C.SW * 2 + 'px';

  // init marker styles
  this.markerStyles = [C.markerStyles.none, C.markerStyles.none];
  this.markerEls = [null, null];
};

U.extends(Shapes.Generic, S.SvgShape);

/**
 * update rendering to current state of node
 */
S.SvgShape.prototype.update = function () {

  // dimensions
  this.el.setAttribute('width', this.node.width + C.SW * 4 + 'px');
  this.el.setAttribute('height', this.node.height + C.SW * 4 + 'px');

  // appearance
  this.el.setAttribute('stroke', this.node.stroke);
  if (this.node.fillGradient) {
    // create the fill gradient object in our defs section if not already present
    if (!this.fillGradientEl) {
      this.createDefs();
      this.fillGradientEl = document.createElementNS(S.SvgShapeNS, 'linearGradient');
      // use a unique based in the node id for the gradient
      var id = this.node.uuid + '-' + 'linearGradient';
      this.fillGradientEl.setAttribute('id', id);
      this.defsEl.appendChild(this.fillGradientEl);
    }

    // to apply the gradient we need the actual element that the shape will render.
    // we won't have this until after the shape is rendered

  } else {
    this.el.setAttribute('fill', this.node.fill);
  }
  this.el.setAttribute('stroke-width', this.node.strokeWidth + 'px');

  // make node dimensions easier to access
  this.w = this.node.width;
  this.h = this.node.height;

  //this.showDropShadow();

  // provide a box which is the canvas rectangle that intersects the actual node
  // and does not include the overflow provided for thick strokes
  var b = new G.Box(C.SW * 2, C.SW * 2, this.w, this.h);

  var svgElement = this.render(b);

  if (this.dropShadowID) {
    svgElement.setAttribute('filter', _.sprintf('url(#%s)', this.dropShadowID));
  }

  // now we can apply the fill/stroke gradient if there is one, otherwise
  // remove the fill attribute on the shape
  if (this.node.fillGradient) {
    svgElement.setAttribute('fill', _.sprintf('url(#%s)', this.fillGradientEl.getAttribute('id')));
    this.node.fillGradient.svgLinearGradient(this.fillGradientEl, b);
  } else {
    svgElement.removeAttribute('fill');
  }
};

/**
 * available so that shape glyph methods can prevent filling e.g. for lines, connectors etc
 * @return {[type]} [description]
 */
S.SvgShape.prototype.noFill = function () {
  this.el.setAttribute('fill', 'none');
};

/**
 * create our defs section if it doesn't already exist and return it
 */
S.SvgShape.prototype.createDefs = function () {

  if (!this.defsEl) {
    this.defsEl = document.createElementNS(S.SvgShapeNS, 'defs');
    if (this.el.firstChild) {
      this.el.insertBefore(this.defsEl, this.el.firstChild);
    } else {
      this.el.appendChild(this.defsEl);
    }
  }
  return this.defsEl;
};

/**
 * setup defs section, marker and marker-end tag for the given element and style.
 * If a previous end marker was defined it is removed from the defs section
 */
S.SvgShape.prototype.updateStartMarker = function (el) {
  this.updateMarker(el, this.node.startMarkerStyle, 0);
};
S.SvgShape.prototype.updateEndMarker = function (el) {
  this.updateMarker(el, this.node.endMarkerStyle, 1);
};

/**
 * update start or end marker
 * @param  {[type]} el    [description]
 * @param  {[type]} style [description]
 * @param  {[type]} i     [description]
 * @return {[type]}       [description]
 */
S.SvgShape.prototype.updateMarker = function (el, style, i) {

  U.ASSERT(i >= 0 && i <= 1 && el, "Bad parameter");

  // create the end marker as necessary
  if (style !== this.markerStyles[i]) {

    this.markerStyles[i] = style;
    //this.markerStyles[i] = C.markerStyles.arrow;

    // if there is an existing end marker remove it and nullify
    this.markerEls[i] = D.removeElement(this.markerEls[i]);

    if (this.markerStyles[i] !== C.markerStyles.none) {
      // create the new marker element and attach to our defs section
      this.markerEls[i] = document.createElementNS(U.SVGNS, 'marker');
      this.createDefs().appendChild(this.markerEls[i]);

      // assign a unique ID to the marker
      var id = D.uniqueID(this.node.uuid);
      this.markerEls[i].setAttribute('id', id);

      // set the URL for the end marker in the given element
      el.setAttribute(i ? 'marker-start' : 'marker-end', _.sprintf('url(#%s)', id));

      // always auto orient
      this.markerEls[i].setAttribute('orient', 'auto');

      // we are going to size the markers ourselves, based on stroke size
      this.markerEls[i].setAttribute('markerUnits', 'userSpaceOnUse');
      this.markerEls[i].setAttribute('viewBox', '0 0 2 2');

      // the reference point is the left or right edge of the marker box depending
      // on which end of the line we are
      this.markerEls[i].setAttribute('refX', i ? '2' : '0');
      this.markerEls[i].setAttribute('refY', '1');

      // make geometry / tags as approriate for the required style
      switch (this.markerStyles[i]) {
      case C.markerStyles.circle:
        // create circle tag
        D.appendString(this.markerEls[i], '<circle cx="1" cy="1" r="1" stroke-width="0"/>');

        break;

      case C.markerStyles.square:
        // create circle tag
        D.appendString(this.markerEls[i], '<rect x="0" y="0" width="2" height="2" stroke-width="0"/>');

        break;

      case C.markerStyles.arrow:
        // create circle tag
        var p = _.sprintf('<path d="%s" stroke-width="0"/>', i ? S.SvgShape.startArrowData : S.SvgShape.endArrowData);
        D.appendString(this.markerEls[i], p);

        break;

      default:
        throw new Error("Bad style for end marker");
      }
    }
  }

  if (this.markerEls[i]) {

    var ms = this.node.markerSize();
    this.markerEls[i].setAttribute('markerWidth', ms.x);
    this.markerEls[i].setAttribute('markerHeight', ms.y);

    this.markerEls[i].setAttribute('stroke', this.node.stroke.toString());
    // no fill on shapes with markers
    this.markerEls[i].setAttribute('fill', this.node.stroke.toString());
  }
};

/**
 * path data for SVG arrow markers, start and end point in different directions.
 * The arrows over flow the edge that attaches to the line by 0.1 to ensure their is no
 * visible seam
 * @type {String}
 */
S.SvgShape.startArrowData = 'M 0 1 L 2 0 L 2 2 Z';
S.SvgShape.endArrowData = 'M 2 1 L 0 2 L 0 0 Z';


/**
 * given a set of points/vectors return a string formatted for the 'd' attribute of an SVG <path> tag
 * @param  {Array of .x .y} p
 * @return {String} e.g. "M 0 0 L 1 1 L 2 2 L 3 3"
 */
S.SvgShape.prototype.pointsToPathData = function (p) {
  var d = _.sprintf('M %f %f', p[0].x, p[0].y);
  for (var i = 1; i < p.length; i += 1) {
    d += _.sprintf(' L %f %f', p[i].x, p[i].y);
  }
  return d;
};

/**
 * Same as pointsToPathData but injects quadratic beziers at the corners to rounded them.
 */
S.SvgShape.prototype.pointsToPathWithCurvedCorners = function (p) {

  // you need at least 3 points to add a curved corner
  if (p.length < 3) {
    return this.pointsToPathData(p);
  }

  // move to start of path
  var d = _.sprintf('M %f %f', p[0].x, p[0].y);

  for (var i = 0; i < p.length - 2; i += 1) {

    // get the two line segments we are going to join with a curve
    var s1 = new G.LineSegment(p[i].x, p[i].y, p[i + 1].x, p[i + 1].y);
    var s2 = new G.LineSegment(p[i + 1].x, p[i + 1].y, p[i + 2].x, p[i + 2].y);
    var s1len = s1.len();
    var s2len = s2.len();

    // if either segment is shorter than strokeWidth / 2 then just make
    // an orthogonal connection
    if (s1len < C.SW / 2|| s2len < C.SW / 2) {
      d += _.sprintf(' L %f %f', s1.end.x, s1.end.y);
    } else {

      // calculate the length of the inset for the corners, by default this is G.CURVE_INSET
      // but will never be more than 1/3 the length of either line segment.
      // ( clamp to at least 1.0 to avoid /0 errors )

      var len = Math.max(1, Math.min(C.CURVE_INSET, s1len / 3, s2len / 3));

      // calculate length as parameteric value on each line
      var p1 = len / s1len,
        p2 = len / s2len;

      // line from start of first segment to beginning of curve
      var t = s1.pointOnLine(1.0 - p1);
      d += _.sprintf(' L %f %f', t.x, t.y);
      // curve to a point equidistant along the second segment
      t = s2.pointOnLine(p2);
      d += _.sprintf(' Q %f %f, %f %f', s2.start.x, s2.start.y, t.x, t.y);
    }
  }
  // line to end of path
  d += _.sprintf(' L %f %f', p[p.length - 1].x, p[p.length - 1].y);

  return d;
};

/**
 * just a hack for testing
 * @return {[type]} [description]
 */
S.SvgShape.prototype.showDropShadow = function () {

  if (!this.dropShadowID) {
    this.dropShadowID = D.uniqueID(this.node.uuid);
    this.createDefs().insertAdjacentHTML('afterbegin', S.SvgShape.dropShadowFilter);
    this.dropShadowEl = this.defsEl.firstChild;
    this.dropShadowEl.setAttribute('id', this.dropShadowID);
  }

  // update filter to current width of SVG
  D.setAttributes(this.dropShadowEl, {
    width: this.node.width + C.SW * 4,
    height: this.node.height + C.SW * 4
  });

};

S.SvgShape.dropShadowFilter =
  '<filter filterUnits="userSpaceOnUse" x="0" y="0">' +
  '  <feGaussianBlur in="SourceAlpha" stdDeviation="3" />' +
  '  <feOffset dx="2" dy="4" />' +
  '  <feMerge>' +
  '    <feMergeNode />' +
  '    <feMergeNode in="SourceGraphic" />' +
  '  </feMerge>' +
  '</filter>';

/*
 * to be overridden by subclass
 * returns element
 * @param {Box} b
 * @return {DOM Node}
 */
S.SvgShape.prototype.render = function(b) {
  throw new Error("Implement in inheriting class");
};

module.exports = S;
