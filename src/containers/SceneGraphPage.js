import React, {
  Component,
  PropTypes
} from 'react';
import {
  Link
} from 'react-router';
import {
  connect
} from 'react-redux';
import styles from '../styles/SceneGraphPage.css';
import withStyles from '../decorators/withStyles';
import SceneGraph2D from './graphics/scenegraph2d/scenegraph2d';
import Node2D from './graphics/scenegraph2d/node2d';

/**
 * just for testing bootstrap, hence the lack of comments
 */
@withStyles(styles)
class SceneGraphPage extends Component {

  constructor (props) {
    super(props);
    this.state = {
      zoom: 1
    };
  }

  get sg () {
    return this.refs.sceneGraph;
  }

  onZoom () {
    this.state.zoom = parseFloat(this.refs.zoomSlider.value);
    this.forceUpdate();
  }

  onAddRectangle = () => {
    this.sg.addNode(
      <Node2D sceneGraph={this.sg} text="Child" fill="dodgerblue" x={Math.random() * 400} y={Math.random() * 400} w={200} h={100} glyph="rectangle"/>
    );
  }

  onAddEllipse = () => {
    this.sg.addNode(
      <Node2D sceneGraph={this.sg} text="Child" fill="firebrick" x={Math.random() * 400} y={Math.random() * 400} w={200} h={100} glyph="ellipse"/>
    );
  }

  onRemove = () => {
    const i = Math.floor(Math.random() * this.sg.root.children.length);
    this.sg.root.removeNode(this.sg.root.children[i]);
  }

  render () {
    return (
      <div>
        <SceneGraph2D ref="sceneGraph" w="800px" h="600px" zoom={this.state.zoom} />
        <br></br>
        <input ref="zoomSlider" type="range" min={0.2} max={4} step={0.01} onChange={this.onZoom.bind(this)}/>
        <br></br>
        <button onClick={this.onAddRectangle}>Add Rectangle</button>
        <br></br>
        <button onClick={this.onAddEllipse}>Add Ellipse</button>
        <br></br>
        <button onClick={this.onRemove}>Remove</button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(SceneGraphPage);
