import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import '../css/scenegraph.css';
import SceneGraph from './scenegraph.js';

export class SceneGraphPage extends Component {
  constructor (props) {
    super(props);

  }

  componentDidMount () {
    this.sceneGraph = new SceneGraph(this.refs.sceneGraphContainer.getDOMNode());
  }

  render () {
    return (
      <div>
        <h1>Scene Graph Test Page</h1>
        <div className="scene-graph-container" ref="sceneGraphContainer"></div>
        <button onClick={this.onClick.bind(this)}>Render</button>
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
