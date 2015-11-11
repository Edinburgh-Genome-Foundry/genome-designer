/**
 * Use invariant() to assert state which your program assumes to be true.
 * Will strip invariant message in production, but invariant will remain to ensure same logic.
 *
 * Provide ES6 Template strings for message
 */

const __DEV__ = process.env.NODE_ENV !== 'production';

const invariant = function invariant(condition, message) {
  if (__DEV__) {
    if (message === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    let error;
    if (message === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      error = new Error('Invariant Violation: ' + message);
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

export default invariant;
