import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { partUpdateName } from '../actions';

import SketchPartName from './SketchPartName';

import styles from '../styles/SketchPart.css';
import withStyles from '../decorators/withStyles';

@withStyles(styles)
export class SketchPart extends Component {

  static PropTypes = {
    part: PropTypes.object.isRequired,  //once using real ones, can pass schema as PropType
    partUpdateName : PropTypes.func.isRequired
  }

  handleRename = (e) => {
    let partId  = this.props.part.id,
        newName = e.target.value;

    this.props.partUpdateName(partId, newName);
  }

  render () {
    let {part} = this.props,
        partName = part.metadata.name;

    return (
      <div ref="partGroup"
           className="SketchPart"
           style={{backgroundColor: part.color, width: '120px', height: '30px'}}>
        <SketchPartName partName={partName}
                        onChange={this.handleRename}/>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {}
}

export default connect(mapStateToProps, {
  partUpdateName
})(SketchPart);
