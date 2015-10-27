var _ = require('underscore');
var uuid = require('node-uuid');

var str = require('./underscore.string');
var G = require('./geometry');
var Group = require('./group');
var Node = require('./node');
var Text = require('./text');
var U = require('./utils');
var C = require('./viewgraph_consts');
var Connection = require('./connection');


/**
 * construct with options
 * @param options
 * @constructor
 */
var ViewGraph = function(options) {

  // mixin underscore.string with underscore, this should happen at app startup
  _.mixin(str.exports());

  // all viewgraphs start with new uuid, but it might be overwritten
  // if we are restored from the server

  this.uuid = uuid.v4();

  // apply options to this....
  _.extend(this, options);

  // root of the scene graph it its own element with a transformable
  // node which is the parent of all visible nodes in the graph
  this.el = document.createElement('div');
  this.el.classList.add('ViewGraph');
  this.el.setAttribute('spellcheck', 'false');

  // create appropriate type of user interface using given constructor
  this.ui = this.uiCtor ? new this.uiCtor(this) : null;

  // create empty graph, with a single, dimensionless root node
  this.root = new Node(this);
  this.root.flags = Node.Flags.Root;
  this.root.set({
    width: 0,
    height: 0
  });

  // insert before UI if present
  if (this.ui) {
    this.el.insertBefore(this.root.el, this.ui.el);
  } else {
    this.el.appendChild(this.root.el);
  }
  // inject ourselves into the given parent element
  this.parent.appendChild(this.el);

  // initialize view scale
  this.setScale(1);

  // finally update all transforms etc from root to leaves
  this.root.updateBranch();

};

/**
 * remove the given nodes from the graph
 * @return {[type]} [description]
 */
ViewGraph.prototype.removeNodes = function(list) {

  // clear selections since they may contain some of the nodes
  if (this.ui) {
    this.ui.setSelections();
  }

  // dispose will break connections, remove from parent etc
  list.forEach(function(n) {
    n.dispose();
  });

  // update root
  this.root.updateBranch();
};


/**
 * return an array of serialized nodes, given a set of nodes.
 * This is the basis of cut/copy operations, clone etc, snippets etc
 * @param  {[type]} nodes [description]
 * @return {[type]}       [description]
 */
ViewGraph.prototype.copyNodes = function(nodes) {

  U.ASSERT(nodes && nodes.length, 'did not expect an empty list');

  // first just create a serialized list of the given nodes and their children.
  var list = nodes.map(function(node) {
    return node.toObject();
  });

  // build a hash of all the nodes UUID's in the given nodes, we use this to identify connections
  // that reference nodes that are not part of the hash

  var map = {};
  var stack = [list[0]];
  while (stack.length) {
    var n = stack.pop();
    map[n.uuid] = n.uuid;
    stack = stack.concat(n.nodes);
  }

  // now that we have a complete map we can traverse again and replace not
  // only the UUIDs but also references to nodes that may occur e.g.
  // in the start / end connections of smart connectors.
  // NOTE: If a smart connector references a node that is not in the map
  // that connnection is removed, leaving the start/end point as just a global
  // point. In this way copied nodes list are completely self referential and
  // can therefore we transfered between graphs etc.

  stack = [list[0]];
  while (stack.length) {
    var n = stack.pop();

    // verify that start/end connections and remove as necessary
    if (n.startConnection) {
      U.ASSERT(n.typeName === 'SmartConnector', 'expected a smart connector');
      // is the start connection source node and destination node in the map?
      if (!map[n.startConnection.src] || !map[n.startConnection.dst]) {
        delete n.startConnection;
        U.ASSERT(n.start, 'expected a global start position to be present');
      }
    }

    // repeat for end connection
    if (n.endConnection) {
      U.ASSERT(n.typeName === 'SmartConnector', 'expected a smart connector');
      // is the start connection source node and destination node in the map?
      if (!map[n.endConnection.src] || !map[n.endConnection.dst]) {
        delete n.endConnection;
        U.ASSERT(n.end, 'expected a global start position to be present');
      }
    }

    stack = stack.concat(n.nodes);
  }

  return list;
};

/**
 * operates on the data created by copyNodes. Replaces all UUIDs, including
 * references in connection objects with new UUIDs. This is necessary when
 * repeatedly pasting a block of nodes to ensure that end up with unique identifiers
 * @param  {[type]} nodes [description]
 * @return {[type]}       [description]
 */
