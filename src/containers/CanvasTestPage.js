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

export class CanvasTestPage extends Component {

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

    for (let y = 0; y < 6; y += 1) {
      this.makeBox(20, 20 + y * 100, 800, 75, '');
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
      glyph: "Construct",
      geometry: new G.Box(x, y, w, h),
      fill: 'whitesmoke',
      stroke: 'black',
      strokeWidth: 2,
      text: text
    });
    return n;
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
export default connect()(CanvasTestPage);
