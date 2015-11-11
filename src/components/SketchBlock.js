import React, { Component, PropTypes } from 'react';

import SketchPart from './SketchPart';

import styles from '../styles/SketchBlock.css';
import withStyles from '../decorators/withStyles';

@withStyles(styles)
export default class SketchBlock extends Component {
  static propTypes = {
    block: PropTypes.object.isRequired, //once using real ones, can pass schema as PropType
  }

  render() {
    const { block } = this.props;

    return isPart(block)
      ?
           <SketchPart key={block.id}
                       part={block}/>
      :
           <div className="SketchBlock"
                ref="blockGroup">
             {block.components.map(comp => {
               return (<SketchBlock key={comp.id}
                                    block={comp}/>);
             })}
           </div>;
  }
}

function isPart(component) {
  return component && (!component.components || !component.components.length);
}