ViewGraph.prototype.replaceUUIDs = function(list) {

  // build a hash of existing UUID's and their replacements
  var map = {};
  var stack = [list[0]];
  while (stack.length) {
    var n = stack.pop();
    map[n.uuid] = uuid.v4();
    stack = stack.concat(n.nodes);
  }

  // now update all the nodes and connections
  stack = [list[0]];
  while (stack.length) {
    var n = stack.pop();

    n.uuid = map[n.uuid];

    // verify that start/end connections and remove as necessary
    if (n.startConnection) {
      n.startConnection.src = map[n.startConnection.src];
    }
    if (n.endConnection) {
      n.endConnection.src = map[n.endConnection.src];
    }

    stack = stack.concat(n.nodes);
  }
};


/**
 * create a new group node for the given nodes and move them to the group
 * @param {[Nodes]} a - array of view graph nodes to group
 * @return Node - the new group node
 */
ViewGraph.prototype.groupNodes = function(a) {

  U.ASSERT(a && a.length, "Bad parameter");

  // first we should ungroup any groups within the selection.
  // Then we everything can be recombined in the new group if any
  var groupies = [];
  a.forEach(function(node) {

    if (node.hasFlags(Node.Flags.Group)) {
      groupies = groupies.concat(this.ungroupNodes([node]));
    } else {
      if (!node.hasFlags(Node.Flags.Connector)) {
        groupies.push(node);
      }
    }

  }, this);

  // accumulate the AABB for all the nodes to be grouped
  var groupAABB = null;

  groupies.forEach(function(node) {
    node.update();
    var nodeAABB = node.getAABB();
    groupAABB = groupAABB ? groupAABB.union(nodeAABB) : nodeAABB;

  }, this);

  // if nothing to group we are done
  if (!groupies.length) {
    return null;
  }

  // create new group node

  var groupNode = new Group(this);
  groupNode.set({
    parent: this.root,
    name: 'group'
  });


  // set geometry for group node and adjust the translation of each
  // node so it is relative to the new group
  groupNode.set({
    translate: groupAABB.center,
    width: groupAABB.width,
    height: groupAABB.height
  });

  // add each groupies to the group node and adjust its translation accordinginly

  groupies.forEach(function(node) {

    U.ASSERT(node.parent, "Node has no parent");
    node.detach();

    node.set({
      parent: groupNode
    });

    // move to new location in group node
    node.moveTo(node.transform.translate.sub(groupAABB.topLeft));

  }, this);

  return groupNode;

};

/**
 * ungroup the nodes by moving them back to the root
 * @param node
 * @return {[Array]Node} - the ungrouped nodes
 */
ViewGraph.prototype.ungroupNodes = function(a) {

  // bail if no nodes
  if (!a || !a.length) {
    return [];
  }

  // the list may contain several group nodes, return a list of all nodes that
  // were ungroup

  var groupies = [];

  a.forEach(function(groupNode) {

    if (groupNode.hasFlags(Node.Flags.Group)) {

      // work on a copy of the child list since we are going to modify
      _.each(groupNode.children.slice(), function(child) {

        // return the child to world space, the procedure for this may vary by type e.g. lines
        // and rectangles

        child.ungroup();

        groupies.push(child);

      }, this);

      // remove the group node
      groupNode.dispose();

    }
  }, this);

  return groupies;

};

/**
 * when the user makes multiple selections temporary groups are formed. This method ungroups
 * all temporary groups e.g. when the user clicks outside the group
 */
ViewGraph.prototype.ungroupTemporaryGroups = function() {

  this.root.children.forEach(function(node) {
    if (node.hasFlags(Node.Flags.Group, Node.Flags.TGroup)) {
      var ungrouped = this.ungroupNodes([node]);
      // update the ungrouped
      ungrouped.forEach(function(n) {
        n.update();
      });
    }
  }, this);
};

/**
 * the visible quadrant of the graph is the lower right ( positive )
 * quadrant ( since nodes are transformed via the center and we always
 * want 0,0 at top left ).
 */
