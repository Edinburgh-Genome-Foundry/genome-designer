import { routerStateReducer as router } from 'redux-router';
import { combineReducers } from 'redux';

import projects from './projects';
import blocks from './blocks';

const rootReducer = combineReducers({
  router,
  blocks,
  projects,
});

export default rootReducer;
