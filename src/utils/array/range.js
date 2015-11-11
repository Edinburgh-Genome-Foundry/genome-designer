/**
 * Creates an n-length array whose values are numeric indices
 * @param number
 * @returns {Array<number>} array with `number` elements, where each element is its index
 */
export default function range(number) {
  // Function treats holes as undefined, while Array.map skips uninitialized values
  const arr = Array.apply(null, new Array(number));
  return arr.map(function rangeReplacer(value, index) { return index; });
}
