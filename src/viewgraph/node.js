var _ = require('underscore');
var Color = require('color-js');
var D = require('./dutils');
var G = require('./geometry');
var Gradient = require('./gradient');
var GlyphFactory = require('./shapes/glyph_factory');
var Text = require('./text');
var U = require('./utils');
var uuid = require('node-uuid');
var Events = require('./events');

/**
 * base class for all node types in the view graph
 * @constructor
 * @params {ViewGraph} viewGraph - the view graph we belong to
 */
var Node = function (viewGraph) {

  // the graph we are on
  this.viewGraph = viewGraph;

  // node classes must have a unique name so they can be serialized/deserialized
  // and reconstructed via the correct constructor
  this.typeName = "Node";

  // reset flags
  this.flags = Node.Flags.None;

  // create an element with the CSS class ViewGraphNode
  this.el = document.createElement('div');
  this.el.classList.add('ViewGraphNode');

  // create our text element
  this.textGlyph = new Text(this);

  // create UUID
  this.uuid = uuid.v4();
  this.el.setAttribute('data-uuid', this.uuid);

  // start with an empty list of children
  this.children = [];

  // default width and height is zero which make the node basically a point
  this.width = this.height = 0;

  // aspect ratio lock flag
  this.aspectLocked = false;

  // list of hard points by which we are attached to connectors. These are 'in-bound'
  // edges. Only connector types have out bound edges
  this.edgesIn = [];

  // default transform is identity
  this.transform = new G.Transform2D();

  // default appearance is transparent, fully opaque
  this.fill = new Color('transparent');
  this.stroke = new Color('transparent');
  this.strokeWidth = 0;
  this.opacity = 1;

  // test fill gradients

  // this.fillGradient = new Gradient();
  // this.fillGradient.addColorStop(0, "firebrick");
  // this.fillGradient.addColorStop(1, "dodgerblue");
  //

  // default text
  this.text = '';
  this.color = new Color('black');
  this.fontSize = 20;
  this.autoRotateText = false;
  this.textBackground = 'transparent';

  // editor object when editing
  this.editor = null;
};

/**
 * flags for view graph nodes
 * @type {{}}
 */
Node.Flags = {
  None: 0,
  Root: 1, // this node is the root node
  Group: 2, // this node is a group node,
  TGroup: 4, // identifies a temporary group used to group say user selections on the page
  Connector: 8 // indicates a type of connector
};

/**
 * return string representation of nodes bit flags
 * @param  {[type]} f [description]
 * @return {[type]}   [description]
 */
Node.FlagsToString = function (f) {

  var fs = {

    1: 'Root',
    2: 'Group',
    4: 'Temp-Group',
    8: 'Connector'
  }

  var s;

  _.each(_.keys(fs), function (v) {
    if (f & v) {
      s = _.sprintf('%s %s', s || '', fs[v]);
    }
  });

  return (s || '').trim();
};

/**
 * restore/revive from an object created with toObject.
 * @param  {Object} o - previously serialized Node
 * @param  {ViewGraph} viewGraph - the graph to attach to
 * @return {Node} a fully revived graph node with children
 */
Node.fromObject = function (o, viewGraph) {

  // for now send event to create object instance
  var obj = {};
  Events.I().publish(Events.CREATE_NODE, o.typeName, viewGraph, obj);
  U.ASSERT(obj.node, 'Expected to get a node');
  obj.node.set(o);
  return obj.node;

};

/**
 * toObject should only be implemented in the base class. It returns JSONable
 * object that be used to serialize the node ( and recursively its children ).
 * toObject calls addPropertiesToObject to allow descendant classes the opportunity
 * to add properties that the base class is unware off.
 * @return {[type]} [description]
 */
Node.prototype.toObject = function () {

  var o = {};
  this.addPropertiesToObject(o);
  return o;
};

/**
 * return a string representation of this node and its children.
 * Uses JSON.stringify to format the output and the omits certain keys.
 * Flags are converted to string representation.
 * @return {[type]} [description]
 */
