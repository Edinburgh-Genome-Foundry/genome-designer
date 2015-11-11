import * as ActionTypes from '../constants/ActionTypes';
import makeActionCreator from './makeActionCreator';

import Project from '../models/Project';

//create a new project
export const projectCreate = (name) => {
  return (dispatch, getState) => {
    //temp - force name as ID. will need to reconfigure routing
    const project = new Project(name);
    if (name) {
      project.metadata.name = name;
    }

    dispatch({
      type: ActionTypes.PROJECT_CREATE,
      project,
    });
    return project;
  };
};

//Adds a construct to a project. Does not create the construct. Use blocks.js
export const projectAddConstruct = makeActionCreator(ActionTypes.PROJECT_ADD_CONSTRUCT, 'projectId', 'constructId');
