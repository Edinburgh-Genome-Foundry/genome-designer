const noop = () => {};

/**
 * @description
 * wraps a validator function to handle errors. Errors will log in non-production environments.
 *
 * @param validator {Function} function which:
 * 1) returns an Error when there is an error
 * 2) throws an error for invalid, and returns anything but false otherwise
 * @param required {Boolean=} pass `true` if required, otherwise undefined will validate
 * @param input {*} The input value to validate
 * @return {Boolean} true if validation did not return an Error or false
 */
export default function safeValidate(validator = noop, required = false, input) {
  if (required === false && input === undefined) {
    return true;
  }

  try {
    const valid = validator(input);

    if (isError(valid) && process.env.NODE_ENV !== 'production') {
      /* eslint no-console: [0] */
      console.error(valid);
    }

    return !isError(valid) && valid !== false;
  } catch (err) {
    return false;
  }
}

function isError(val) {
  return val instanceof Error;
}
