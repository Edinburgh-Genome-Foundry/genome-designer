var _ = require('underscore');
var D = require('./dutils');
var U = require('./utils');
var Events = require('./events');

/**
 * svg wrapper
 * @constructor
 */
var Text = function(node) {

  this.node = node;
  var text = '<div class="textInner"></div>';
  this.el = D.appendString(this.node.el, text);
};

/**
 * update rendering to current state of node
 */
Text.prototype.update = function() {

  // apply our text as the inner HTML of our element
  this.el.innerHTML = this.node.text;

  // background is always transparent
  this.el.style.background = 'transparent';

  // default font size
  this.el.style.fontSize = this.node.fontSize + 'px';

  // default font family
  this.el.style.fontFamily = this.node.font;

  // apply padding equal to the stroke width of the node so that the text
  // is always inset from the stroked outline ( by a minimum of 2px)
  var inset = 2 + Math.ceil(this.node.strokeWidth / 2);
  this.el.style.padding = inset + 'px';

  // get position of text as a percentage of parent width/height which we
  // apply as the left/top properties
  var tcenter = this.node.getTextGlyphCenter();
  this.el.style.left = tcenter.x + '%';
  this.el.style.top = tcenter.y + '%';

  // add drop shadow
  //D.setPrefixedCSS(this.el, 'text-shadow', '3px 3px 2px rgba(0,0,0,0.6)');

  // text can be optionally x axis aligned
  if (this.node.autoRotateText) {

    // get world transform of our node so we can backout the rotation and align to the x-axis

    var m = this.node.getTransformationMatrix();
    var r = m.decomposeRotation();

    // align with x axis
    r = 360 - r;

    // apply as a transform being careful to keep the translateX/Y
    // that is necessary to v center on the parent
    this.el.style.transform = _.sprintf('translateX(-50%%) translateY(-50%%) rotate(%sdeg)', r);

    // auto rotated text is allowed to expand to whatever the text wants
    this.el.style.width = null;
    this.el.style['white-space'] = 'pre';
  } else {
    // non auto rotated text is not constrained to its parent width
    this.el.style.width = this.node.width + 'px';
  }

  // set visibility to hidden if no actual text at this time.
  this.el.style.visibility = this.el.innerText.trim() ? 'visible' : 'hidden';
};



/**
 * TODO, do we need this, isn't just .node.text the same thing
 * return our inner HTML in a serializable form
 * @return {[type]} [description]
 */
Text.prototype.contentToObject = function() {
  return this.el.innerHTML;
};

module.exports = Text;
