/**
 * @description Helper for creating simple actions with known keys
 * @param type {ActionType} ActionType
 * @param argNames {...string} argument names
 * @returns {Function} function which takes the arguments defined and creates the corresponding payload
 *
 * @example
 *
 before:

  export function addTodo(text) {
    return {
      type: 'ADD_TODO',
      text
    };
  }

 after:

 export const addTodo = makeActionCreator(ADD_TODO, 'text');

 */
export default function makeActionCreator(type, ...argNames) {
  return function actionAwaitingArgs(...args) {
    const action = {type};
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index];
    });
    return action;
  };
}
