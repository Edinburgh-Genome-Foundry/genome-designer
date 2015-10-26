
var Node = require('./node');
var U = require('./utils');

/**
 * a group is a rectangular node that can parent other nodes. It has no visual appearance
 * but it does have a glyph so it can have hard points etc.
 */

var Group = function (viewGraph) {
  Node.call(this, viewGraph);
  this.typeName = "Group";
  this.set({
    glyph: 'Group'
  });
  // flag as a group
  this.flags = Node.Flags.Group;
};

U.extends(Node, Group);

/**
 * shortcut for testing if the group is temporary
 * @return {Boolean} [description]
 */
Group.prototype.isTemporary = function () {
  return this.hasFlags(Node.Flags.TGroup);
};

/**
 * flag the group as temporary
 */
Group.prototype.setTemporary = function () {
  this.addFlags(Node.Flags.TGroup);
};
/**
 * unflag the group as temporary
 */
Group.prototype.unsetTemporary = function () {
  this.removeFlags(Node.Flags.TGroup);
};

module.exports = Group;
