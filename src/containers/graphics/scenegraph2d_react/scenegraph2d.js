import invariant from '../../../utils/environment/invariant';
import React, { Component, PropTypes } from 'react';
import Vector2D from '../geometry/vector2d.js';

export default class SceneGraph2D extends React.Component {

  render() {

    const style = {
      width: this.props.w + 'px',
      height: this.props.h + 'px',
    }

    return (
      <div style={style} className="sceneGraph">
        {this.props.children}
      </div>
    );
  }
}