Node.prototype.debugStr = function () {

  // serialize
  var s = this.toObject();

  // keys to omit ( alphabetical )
  var omit = [
    'aspectLocked',
    'color',
    'end',
    'endConnection',
    'endMarkerStyle',
    'fill',
    'fontSize',
    //'glyph',
    'height',
    'opacity',
    'line',
    'start',
    'startConnection',
    'startMarkerStyle',
    'stroke',
    'strokeWidth',
    'text',
    'transform',
    'width',
  ];

  // replace flags with a string representation
  // and omit various properties
  var stack = [s];
  while (stack.length) {
    var n = stack.pop();
    n.flags = Node.FlagsToString(n.flags);
    omit.forEach(function (p) {
      delete n[p];
    })
    stack = stack.concat(n.nodes);
  }

  return JSON.stringify(s, null, 2);
};



/**
 * base class adds:
 * typeName, uuid, stroke, fill, strokeWidth, text, color, fontSize, opacity, transform, glyphFormat, glyphName
 * @param {[type]} o [description]
 */
Node.prototype.addPropertiesToObject = function (o) {

  _.extend(o, {
    typeName: this.typeName,
    uuid: this.uuid,
    flags: this.flags,
    stroke: this.stroke.toString(),
    strokeGradient: this.strokeGradient ? this.strokeGradient.toObject() : null,
    strokeWidth: this.strokeWidth,
    fill: this.fill.toString(),
    fillGradient: this.fillGradient ? this.fillGradient.toObject() : null,
    text: this.textGlyph ? this.textGlyph.contentToObject() : '',
    color: this.color.toString(),
    fontSize: this.fontSize,
    opacity: this.opacity,
    transform: this.transform.toObject(),
    width: this.width,
    height: this.height,
    glyph: this.glyphName || '',
    aspectLocked: this.aspectLocked
  });

  // pick the object to remove null or undefined properties
  _.each(_.keys(o), function (key) {
    if (o[key] === null || o[key] === undefined) {
      delete o[key];
    }
  });

  // add children
  o.nodes = this.children.map(function (n) {
    return n.toObject();
  }, this);

};


/**
 * true if this node has its editor visible
 */
Node.prototype.isEditorOpen = function () {
  return !!this.editor;
};

/**
 * return name of the handle at the given location of null
 * @param p
 */
Node.prototype.getHandleAt = function (p) {
  return this.isEditorOpen() ? this.editor.getHandleAt(p) : null;
};

/**
 * Update our inbound connections, recursively, children first
 * @return {[type]} [description]
 */
Node.prototype.updateConnections = function () {

  _.each(this.children, function (n) {
    n.updateConnections();
  }, this);

  this.edgesIn.forEach(function (connector) {
    connector.source.updateConnection(connector);
  }, this);

};

/**
 * mouse event when a handle is being dragged, p is in global space
 * @param p
 */
Node.prototype.handleDrag = function (handleName, p, startTransform) {

  U.ASSERT(this.isEditorOpen(), "Expected editor to be open");
  this.editor.handleDrag(handleName, p, startTransform);
};


/**
 * true if the node has all of the flags given
 * @param {...Number} flag
 */
Node.prototype.hasFlags = function (flag) {

  // test each flag in arguments
  var a = _.toArray(arguments);
  for (var i = 0; i < a.length; i += 1) {
    if ((this.flags & a[i]) === 0) {
      return false;
    }
  }
  return true;
};

/**
 * add a flag ( or flags ) to the node
 * @param flag
 */
Node.prototype.addFlags = function (flag) {

  this.flags |= flag;
};

/**
 * remove a flag ( or flags ) to the node
 * @param flag
 */
Node.prototype.removeFlags = function (flag) {

  // AND flags with the XOR of the given flags
  this.flags &= (flag ^ 0xFFFFFFFFFFFF);
};

/**
 * display editor
 * @params {Boolean} showHandles, true to show handles versus hard points
 */
