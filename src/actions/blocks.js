import * as ActionTypes from '../constants/ActionTypes';
import makeActionCreator from './makeActionCreator';

import Block from '../models/Block';

export const blockCreate = () => {
  return (dispatch, getState) => {
    const block = new Block();
    dispatch({
      type: ActionTypes.BLOCK_CREATE,
      block,
    });
    return block;
  };
};

export const blockRename = makeActionCreator(ActionTypes.BLOCK_RENAME, 'blockId', 'name');
export const blockAddComponent = makeActionCreator(ActionTypes.BLOCK_ADD_COMPONENT, 'blockId', 'componentId');
