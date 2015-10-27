var D = require('./dutils');
var U = require('./utils');
var G = require('./geometry');
var Node = require('./node');


/**
 * add a simple dragging user interface to the scene graph
 */

export default class {

  constructor(viewGraph) {
    this.viewGraph = viewGraph;
    this.el = document.createElement('div');
    this.el.classList.add('dragui');
    this.viewGraph.el.parentElement.appendChild(this.el);

    this.el.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.el.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.el.addEventListener('mouseup', this.onMouseUp.bind(this));

    // current hover node
    this.drag = null;
  }

  // local position of mouse in scene graph
  mousePosition(e) {

    return new G.Vector2D(e.offsetX / this.viewGraph.scale, e.offsetY / this.viewGraph.scale);
  }

  /**
   * get a z order listed of nodes at the given graph position.
   */
  getNodesAt(p) {

    var hits = [];

    this.viewGraph.traverseInOrder(this.viewGraph.root, function (n) {
        if (n.containsGlobalPointWithStroke(p)) {
          hits.push(n);
        }
      }.bind(this), function (n) {
        return !n.hasFlags(Node.Flags.Root);
      }.bind(this),
      function (n) {
        return !n.hasFlags(Node.Flags.Group);
      }.bind(this));

    return hits;

  };

  // get the top most node with the given glyph name at the given location
  getTopMostGlyphAt (p, typeNames) {

    // get all the nodes then find top most of the right type
    let nodes = this.getNodesAt(p);
    while (nodes.length) {
      let top = nodes.pop();
      if (typeNames.indexOf(top.glyphName) >= 0) {
        return top;
      }
    }
    return null;
  };

  onMouseDown(e) {
    let top = this.getTopMostGlyphAt(this.mousePosition(e), ['Rectangle', 'Construct']);
    if (top) {
      this.drag = top;
      this.drag.set({
        strokeWidth: this.drag.strokeWidth << 1
      });
      e.preventDefault();
    }
  }

  onMouseMove(e) {
    if (this.drag) {
      let p = this.mousePosition(e);
      this.drag.moveTo(p);
      this.drag.updateConnections();
      this.drag.updateBranch();
      e.preventDefault();
    }
  }

  onMouseUp(e) {
    if (this.drag) {
      this.drag.set({
        strokeWidth: this.drag.strokeWidth >> 1
      });
      this.drag.update();
      this.drag = null;
      e.preventDefault();
    }
  }

}
