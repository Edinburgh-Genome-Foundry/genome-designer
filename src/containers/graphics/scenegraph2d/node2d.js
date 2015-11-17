import invariant from '../../../utils/environment/invariant';
import React, {
  Component,
  PropTypes
} from 'react';
import uuid from 'node-uuid';
import Transform2D from '../geometry/transform2d';
import Matrix2D from '../geometry/matrix2d';
import Vector2D from '../geometry/vector2d';
import NodeText2D from './nodetext2d.js';
import Rectangle2D from './glyphs/html/rectangle2d';
import Ellipse2D from './glyphs/svg/ellipse2d';

export default class Node2D extends Component {

  /**
   * base class
   */
  constructor (props) {
    super(props);
    this.uuid = uuid.v4();
    this.children = [];
  }

  addChild(child) {
    this.children.push(child);
    this.forceUpdate();
  }

  render () {

    // compose our transform
    const t2d = new Transform2D();
    t2d.translate = new Vector2D(this.props.x, this.props.y);
    t2d.rotate = this.props.r;
    const m2d = t2d.getTransformationMatrix(this.props.w, this.props.h);

    // construct our glyph ( if we have one e.g. the root node doesn't have a glyph )
    let glyph;
    switch (this.props.glyph) {
      case 'rectangle':
        glyph = <Rectangle2D w={this.props.w} h={this.props.h} fill={this.props.fill}/>
        break;
      case 'ellipse':
        glyph = <Ellipse2D w={this.props.w} h={this.props.h} fill={this.props.fill}/>
        break;
      default:
        glyph = null;
        break;
    }

    // set width / height via style
    const style = {
      width: this.props.w + 'px',
      height: this.props.h + 'px',
      transform: m2d.toCSSString()
    }

    // render DIV with transform, then our glyph, then our text, then our children
    return (
      <div style={style} className="node" ref={this.uuid}>
        {glyph}
        <NodeText2D text={this.props.text} width={this.props.w} height={this.props.h}/>
        {this.props.children}
        {this.children}
      </div>
    );
  }
}

Node2D.defaultProps = {
  text: '',
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  r: 0
}
