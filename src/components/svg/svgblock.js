import React from 'react';
import ColorJS from 'color-js';

var SVGBlock = React.createClass({

  render: function() {

    // display metrics
    const H = 40;     // size of block
    const W = 100;
    const TX = 8;     // x offset of text in block
    const TY = 28;    // y offset of text in block

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
          strokeWidth={0}>
        </rect>
        <text x={X + TX} y={Y + TY} strokeWidth={0} fill="white" fontSize="20px" >{B.text}</text>
      </g>
    )
  }
});

module.exports = SVGBlock;
