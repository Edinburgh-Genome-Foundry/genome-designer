var G = require('../../geometry');
var Shapes = require('../shape');
var U = require('../../utils');
var D = require('../../utils');
var C = require('../../viewgraph_consts');
var _ = require('underscore');


/**
 * base class for html shapes. Given that the functionality is defined
 * by a template selector ( string ) it is usually not necessary to inherit
 * from this class to create instances with different appearances and functionality.
 * @constructor
 */
var HTMLShape = function (node) {
  Shapes.Generic.call(this, node);
  // our top level element is just a div to which our actual template will get attached
  this.el = document.createElement('div');
  this.el.classList.add('html-shape');

  // append to node parent .
  this.node.el.appendChild(this.el);
};

U.extends(Shapes.Generic, HTMLShape);

/**
 * update rendering to current state of node
 */
HTMLShape.prototype.update = function () {
  var b = new G.Box(0, 0, this.node.width, this.node.height);
  this.render(b);
};

/**
 * clone a template and return the top level element
 */
HTMLShape.prototype.updateTemplate = function () {

  // must have a template
  U.ASSERT(this.template, 'expected a template');

  // construct the selector
  var selector = _.sprintf('[data-template="%s"]', this.template);

  // templates should all be in the this element
  var templates = document.querySelector('[data-element="component-templates"]');

  // clone template
  var el = templates.querySelector(selector).cloneNode(true);

  // remove the data-template attribute to avoid confusion
  el.removeAttribute('data-template');

  // remove existing DOM
  D.empty(this.el);

  // append to our element
  this.el.appendChild(el);
};

/**
 * to be overridden by subclass
 * returns element
 * @param {Box} b
 * @return {DOM Node}
 */
HTMLShape.prototype.render = function(b) {

  // if we haven't rendered our template yet, or it has changed then
  // instantiate from template.
  if (this.template !== this.node.template) {
    this.template = this.node.template;
    this.updateTemplate();
  }

  this.el.style.left = b.x + 'px';
  this.el.style.top = b.y + 'px';
  this.el.style.width = b.w + 'px';
  this.el.style.height = b.h + 'px';
};

/**
 * rectangle hard points
 */
HTMLShape.prototype.hardPoints = function () {

  return [
    new G.Vector2D(0.5, 0.5),
    new G.Vector2D(0, 0),
    new G.Vector2D(0, 1),
    new G.Vector2D(1, 0),
    new G.Vector2D(1, 1),
    new G.Vector2D(0.5, 0),
    new G.Vector2D(1, 0.5),
    new G.Vector2D(0.5, 1),
    new G.Vector2D(0, 0.5)
  ];
};

module.exports = HTMLShape;
