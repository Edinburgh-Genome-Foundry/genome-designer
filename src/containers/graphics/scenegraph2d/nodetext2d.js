import invariant from '../../../utils/environment/invariant';
import React, { Component, PropTypes } from 'react';
import Transform2D from '../geometry/transform2d';
import Node2D from './node2d.js';

export default class Node2DText extends Component {

  /**
   * base class
   */
  constructor (props) {
    super(props);
  }

  render() {

    const style = {
      width: this.props.width + 'px'
    }

    return (
      <div style={style} className="nodetext">{this.props.text}</div>
    );
  }
}

Node2DText.defaultProps = {
  width: 0,
  height: 0,
  text: ''
}
