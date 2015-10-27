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

// scene graph node types

// scene graph CSS
import '../css/scenegraph.css';

export class SceneGraphPage extends Component {constructor (props) {
    super(props);

  }

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
        let n = this.nodes[y * X + x] = new Node(this.sceneGraph);
        n.set({
          parent: this.sceneGraph.root,
          glyph: "Rectangle",
          geometry: new G.Box(20 + x * 200, 20 + y * 150, 100, 100),
          fill: 'whitesmoke',
          stroke: 'dodgerblue',
          strokeWidth: 2,
          text: 'Rectangle ' + x + ' ,' + y
        });
        n.update();
      }
    }

    // connect nodes to the node to their right and below
    for (let x = 0; x < X - 1; x += 1) {
      for (let y = 0; y < Y - 1; y += 1) {
        var a = this.nodes[y * X + x];
        var b = this.nodes[(y + 1) * X + x + 1];
        let c = new SmartConnector(this.sceneGraph);
        c.set({
          parent: this.sceneGraph.root,
          glyph: "SmartConnector",
          geometry: new G.Box(0, 0, 0, 0),
          stroke: 'orange',
          strokeWidth: 2
        });

        let connection = new Connection(c, new G.Vector2D(), a, new G.Vector2D(1, 0.75));
        c.setConnection('start', connection);

        connection = new Connection(c, new G.Vector2D(), b, new G.Vector2D(0, 0.25));
        c.setConnection('end', connection);

        c.update();

        b = this.nodes[y * X + x + 1];
        c = new SmartConnector(this.sceneGraph);
        c.set({
          parent: this.sceneGraph.root,
          glyph: "SmartConnector",
          geometry: new G.Box(0, 0, 0, 0),
          stroke: 'red',
          strokeWidth: 2
        });

        connection = new Connection(c, new G.Vector2D(), a, new G.Vector2D(0.5, 1));
        c.setConnection('start', connection);

        connection = new Connection(c, new G.Vector2D(), b, new G.Vector2D(0.5, 1));
        c.setConnection('end', connection);

        c.update();
      }
    }

    this.sceneGraph
      .root
      .updateBranch();

  }

  render () {
    return (
      <div>
        <div className="scene-graph-container" ref="sceneGraphContainer"></div>
      </div>
    );
  }
}

// we dont really need to inject anything from redux here, so just inject the dispatch function by calling connect() alone.
// otherwise, we would choose which reducers we wanted to pass in explicitly so that the component would re-render when those stores change
// https://github.com/rackt/react-redux/blob/master/docs/api.md#api
export default connect()(SceneGraphPage);