Node.prototype.showEditor = function (showHandles) {
  throw new Error('no editor');
};

/**
 * hide editor
 */
Node.prototype.hideEditor = function () {
  throw new Error('no editor');
};

/**
 * enter text editing mode
 */
Node.prototype.showTextEditor = function (showHandles) {
  throw new Error('no text editing');
};

/**
 * end text editing
 */
Node.prototype.hideTextEditor = function () {
  throw new Error('no text editing');
};


/**
 * takes a value that defines is a coeffecient to the width / height
 * and returns that point in global space e.g. given (0.5, 0.5) would
 * return the center of the node or (1,1) would return the bottom
 * right corner.
 * @param  {G.Vector2D} c - width/height coeffecients
 * @return {G.Vector2D} - world space vector
 */
Node.prototype.localCoeffecientsToWorld = function (c) {

  var m = this.getTransformationMatrix();
  var p = new G.Vector2D(this.width * c.x, this.height * c.y);
  return m.multiplyVector(p);

};


/**
 * get our transform multiplied by our parents, if present, this recursive
 * and works up the child -> parent hierarchy
 */
Node.prototype.getTransformationMatrix = function () {

  // our local transform
  var m = this.transform.getTransformationMatrix(this.width, this.height);

  // bring in parent if we have one, otherwise just our matrix
  return this.parent ? this.parent.getTransformationMatrix().multiplyMatrix(m) : m;

};

/**
 * return the sum of our rotation plus all parents modulo 360
 * @return {[type]} [description]
 */
Node.prototype.getGlobalRotation = function () {
  return (this.transform.rotate + this.parent ? this.parent.getGlobalRotation() : 0) % 360;
};

/**
 * center of node in world space
 */
Node.prototype.getCenterWorld = function () {

  return this.localToGlobal(new G.Vector2D(0.5 * this.width, 0.5 * this.height));
};


/**
 * local bounds of node
 * @returns G.Box
 */
Node.prototype.getBB = function () {
  return new G.Box(0, 0, this.width, this.height);
};

/**
 * get the axis align bounding box for the element
 * @returns G.Box
 */
Node.prototype.getAABB = function () {

  // transform the 4 corners of the bounds into screen space

  var m = this.getTransformationMatrix();

  var pts = [
    new G.Vector2D(0, 0),
    new G.Vector2D(this.width, 0),
    new G.Vector2D(this.width, this.height),
    new G.Vector2D(0, this.height)
  ];

  var tpts = _.map(pts, function (p) {
    return m.multiplyVector(p);
  });

  var xmin = Math.min(tpts[0].x, tpts[1].x, tpts[2].x, tpts[3].x);
  var ymin = Math.min(tpts[0].y, tpts[1].y, tpts[2].y, tpts[3].y);
  var xmax = Math.max(tpts[0].x, tpts[1].x, tpts[2].x, tpts[3].x);
  var ymax = Math.max(tpts[0].y, tpts[1].y, tpts[2].y, tpts[3].y);

  return new G.Box(xmin, ymin, xmax - xmin, ymax - ymin);

};

/**
 * return our y snapping points. For the base class this is top
 * and bottom of our AABB
 * @return {[type]} [description]
 */
Node.prototype.getYSnaps = function () {
  var b = this.getAABB();
  return [b.y, b.b];
};

/**
 * likewise for x
 * @return {[type]} [description]
 */
Node.prototype.getXSnaps = function () {
  var b = this.getAABB();
  return [b.x, b.r];
};

/**
 * move to given node to given global position. Base class just
 * updates translate, by other classes may override e.g. line
 */
Node.prototype.moveTo = function (p) {
  this.transform.translate = p;
};

/**
 * general purpose traversal function
 * @param {Function}
 */
Node.traverse = function (f) {

  // call the given function recursively down the branch we are the root of
  // passing any additional parameters

  // get arguments without function
  var args = _.toArray(arguments).slice(1);

  var stack = [this];
  while (stack.length) {

    var n = stack.pop();
    f.apply(this, args);

    // apply to our children
    stack = stack.concat(n.children);
  }
};

