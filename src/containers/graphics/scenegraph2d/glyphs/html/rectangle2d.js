import invariant from '../../../../../utils/environment/invariant';
import React, {
  Component,
  PropTypes
} from 'react';
import Glyph2D from '../glyph2d';
import K from '../../scenegraph2d_consts'

export default class Rectangle2D extends Glyph2D {

  /**
   * base class for all glyphs
   * @param {Node2D} node - the node for which we render ourselves
   */
  constructor (node) {
    super(node);
  }

  render() {
    const style = {
      width: this.props.w + 'px',
      height: this.props.h + 'px',
      backgroundColor: this.props.fill,
    }

    return (
      <div style={style} className="html-glyph"/>
    )
  }
}
