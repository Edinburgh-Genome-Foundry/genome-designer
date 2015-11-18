import invariant from '../../../../utils/environment/invariant';
import React, {
  Component,
  PropTypes
} from 'react';

export default class Glyph2D extends Component {

  /**
   * base class for all glyphs
   * @param {Node2D} node - the node for which we render ourselves
   */
  constructor (node) {
    super();
    this.nodes = node;
  }

  render() {
    throw new Error('Inheriting class must define the render method');
  }
}
