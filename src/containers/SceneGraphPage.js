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
import SceneGraph2D from './graphics/SceneGraph2D';

/**
 * just for testing bootstrap, hence the lack of comments
 */
@withStyles(styles)
class SceneGraphPage extends Component {

  constructor (props) {
    super(props);
    this.state = {
      zoom: 1
    }
  }

  onZoom() {
    this.state.zoom = parseFloat(this.refs.zoomSlider.value);
    this.forceUpdate();
  }

  render () {

    return (
      <div>
        <SceneGraph2D ref="sceneGraph" w="800px" h="600px" zoom={this.state.zoom}/>
        <br></br>
        <input ref="zoomSlider" type="range" min={0.2} max={4} step={0.01} onChange={this.onZoom.bind(this)} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(SceneGraphPage);
