/**
 * Composes single-argument functions from right to left.
 * Could trivially move to multi-var using spread `...arg` if we wanted to...
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing functions from right to
 * left. For example, compose(f, g, h) is identical to arg => f(g(h(arg))).
 */
export default function compose(...funcs) {
  return arg => funcs.reduceRight((composed, nextFunc) => nextFunc(composed), arg);
}
