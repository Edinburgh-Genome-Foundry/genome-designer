import invariant from '../../utils/environment/invariant';
import React, { Component, PropTypes } from 'react';
import uuid from 'node-uuid';
import Transform2D from './Transform2d';
import Matrix2D from './Matrix2d';
import Vector2D from './Vector2d';
import NodeText2D from './NodeText2d.js';

export default class Node2D extends Component {


  /**
   * base class
   */
  constructor (props) {
    super(props);
    this.uuid = uuid.v4();
  }

  render() {

    // compose our transform
    const t2d = new Transform2D();
    t2d.translate = new Vector2D(this.props.x, this.props.y);
    t2d.rotate = this.props.r;
    const m2d = t2d.getTransformationMatrix(this.props.w, this.props.h);

    // set width / height via style
    const style = {
      width: this.props.w + 'px',
      height: this.props.h + 'px',
      transform: m2d.toCSSString(),
      backgroundColor: this.props.fill,
    }

    // render
    return (
      <div style={style} className="node" ref={this.uuid}>
        <NodeText2D
        text={this.props.text}
        width={this.props.w}
        height={this.props.h}
        />
        {this.props.children}
      </div>
    );
  }
}

Node2D.defaultProps = {
  text: '',
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  r: 0,
}
