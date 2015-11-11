import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { blockCreate, blockAddComponent } from '../actions/blocks';

import SketchBlock from '../components/SketchBlock';

/**
 @name SketchConstruct
 @description SketchConstruct is the parent element for drawing a construct.

 */

export default class SketchConstruct extends Component {
  static propTypes = {
    construct: PropTypes.object.isRequired,
    components: PropTypes.array.isRequired,

    blockCreate: PropTypes.func.isRequired,
    blockAddComponent: PropTypes.func.isRequired,
  };

  handleClickAddBlock = (event) => {
    const { construct, blockCreate, blockAddComponent } = this.props;
    const block = blockCreate();
    blockAddComponent(construct.id, block.id);
  }

  render() {
    const { construct, components } = this.props;

    return (
      <div ref="constructContainer">
        <div ref="constructTitle"
             className="SketchPart">
          {construct.metadata.name || 'My Construct'}
        </div>
        <div ref="constructComponents"
             className="SketchBlock">
          {components.map(comp =>
            <SketchBlock key={comp.id}
                         block={comp}/>
          )}
        </div>
        <div ref="constructActions"
             className="SketchPart"
             onClick={this.handleClickAddBlock}>
          Add Block
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const components = props.construct.components.map(componentId => state.blocks[componentId]);

  return {
    components,
  };
}

export default connect(mapStateToProps, {
  blockCreate,
  blockAddComponent,
})(SketchConstruct);
