var G = require('./geometry');
var Text = require('./text');
var U = require('./utils');
var Node = require('./node');
var _ = require('underscore');

/**
 * HTML node class
 * @param {[type]} viewGraph [description]
 */
var HTMLNode = function(viewGraph) {

  Node.call(this, viewGraph);
  this.typeName = "HTMLNode";

  // HTML nodes always have zero stroke width so that connectors snap
  // exactly to our border
  this.strokeWidth = 0;
  this.template = 'htmlbox-template';

};

U.extends(Node, HTMLNode);

/**
 * add our out bound edges to the serializable version of the node
 * @param {Object} o - object that carries our serializable properties
 */
HTMLNode.prototype.addPropertiesToObject = function(o) {

  // base class
  Node.prototype.addPropertiesToObject.call(this, o);

  // selector for our template must be serialized
  o.template = this.template

};

/**
 * load bitmap when our URI is set
 */
HTMLNode.prototype.set = function(obj) {

  // don't allow certain properties to be set on HTML
  delete obj.fill;
  delete obj.stroke
  delete obj.strokeWidth;
  delete obj.text;

  // base class does the rest
  Node.prototype.set.call(this, obj);
};

module.exports = HTMLNode;
