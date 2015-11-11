import React from 'react';

var SVGRect = React.createClass({

  /**
   * render menu
   * @return {<Menu>}
   */
  render: function() {

    // render the menu drop down and header and optionally the child items
    return (
      <rect
        x={this.props.x}
        y={this.props.y}
        width={this.props.w}
        height={this.props.h}
        fill={this.props.fill}
        strokeWidth={0}>
      </rect>
    )
  }
});

module.exports = SVGRect;
