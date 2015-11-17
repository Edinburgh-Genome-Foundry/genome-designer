import invariant from '../../../utils/environment/invariant';
import React, { Component, PropTypes } from 'react';
import Vector2D from '../geometry/vector2d.js';
import Node2D from './node2d.js';
import RootNode2D from './rootnode2d.js';

export default class SceneGraph2D extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const style = {
      width: this.props.w,
      height: this.props.h,
    }

    return (
      <div ref="outer" style={style} className="sceneGraph">
        <RootNode2D ref="root" zoom={this.props.zoom}>
          <Node2D text="Hello World" fill="red" x={200} y={100} w={200} h={100} glyph="rectangle">
            <Node2D text="Child" fill="dodgerblue" x={200} y={100} w={200} h={100} glyph="rectangle"/>
          </Node2D>
          <Node2D text="Another World" fill="green" x={400} y={200} w={200} h={100} glyph="rectangle">
            <Node2D text="Ellipse" fill="yellow" x={200} y={100} w={200} h={200} glyph="ellipse"/>
          </Node2D>
        </RootNode2D>
      </div>
    );
  }
}
