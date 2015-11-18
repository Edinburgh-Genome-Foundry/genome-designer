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

    // create new scene graph
    this.sceneGraph = new SceneGraph2D({
      w: 800,
      h: 200,
      zoom: 1
    });

    debugger;
    this.sceneGraph.root.appendChild(new Node2D({
      x: 200,
      y: 50,
      w: 200,
      h: 100,
      glyph: 'rectangle'
    }));
  }



  render () {
    return (
      <div>
        {this.sceneGraph.render()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(SceneGraphPage);
