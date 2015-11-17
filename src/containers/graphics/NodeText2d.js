import invariant from '../../utils/environment/invariant';
import React, { Component, PropTypes } from 'react';
import uuid from 'node-uuid';
import Transform2D from './Transform2D';
import NodeText2D from './NodeText2d.js';

export default class Node2D extends Component {

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

Node2D.defaultProps = {
  width: 0,
  height: 0,
  text: ''
}