/**
 * get the value for the given property from the ViewGraphNode or the nearest parent where it is set.
 * if the property is not found in the chain then return the default value
 * @param key
 */
Node.prototype.getInheritedValue = function (key, defaultValue) {

  var node = this;
  while (node) {
    if (node.hasOwnProperty(key)) return node[key];
    node = node.parent;
  }
  return defaultValue;
};

/**
 * bring to top of parent stacking order
 */
Node.prototype.bringToFront = function () {

  U.ASSERT(this.parent, "Not attached!");
  var p = this.parent;
  this.detach();
  this.appendTo(p);

};

/**
 * send to back of stacking order
 */
Node.prototype.sendToBack = function () {

  U.ASSERT(this.parent, "Not attached!");
  var p = this.parent;
  this.detach();
  this.insertTo(p);

};

/**
 * apply given properties to the node
 */
Node.prototype.set = function (obj) {

  // we can't just _.extend this with obj since some properties require special handling

  _.each(obj, function (value, key) {

    switch (key) {

    case "parent":
      {
        if (this.parent) this.detach();
        this.appendTo(value);
      }
      break;

      // you might set the view graph is attaching a serialized snippet to a live graph.
      // Ensure all our children get the viewGraph as well
    case "viewGraph":
      {

        this.viewGraph = value;
        this.viewGraph.traverseInOrder(this, function (n) {
          n.viewGraph = this.viewGraph;
        }.bind(this));
      }
      break;

      // nodes is set when deserializing from the server, it is our children
    case "nodes":

      _.each(value, function (o) {
        // TODO, this needs review as to why its necessary

        // the node will need a parent to revive correctly so
        // add, temporarily to the object
        o.parent = this;
        // now construct the child
        var n = Node.fromObject(o, this.viewGraph);
        // now we have a real node we can make ourselves it parent
        n.parent = this;
        // remove the temporary object from the node JSON
        delete o.parent;

      }, this);

      break;

    case "r":
      this.transform.rotate = value;
      break;

    case "x":
      this.transform._t.x = value;
      break;

    case "y":
      this.transform._t.y = value;
      break;

    case "rotate":
      this.transform.rotate = value;
      break;

    case "translate":
      this.transform.translate = value;
      break;

    case "transform":
      this.transform = G.Transform2D.fromObject(value);
      break;

    case "scale":
      this.transform.scale = value;
      break;

    case "strokeWidth":
      // stroke width changes the end points of connections
      U.ASSERT(U.IS_NUMBER(value), 'Bad parameter');
      this.strokeWidth = value;
      this.updateConnections();
      break;

    case "stroke":
      // this allows for values like rgba(1,2,3,0.5) or setting with another G.Color
      // since that classes toString produces a valid CSS color
      this.stroke = new Color(value.toString());
      break;

    case "strokeGradient":
      this.strokeGradient = value ? Gradient.fromObject(value) : null;
      break;

    case "fill":
      this.fill = new Color(value.toString());
      break;

    case "fillGradient":
      this.fillGradient = value ? Gradient.fromObject(value) : null;
      break;

    case "size":
      this.width = value.x;
      this.height = value.y;
      break;

    case "glyph":
      {
        // glyphs are specified using the name of the constructor function
        this.glyphName = value;

        // glyph might not have a value e.g. when deserializing the root node
        if (this.glyphName) {
          this.setGlyph(GlyphFactory(this.glyphName, this));
        }
      }
      break;

    case "geometry":
      {
        // this is a hack, it is going away when the real UI arrives
        if (U.IS_A(value, G.LineSegment)) {
          this.line = new G.LineSegment(value);
        } else {
          if (_.isArray(value)) {
            U.ASSERT(value.length === 2);
            this.start = value[0].clone();
            this.end = value[1].clone();
          } else {
            // this ensure we can accept almost anything with boxy properties
            var b = new G.Box(value);
            this.transform.translate = b.center;
            this.width = b.width;
            this.height = b.height;
          }
        }
      }
      break;

    case "name":
      {
        this.name = value;
        this.el.setAttribute("data-name", this.name);
        break;
      }

    default:
      this[key] = value;
    }

  }, this);

};


