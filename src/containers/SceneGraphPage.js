import React, {
  PropTypes,
  Component
} from 'react';
import {connect} from 'react-redux';
import ViewGraph from '../viewgraph/viewgraph';
import Node from '../viewgraph/node';
import SmartConnector from '../viewgraph/smartconnector';
import G from '../viewgraph/geometry';
import Connection from '../viewgraph/connection';
import DragUI from '../viewgraph/dragui';

// scene graph node types

// scene graph CSS
import '../css/scenegraph.css';

export class SceneGraphPage extends Component {

  constructor (props) {
    super(props);
    this.scale = 1.0;
  }

  /*
   * build the scene after the component mounts
   */
  componentDidMount () {

    // empty scene graph
    this.sceneGraph = new ViewGraph({
      width: 1024,
      height: 768,
      parent: this.refs
        .sceneGraphContainer
        .getDOMNode()
    });
    // add a grid of shapes
    var X = 5,
      Y = 5;
    this.nodes = [];

    for (let y = 0; y < Y; y += 1) {
      for (let x = 0; x < X; x += 1) {
        let xp = 20 + x * 200;
        let yp = 20 + y * 150;
        let n = this.nodes[y * X + x] = this.makeBox(xp, yp, 100, 100, 'Box ' + x + ', ' + y);
      }
    }

    // connect nodes to the node to their right and below
    for (let x = 0; x < X - 1; x += 1) {
      for (let y = 0; y < Y - 1; y += 1) {
        var a = this.nodes[y * X + x];
        var b = this.nodes[(y + 1) * X + x + 1];
        this.connectBoxes(a, new G.Vector2D(1, 0.75), b, new G.Vector2D(0, 0.25), 'orange');

        b = this.nodes[y * X + x + 1];
        this.connectBoxes(a, new G.Vector2D(0.5, 1), b, new G.Vector2D(0.5, 1), 'red');

      }
    }

    // render everything
    this.sceneGraph
      .root
      .updateBranch();

    // add the ui
    this.ui = new DragUI(this.sceneGraph);
  }

  /**
   * helper function for making a box node
   */
  makeBox (x, y, w, h, text) {
    let n = new Node(this.sceneGraph);
    n.set({
      parent: this.sceneGraph.root,
      glyph: "Rectangle",
      geometry: new G.Box(x, y, w, h),
      fill: 'whitesmoke',
      stroke: 'dodgerblue',
      strokeWidth: 2,
      text: text
    });
    return n;
  }

  /**
   * helper for creating connections between boxes
   */
  connectBoxes (src, srcPos, dst, dstPos, color) {
    let c = new SmartConnector(this.sceneGraph);
    c.set({
      parent: this.sceneGraph.root,
      glyph: "SmartConnector",
      geometry: new G.Box(0, 0, 0, 0),
      stroke: color,
      strokeWidth: 2
    });

    let connection = new Connection(c, new G.Vector2D(), src, srcPos);
    c.setConnection('start', connection);

    connection = new Connection(c, new G.Vector2D(), dst, dstPos);
    c.setConnection('end', connection);

    return c;
  }

  render () {
    return (
      <div>
        <br></br>
        <input type="range" min="0.5" max="4" step="0.05" onChange={this.onScaleChanged.bind(this)}></input>
        <br></br>
        <div className="scene-graph-container" ref="sceneGraphContainer"></div>
      </div>
    );
  }

  onScaleChanged (e) {
    this.scale = parseFloat(e.target.value);
    this.sceneGraph.setScale(this.scale);
    this.sceneGraph.root.updateBranch();
    console.log(this.scale);
  }
}

// we dont really need to inject anything from redux here, so just inject the dispatch function by calling connect() alone.
// otherwise, we would choose which reducers we wanted to pass in explicitly so that the component would re-render when those stores change
// https://github.com/rackt/react-redux/blob/master/docs/api.md#api
export default connect()(SceneGraphPage);
