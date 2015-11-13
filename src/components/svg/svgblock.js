import React from 'react';
import ColorJS from 'color-js';

var SVGBlock = React.createClass({

  render: function() {

    // display metrics
    const H = 20;     // size of block
    const W = 50;
    const TX = 8;     // x offset of text in block
    const TY = 12;    // y offset of text in block

    // syntax sugar for our properties
    const B = this.props.block;
    const X = B.x;
    const Y = B.y;

    // render ourselves + text + our children
    return (
      <g>
        <rect
          x={X}
          y={Y}
          width={W}
          height={H}
          fill={B.color}
          stroke={'gray'}
          strokeWidth={1}>
        </rect>
        <text x={X + TX} y={Y + TY} strokeWidth={0} fill="black" fontSize="10px" >{B.text}</text>
      </g>
    )
  }
});

module.exports = SVGBlock;