ViewGraph.prototype.updateGraphSize = function() {

  // set size of graph element to accommodate width/height * scale
  // 2px is added to accomodate the bottom/right borders which, to the user
  // appear to be part of the grid

  var w = this.width * this.scale,
    h = this.height * this.scale;

  this.el.style.width = w + 'px';
  this.el.style.height = h + 'px';

  if (this.ui) {
    this.ui.updateGraphSize(w, h);
  }

};

/**
 * traverse a branch of the graph from the given start node. Traversal is depth first.
 * The iteratee function is invoked for every node encountered.
 * If the filter function is supplied only nodes that pass the filter ( filter returns true )
 * will be traversed. NOTE, however that children of filtered nodes will still be traversed
 * although they may also be filtered by the same function.
 *
 * Order of traversal is inOrder. Contract with traverseDepthFirst.
 *
 * Traversal can be aborted by returning a truthy value.
 * Children are traversed in Z Order which is the reverse of the order
 * of the .children array of each node
 *
 * @param {Node} start - root of traversal
 * @param {Function} iteratee - callback for each node
 * @param {Function} filter - optional function that if provided will be called per node. Returning
 *                             true means the node should be passed to the iteratee.
 * @param {Function} childFilter - optional function. If provided it will be called before adding the children
 *                                 of a node to the traversal. It should return true to include the children
 *                                 or false to exclude them.
 */
ViewGraph.prototype.traverseInOrder = function(start, iteratee, filter, childFilter) {

  U.ASSERT(start && iteratee, "Bad parameter");

  var stack = [start];
  while (stack.length) {

    // iterate top of stack
    var n = stack.pop();

    if (!filter || filter.call(this, n)) {
      // invoke iteratee and abort if a truthy value is returned
      if (iteratee.call(this, n)) {
        return;
      }
    }
    // add children to traversal honoring the filter if present
    if (!childFilter || childFilter.call(this, n)) {
      stack = stack.concat(n.children.slice().reverse());
    }
  }
};

/**
 * flatten a node or array of nodes, return the nodes and all contained children
 * @return {Array of Node}
 */
ViewGraph.prototype.flattenNodes = function(a) {

  var flatList = [];
  var nodes = _.isArray(a) ? a : [a];
  nodes.forEach(function(node) {
    this.traverseInOrder(node, function(n) {
      flatList.push(n);
    }, function(n) {
      // ignore the root
      return !n.hasFlags(Node.Flags.Root);
    });
  }, this);

  return flatList;
};

/**
 * get the AABB for all nodes in the graph. If no nodes are present the returned value is null
 * @return {G.Box}
 */
ViewGraph.prototype.getAABB = function() {

  var box;
  this.traverseInOrder(this.root, function(n) {

    box = box ? box.union(n.getAABB()) : n.getAABB();

  }, function(n) {

    // ignore the root, it always has bounds of 0,0,0,0
    return !n.hasFlags(Node.Flags.Root);

  });
  return box;
};

/**
 * find node with given UUID and return it or null
 * @param  {String} uuid
 * @return {Node | null}
 */
ViewGraph.prototype.findNodeByUUID = function(uuid) {

  var node = null;
  this.traverseInOrder(this.root, function(n) {
    if (n.uuid === uuid) {
      node = n;
      return true;
    }
  });
  return node;
};

/**
 * set view scale of graph, which changes the size of the element that the graph is rendered into
 * @param v
 */
ViewGraph.prototype.setScale = function(v) {

  // scaling is applied to the root node of the graph BUT not by the usual
  // transform property. View transformation does not get inserted into the graph data.

  //this.scale = Math.max(G.MIN_SCALE, Math.min(G.MAX_SCALE, v));
  this.scale = v;
  this.updateGraphSize();

};

/**
 * return our limits as a box
 * @return {G.Box}
 */
ViewGraph.prototype.getBounds = function() {
  return new G.Box(0, 0, this.width, this.height);
};

/**
 * true if the node is partially within the graph
 * @return {Boolean} [description]
 */
ViewGraph.prototype.isNodeVisible = function(node) {

  var b1 = this.getBounds();
  var b2 = node.getAABB().inflate(C.SW, C.SW);
  return !!b1.intersectWithBox(b2);
};

/**
 * adjust position of all immediate children of the root so that the graph
 * is nicely positioned at the top left of the coordinate space.
 * @return {[type]} [description]
 */
