import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import styles from '../styles/ProjectHeader.css';
import withStyles from '../decorators/withStyles';

@withStyles(styles)
export default class ProjectHeader extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
  }

  //because we dont need to persist this state, it can exist in the component
  state = {
    detailVisible: false,
  }

  handleToggleDetail = (event) => {
    this.setState({
      detailVisible: !this.state.detailVisible,
    });
  }

  render() {
    const { project } = this.props;

    return (
      <div className="ProjectHeader">

        <div className="ProjectHeader-info">
          <div className="ProjectHeader-icon"
               style={{
                 backgroundImage: `url(${project.metadata.image})`,
               }}></div>
          <div className="ProjectHeader-text">
            <Link to={`/project/${project.id}`}
                  className="ProjectHeader-title">
              {project.metadata.name}
            </Link>
            {this.state.detailVisible &&
            <p className="ProjectHeader-description">
              {project.metadata.description}
            </p>
            }
          </div>
        </div>

        <div className="ProjectHeader-actions">
          <span className="ProjectHeader-detailToggle"
                onClick={this.handleToggleDetail}>V</span>
        </div>
      </div>
    );
  }
}