/**
 * set the content type for this node
 * @param glyph
 */
Node.prototype.setGlyph = function (glyph) {

  // glyph is stored and updated whenever we are updated
  this.glyph = glyph;

  // reappend text element to make it above the glyph
  U.ASSERT(this.textGlyph, 'expected a text glyph');
  this.el.appendChild(this.textGlyph.el);
};


/**
 * add the node to given node as a child. Must not current be a child of any other node
 * @param {Node} parent
 */
Node.prototype.appendTo = function (parent) {

  U.ASSERT(!this.parent, "Node is already parented");
  U.ASSERT(parent, "Bad parameter");

  // update child list of parent and this nodes parent reference
  parent.children.push(this);
  this.parent = parent;

  // update the DOM
  this.parent.el.appendChild(this.el);

};

/**
 * get index of child in stack order
 * @param  {[type]} child [description]
 * @return {[type]}       [description]
 */
Node.prototype.getChildIndex = function (child) {

  var index = this.children.indexOf(child);
  U.ASSERT(index >= 0, 'expected child to be in the children list');
  return index;
};

/**
 * insert the child so that it will be at the given index
 * @param  {[type]} index [description]
 * @return {[type]}       [description]
 */
Node.prototype.insertAt = function (child, index) {

  U.ASSERT(!child.parent, "Node is already parented");
  U.ASSERT(index >= 0 && index <= this.children.length, 'bad index');

  child.parent = this;
  this.children.splice(index, 0, child);

  // we must append or insertBefore according to index
  if (index === this.children.length) {
    this.el.appendChild(child.el);
  } else {
    this.el.insertBefore(child.el, this.el.children[index]);
  }
};


/**
 * like appendTo but puts the child first
 * @param {Node} parent
 */
Node.prototype.insertTo = function (parent) {

  U.ASSERT(!this.parent, "Node is already parented");
  U.ASSERT(parent, "Bad parameter");

  // if parent has no children then append is necessary
  if (parent.children.length === 0) {
    this.appendTo(parent);
  } else {

    // update child list of parent and this nodes parent reference
    parent.children.splice(0, 0, this);
    this.parent = parent;

    // update the DOM
    this.parent.el.insertBefore(this.el, this.parent.el.firstChild);
  }

};


/**
 * ungroup a rectangular node and return to root/world space
 */
Node.prototype.ungroup = function () {

  var m = this.getTransformationMatrix();
  var tm = G.Matrix2D.translate(this.width / 2, this.height / 2);
  m = m.multiplyMatrix(tm);

  // update transform so that visually the node doesn't move/change size
  this.transform.rotate = m.decomposeRotation();
  this.transform.scale = m.decomposeScale();
  this.moveTo(m.decomposeTranslate());

  this.detach();
  this.appendTo(this.viewGraph.root);
};


/**
 * remove from our current parent.
 */
Node.prototype.detach = function () {

  U.ASSERT(this.parent, "Node is not parented");

  this.parent.children.splice(this.parent.children.indexOf(this), 1);
  this.parent.el.removeChild(this.el);
  this.parent = null;
};

/**
 * update the node to its current appearance. You should call up the inheritance chain to ensure
 * all properties are set correctly.
 */
