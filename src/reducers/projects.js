import * as ActionTypes from '../constants/ActionTypes';
import Project from '../models/Project';

//testing, default should be {} (but need to hydrate to models)
const initialState = {
  test: Object.assign(new Project('test'), {
    components: ['block1', 'block2'],
  }),
};

export default function projects(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.PROJECT_CREATE : {
    const { project } = action;
    const projectId = project.id;

    if (!projectId && process.env.NODE_ENV !== 'production') {
      /* eslint no-console: [0] */
      console.warn('Attempted to create project without an ID. Pass the project.', project);
      return state;
    }

    return Object.assign({}, state, {[projectId]: project});
  }

    //associated construct with project. Need to create construct on its own.
  case ActionTypes.PROJECT_ADD_CONSTRUCT : {
    //note - using _.merge() would simplify this a lot
    const { projectId, constructId } = action;
    const oldProject = state[projectId];
    const newProject = oldProject.addComponent(constructId);

    return Object.assign({}, state, {[projectId]: newProject});
  }

  default : {
    return state;
  }
  }
}
