import uuid from 'node-uuid';
import React from 'react';
import Node2D_React from '../scenegraph2d_react/node2d';

export default class Node2D {

  constructor(props) {

    // child nodes of this node
    this.children = [];

    // extend default options with the given options
    this.props = Object.assign({
      stroke: 'black',
      strokeWidth: 5,
      fill: 'dodgerblue',
      w: 0,
      h: 0,
      x: 0,
      y: 0,
      uuid: uuid.v4()
    }, props);

  }

  appendChild(child) {
    this.children.push(child);
  }

  render() {

    debugger;
    const childrenRendered = this.children.map( child => {
      return child.render();
    });

    const p = this.props;

    return <Node2D_React x={p.x} y={p.y} w={p.w} h={p.h} stroke={p.stroke} strokeWidth={p.strokeWidth} fill={p.fill} glyph={p.glyph}>
      {childrenRendered}
    </Node2D_React>;
  }


}
