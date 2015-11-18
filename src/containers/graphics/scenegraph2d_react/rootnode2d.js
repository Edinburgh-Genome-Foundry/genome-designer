import invariant from '../../../utils/environment/invariant';
import React, { Component, PropTypes } from 'react';
import Transform2D from '../geometry/transform2d';
import Matrix2D from '../geometry/matrix2d';
import Vector2D from '../geometry/vector2d';
import Node2D from './node2d.js';

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
      <div style={style} className="node">
      </div>
    );
  }
}