ViewGraph.prototype.normalizeGraph = function() {

  // get the AABB of all visible elements
  var aabb = this.getAABB();

  // if no visible elements nothing to do
  if (!aabb || aabb.width === 0 || aabb.height === 0) {
    return;
  }

  // inflate to accommodate strokes etc
  aabb = aabb.inflate(C.SW, C.SW);

  // move all elements that are immediate children of the root to the top left.
  // All others will be children of these and will move with them.
  this.root.children.forEach(function(n) {
    n.moveTo(n.transform.translate.sub(new G.Vector2D(aabb.x, aabb.y)));
  }, this);

  // update connections on all nodes
  this.traverseInOrder(this.root, function(n) {
    n.updateConnections();
  });

  // set graph limits
  this.width = aabb.width;
  this.height = aabb.height;
  this.updateGraphSize();
};

/**
 * return size of the window
 * @return {[type]} [description]
 */
ViewGraph.prototype.windowSize = function () {
  return new G.Vector2D(this.el.parentElement.clientWidth, this.el.parentElement.clientHeight);
};

/**
 * optimize the view scaling of the graph to fit the available
 * space without altering the aspect ratio
 * @return {[type]} [description]
 */
ViewGraph.prototype.scaleToWindow = function() {

  var b = this.getBounds(), w = this.windowSize();
  var size = G.Vector2D.scaleToWindow(b.w, b.h, w.x, w.y, true);

  // apply necessary scale to graph
  this.setScale(size.x / b.w);
};

/**
 * get a matrix representing the current view transforms. This is applied
 * to the root node which is dimensionless and positioned at 0,0
 */
ViewGraph.prototype.getViewMatrix = function() {

  var t = new G.Transform2D();
  t.scale = new G.Vector2D(this.scale, this.scale);
  return t.getTransformationMatrix(0, 0);

};

/**
 * true if the graph has no nodes other than root
 * @return {Boolean} [description]
 */
ViewGraph.prototype.isEmpty = function () {
  return this.root.children.length === 0;
};

/**
 * dispose
 */
ViewGraph.prototype.dispose = function() {

  U.ASSERT(!this.disposed, "ViewGraph already disposed");

  // dispose UI if there is one
  if (this.ui) {
    this.ui.dispose();
    this.ui = null;
  }

  // dispose root node ( and recursively, all child nodes )
  this.root.dispose();
  if (this.el.parentNode) {
    this.el.parentNode.removeChild(this.el);
  }

  this.el = null;
  this.disposed = true;
};

/**
 * return an object that can be serialized as JSON and saved locally or via an
 * end points
 * @return {Object}
 */
ViewGraph.prototype.toObject = function () {

  var o = {};
  o.width = this.width;
  o.height = this.height;
  o.uuid = this.uuid;
  o.root = this.root.toObject();
  return o;
};

/**
 * deserialize from an object constructed by toObject
 */
ViewGraph.prototype.fromObject = function (o) {

  U.ASSERT(U.IS_POSITIVE_NUMBER(o.width), "Bad width");
  U.ASSERT(U.IS_POSITIVE_NUMBER(o.height), "Bad height");

  this.width = o.width;
  this.height = o.height;

  this.uuid = o.uuid;

  U.ASSERT(o.root, "No root node found");

  // deserialize and replace current root with the new one
  var newRoot = Node.fromObject(o.root, this);
  this.el.replaceChild(newRoot.el, this.root.el);
  this.root = newRoot;
  this.root.flags = Node.Flags.Root;

  // at this point any connections would have been deseralized an literal objects
  // with UUID's in place of actual nodes. We must replace those with actual nodes
  this.reviveConnections();

  // complete by updating to graph size and rendering entire graph from the root.
  this.updateGraphSize();
  this.root.updateBranch();

};


/**
 * revive connection objects from literal objects created by toObject
 * @return {[type]} [description]
 */
ViewGraph.prototype.reviveConnections = function () {

  var stack = [this.root];
  while (stack.length) {
    var n = stack.pop();
    if (n.hasFlags(Node.Flags.Connector)) {
      if (n.startConnection) {
        n.startConnection = Connection.fromObject(n.startConnection, this);
      }
      if (n.endConnection) {
        n.endConnection = Connection.fromObject(n.endConnection, this);
      }
    }
    stack = stack.concat(n.children);
  }
};


module.exports = ViewGraph;
