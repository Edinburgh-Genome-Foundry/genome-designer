import React, { Component, PropTypes } from 'react';
import { pushState } from 'redux-router';
import { connect } from 'react-redux';

import SketchConstruct from './SketchConstruct';

export class ConstructPage extends Component {
  static propTypes = {
    constructId: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    construct: PropTypes.object.isRequired,
    pushState: PropTypes.func.isRequired,
  }

  //todo - should probably use proper router hook for this
  componentWillMount() {
    const { projectId, construct } = this.props;

    //Check to make sure Construct exists, e.g. if construct has been deleted
    if (!construct) {
      this.props.pushState(null, `/project/${projectId}`);
    }
  }

  render() {
    const { construct } = this.props;

    return (
      <div>
        <h4>{construct.metadata.name}</h4>

        <SketchConstruct construct={construct}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { projectId, constructId } = state.router.params;

  //todo - need to check if this exists
  //react router can probably handle this much better (i.e. check if exists)
  const construct = state.blocks[constructId];

  return {
    projectId,
    constructId,
    construct,
  };
}

export default connect(mapStateToProps, {
  pushState,
})(ConstructPage);
