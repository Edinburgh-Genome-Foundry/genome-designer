import React from 'react';

var SVGTransform = React.createClass({

  /**
   * render menu
   * @return {<Menu>}
   */
  render: function() {

    // render the menu drop down and header and optionally the child items
    return (
      <g>
        {this.props.children}
      </g>
    )
  }
});

module.exports = SVGTransform;
