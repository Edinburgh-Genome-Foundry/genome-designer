/**
 * Constructs an enumeration with keys equal to their value.
 *
 * Input:  {key1: val1, key2: val2}
 * Output: {key1: key1, key2: key2}
 *
 * @param {object} obj
 * @return {object}
 */
export default function keyMirror(obj) {
  // todo - ensure pass in object
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = key;
    return acc;
  }, {});
}
