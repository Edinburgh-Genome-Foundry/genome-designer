import invariant from '../../utils/environment/invariant';
import React, { Component, PropTypes } from 'react';
import uuid from 'node-uuid';
import Transform2D from './Transform2d';
import Matrix2D from './Matrix2d';
import Vector2D from './Vector2d';
import Node2D from './Node2d.js';

export default class RootNode2D extends Node2D {

  constructor(props) {
    super(props);
  }

  render() {

    // the view matrix only provides a scaling transform
    const t2d = new Transform2D();
    t2d.scale = new Vector2D(this.props.zoom , this.props.zoom);
    const m2d = t2d.getTransformationMatrix(0, 0);

    // set width / height via style
    const style = {
      transform: m2d.toCSSString()
    }

    // render
    return (
      <div style={style} className="node" ref={this.uuid}>
        {this.props.children}
      </div>
    );
  }
}
