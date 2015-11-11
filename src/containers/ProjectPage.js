import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { pushState } from 'redux-router';
import { blockCreate } from '../actions/blocks';
import { projectAddConstruct } from '../actions/projects';

import SketchConstruct from './SketchConstruct';
import ProjectHeader from '../components/ProjectHeader';

import styles from '../styles/ProjectPage.css';
import withStyles from '../decorators/withStyles';

@withStyles(styles)
export class ProjectPage extends Component {
  static propTypes = {
    constructs: PropTypes.array.isRequired,
    project: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    constructId: PropTypes.string, //only visible if a construct is selected

    children: PropTypes.func, //react-router
    blockCreate: PropTypes.func.isRequired,
    projectAddConstruct: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
  }

  handleClickAddConstruct = (event) => {
    const { projectId, blockCreate, projectAddConstruct } = this.props;
    const construct = blockCreate();
    const constructId = construct.id;

    projectAddConstruct(projectId, constructId);
  }

  handleClickFromInventory = (event) => {
    //todo
  }

  render() {
    const { children, projectId, constructId, project, constructs } = this.props;

    //todo - need error handling here. Should be in route transition probably?
    //right now there is some handling in GlobalNav when using ProjectSelect. Doesn't handle request of the URL.
    if (!project || !project.metadata) {
      return <p>todo - need to handle this (direct request)</p>;
    }

    const constructSelected = !!constructId;

    return (
      <div className="ProjectPage">
        <ProjectHeader project={project}/>

        {/* if viewing specific construct, let routing take over*//* if viewing specific construct, let routing take over*/}
        {constructSelected && children}

        {/* otherwise, show all the constructs... *//* otherwise, show all the constructs... */}
        {!constructSelected && constructs.map(construct => {
          return (
            <div key={construct.id}>
              <h3>
                <Link to={`/project/${projectId}/${construct.id}`}>
                  Construct {construct.metadata.name}
                </Link>
              </h3>

              <SketchConstruct construct={construct}/>
            </div>
          );
        })}

        <div className="ProjectPage-actions">
          <a className="ProjectPage-action"
             onClick={this.handleClickAddConstruct}>
            <span className="dummyButton"></span>
            Add Construct
          </a>
          <a className="ProjectPage-action"
             onClick={this.handleClickFromInventory}>
            <span className="dummyButton"></span>
            From Inventory
          </a>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { projectId, constructId } = state.router.params;
  const project = state.projects[projectId];
  const constructs = project.components.map(componentId => state.blocks[componentId]);

  return {
    projectId,
    constructId,
    project,
    constructs,
  };
}

export default connect(mapStateToProps, {
  blockCreate,
  projectAddConstruct,
  pushState,
})(ProjectPage);
