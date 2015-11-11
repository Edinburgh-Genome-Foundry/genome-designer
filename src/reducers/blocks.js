import * as ActionTypes from '../constants/ActionTypes';

//testing
import Block from '../models/Block';

//testing, default should be {} (but need to hydrate to models)
const initialState = {
  block1: Object.assign(new Block('block1'), {
    components: ['block3', 'block4', 'block5'],
  }),
  block2: Object.assign(new Block('block2'), {
    components: ['block6', 'block7'],
  }),
  block3: new Block('block3'),
  block4: new Block('block4'),
  block5: new Block('block5'),
  block6: new Block('block6'),
  block7: new Block('block7'),
};

export default function blocks(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.BLOCK_CREATE : {
    const { block } = action;
    const blockId = block.id;

    return Object.assign({}, state, {[blockId]: block});
  }

  case ActionTypes.BLOCK_RENAME : {
    const { blockId, name } = action;
    const oldBlock = state[blockId];
    const newBlock = oldBlock.rename(name);
    return Object.assign({}, state, {[blockId]: newBlock});
  }

  case ActionTypes.BLOCK_ADD_COMPONENT : {
    const { blockId, componentId } = action;
    const oldBlock = state[blockId];
    const newBlock = oldBlock.addComponent(componentId);

    return Object.assign({}, state, {[blockId]: newBlock});
  }

  default : {
    return state;
  }
  }
}
