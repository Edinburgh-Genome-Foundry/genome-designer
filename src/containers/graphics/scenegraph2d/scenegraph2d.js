import invariant from '../../../utils/environment/invariant';
import React, { Component, PropTypes } from 'react';
import Vector2D from '../geometry/vector2d.js';
import Node2D from './node2d.js';
import RootNode2D from './rootnode2d.js';

export default class SceneGraph2D extends React.Component {

  constructor(props) {
    super(props);
  }

  get root() {
    return this.refs.root;
  }

  render() {

    const style = {
      width: this.props.w,
      height: this.props.h,
    }

    return (
      <div ref="outer" style={style} className="sceneGraph">
        <RootNode2D ref="root" zoom={this.props.zoom}>

        </RootNode2D>
      </div>
    );
  }
}
