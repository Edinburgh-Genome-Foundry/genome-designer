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

  onAddRectangle () {
    this.sg.root.addChild(
      <Node2D text="Child" fill="dodgerblue" x={Math.random() * 400} y={Math.random() * 400} w={200} h={100} glyph="rectangle"/>
    );
  }

  onAddEllipse () {
    this.sg.root.addChild(
      <Node2D text="Child" fill="firebrick" x={Math.random() * 400} y={Math.random() * 400} w={200} h={100} glyph="ellipse"/>
    );
  }

  render () {
    return (
      <div>
        <SceneGraph2D ref="sceneGraph" w="800px" h="600px" zoom={this.state.zoom}/>
        <br></br>
        <input ref="zoomSlider" type="range" min={0.2} max={4} step={0.01} onChange={this.onZoom.bind(this)}/>
        <br></br>
        <button onClick={this.onAddRectangle.bind(this)}>Add Rectangle</button>
        <br></br>
        <button onClick={this.onAddEllipse.bind(this)}>Add Ellipse</button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(SceneGraphPage);
