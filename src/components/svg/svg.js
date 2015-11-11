import React from 'react';
import SVGBlock from './svgblock';

/**
 * represents an SVG tag
 */
var SVGSurface = React.createClass({

  /**
   * render menu
   * @return {<Menu>}
   */
  render: function() {

    // dimensions of blocks
    const W = 100;
    const H = 40;

    // layout the blocks using a depth first traversal
    let blocks = [];
    let lines = [];

    // y position must be backed up so children are positioned with respect
    // to all prior nodes
    function traverse(block, x, y, parent) {
      block.x = x;
      block.y = y;
      blocks.push(block);

      // add a line from our center to parent center
      if (parent) {
        let x1 = parent.x + W / 2;
        let y1 = parent.y + H / 2;
        let x2 = x + W / 2;
        let y2 = y + H / 2;

        lines.push(
          <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={2} stroke="black"></line>
        )
      }

      if (block.children) {

        block.children.forEach((child, index) => {
          y = traverse(child, x + W, y, block);
          if (index < block.children.length - 1) {
            y += H;
          }
        });
      }

      return y;
    }

    // traverse start with all the root nodes
    let y = 0;
    this.props.store.forEach((block, index) => {
      y = traverse(block, 0, y, null);
      y += H;
    });

    // render the blocks
    let blockElements = blocks.map(block => {
      return <SVGBlock block={block}/>;
    });

    // render the SVG and all the blocks in our properties starting with the root
    return (
      <svg width={this.props.width} height={this.props.height}>
        {blockElements}
        {lines}
      </svg>
    )
  }
});

module.exports = SVGSurface;
