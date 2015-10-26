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

    this.sceneGraph = new ViewGraph({
      width: 600,
      height: 600,
      parent: this.refs
        .sceneGraphContainer
        .getDOMNode()
    });

    let A = new Node(this.sceneGraph);
    A.set({
      parent: this.sceneGraph.root,
      glyph: "Rectangle",
      geometry: new G.Box(20, 20, 200, 100),
      fill: 'whitesmoke',
      stroke: 'dodgerblue',
      strokeWidth: 5,
      text: "Rectangle A"
    });

    let B = new Node(this.sceneGraph);
    B.set({
      parent: this.sceneGraph.root,
      glyph: "Rectangle",
      geometry: new G.Box(380, 450, 200, 100),
      fill: 'whitesmoke',
      stroke: 'dodgerblue',
      strokeWidth: 5,
      text: "Rectangle B"
    });

    let C = new SmartConnector(this.sceneGraph);
    C.set({
      parent: this.sceneGraph.root,
      glyph: "SmartConnector",
      geometry: new G.Box(50, 50, 400, 400),
      stroke: 'orange',
      strokeWidth: 5
    });

    var connection = new Connection(C, new G.Vector2D(), A, new G.Vector2D(0.5, 1));
    C.setConnection('start', connection);

    connection = new Connection(C, new G.Vector2D(), B, new G.Vector2D(0, 0.5));
    C.setConnection('end', connection);

    let D = new SmartConnector(this.sceneGraph);
    D.set({
      parent: this.sceneGraph.root,
      glyph: "SmartConnector",
      geometry: new G.Box(50, 50, 400, 400),
      stroke: 'orange',
      strokeWidth: 5
    });

    connection = new Connection(D, new G.Vector2D(), A, new G.Vector2D(1, 0.5));
    D.setConnection('start', connection);

    connection = new Connection(D, new G.Vector2D(), B, new G.Vector2D(0.5, 0));
    D.setConnection('end', connection);

    this.sceneGraph
      .root
      .updateBranch();

  }

  render () {
    return (
      <div>
        <h1>Scene Graph Test Page</h1>
        <div className="scene-graph-container" ref="sceneGraphContainer"></div>
        <br></br>
        <button onClick={this
          .onClick
          .bind(this)}>Render</button>
      </div>
    );
  }
  onClick () {
    this.render();
  }
}

// we dont really need to inject anything from redux here, so just inject the dispatch function by calling connect() alone.
// otherwise, we would choose which reducers we wanted to pass in explicitly so that the component would re-render when those stores change
// https://github.com/rackt/react-redux/blob/master/docs/api.md#api
export default connect()(SceneGraphPage);
