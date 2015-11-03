import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { projectCreate } from '../actions';

import ProjectSelect from '../components/ProjectSelect';

import styles from '../styles/GlobalNav.css';
import withStyles from '../decorators/withStyles';

@withStyles(styles)
class GlobalNav extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    projects: PropTypes.object.isRequired,
    inputValue: PropTypes.string.isRequired,
    projectCreate: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
  }

  handleChange = (nextValue) => {
    const { pushState, projectCreate, projects } = this.props;

    //todo - this should be run in the project page or route transition, not here
    if (!projects[nextValue]) {
      projectCreate(nextValue);
    }

    pushState(null, `/project/${nextValue}`);
  }

  render() {
    return (
      <div>
        <ProjectSelect value={this.props.inputValue}
                       onChange={this.handleChange} />

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    projects : state.projects,
    inputValue: state.router.params.projectId || ''
  };
}

export default connect(mapStateToProps, {
  pushState,
  projectCreate
})(GlobalNav);
