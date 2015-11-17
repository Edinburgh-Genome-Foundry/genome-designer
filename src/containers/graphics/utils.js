import * as validators from '../../schemas/fields/validators';
import safeValidate from '../../schemas/fields/safeValidate';

export const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

export const rad2deg = (rad) => {
  return rad * (180 / Math.PI);
};

export const isRealNumber = safeValidate.bind(null, validators.number({reals: true}), false);

/**
 * true if ~1
 * @param  {number} v
 * @return {boolean}
 */
export const isOne = (v) => {
  return Math.abs(1 - v) <= 1e-6;
};

/**
 * true if ~0
 * @param  {number} v
 * @return {boolean}
 */
export const isZero = (v) => {
  return Math.abs(v) <= 1e-6;
};

/**
 * true if the number v is very close to K
 * @param  {number} v
 * @param  {number} K
 * @return {boolean}
 */
export const nearly = (v, K) => {
  return Math.abs(v - K) < 1e-6;
};