Node.prototype.update = function () {

  // each node needs its current transformation matrix and width/height applied, the root
  // node is handled slightly differently since its transformation needs to include any
  // view transformations ( scaling etc )

  var m;

  if (this.hasFlags(Node.Flags.Root)) {

    // the root node of the view graph does not have appearance nor is it expected
    // to have anything but an identity matrix transform. However, to accommodate view zooming / panning
    // it might contain certain view transforms

    m = this.viewGraph.getViewMatrix();
    D.setPrefixedCSS(this.el, 'transform', m.toCSSString());

  } else {

    m = this.transform.getTransformationMatrix(this.width, this.height);
    D.setPrefixedCSS(this.el, 'transform', m.toCSSString());

    this.el.style.width = this.width + 'px';
    this.el.style.height = this.height + 'px';

    // some nodes may not have a visible representation ( e.g. group )
    if (this.glyph) {
      this.glyph.update();
    }

    // update text overlay
    this.textGlyph.update();

    // opacity is applied to the entire node regardless of how its rendered
    this.el.style.opacity = this.opacity;

    // update editor if we have one
    if (this.editor) {
      this.editor.update();
    }
  }
};

/**
 * return the center for the text glyph. The default is 50, 50
 * which centers the text in our bounds. Descendant classes can
 * override. This is called whenever the node is updated.
 * @return {G.Vector2D} percentage h/v of text center
 */
Node.prototype.getTextGlyphCenter = function () {
  return new G.Vector2D(50, 50);
};


/**
 * update all nodes in the branch of the scene graph starting with this node
 */
Node.prototype.updateBranch = function () {

  this.update();
  _.each(this.children, function (child) {
    child.updateBranch();
  }, this);
};

/**
 * break inbound connections
 */
Node.prototype.breakInboundConnections = function () {

  _.each(this.edgesIn, function (c) {
    c.breakConnection();
  }, this);
};

/**
 * dispose
 */
Node.prototype.dispose = function () {

  U.ASSERT(!this.disposed, "ViewGraphNode already disposed");

  // children first (iterate on a copy since children will get modified)
  _.each(this.children.slice(), function (c) {
    c.dispose();
  }, this);

  // end editing activities
  this.hideEditor();

  // break connections
  this.breakInboundConnections();

  // detach from parent
  if (this.parent) {
    this.detach();
  }

  this.disposed = true;
};

/**
 * transform point into our local space and return results of containment test
 * @param {G.Vector2D} p
 * @returns boolean
 */
Node.prototype.containsGlobalPoint = function (p) {

  // get our inverse transformation matrix including all our parents transforms
  // and use the inverse to put the point into the local space of the
  // node. Then we can just test against the AABB

  var pt = this.globalToLocal(p);
  return pt.x >= 0 && pt.y >= 0 && pt.x <= this.width && pt.y <= this.height;

};

/**
 * transform point into our local space and return results of containment test
 * including an allowance for our current stroke width
 * @param {G.Vector2D} p
 * @returns boolean
 */
Node.prototype.containsGlobalPointWithStroke = function (p) {

  // get our inverse transformation matrix including all our parents transforms
  // and use the inverse to put the point into the local space of the
  // node. Then we can just test against the AABB

  var pt = this.globalToLocal(p);
  var s = U.IS_NUMBER(this.strokeWidth) ? this.strokeWidth / 2 : 0;
  return pt.x >= -s &&
    pt.y >= -s &&
    pt.x <= (this.width + s) &&
    pt.y <= (this.height + s);
};

/**
 * bring global point into local space of node. Does NOT include adjustments for
 * the view matrix. Works on a single point or array of points
 * @param p
 */
Node.prototype.globalToLocal = function (p) {

  if (_.isArray(p)) {
    return p.map(function (v) {
      return this.globalToLocal(v);
    }, this);
  }

  return this.getTransformationMatrix().inverse().multiplyVector(p);
};

/**
 * convert local coordinates to global coordinates
 * @param p
 */
Node.prototype.localToGlobal = function (p) {

  if (_.isArray(p)) {
    return p.map(function (v) {
      return this.localToGlobal(v);
    }, this);
  }

  return this.getTransformationMatrix().multiplyVector(p);
};

/**
 * return true if our transformed outline intersects the given aabb
 * @param {G.Box} box
 * @returns boolean
 */
Node.prototype.intersectsAABB = function (box) {
  return this.getBB().transformToPolygon(this.getTransformationMatrix()).intersectsAABB(box);
};

module.exports = Node;
