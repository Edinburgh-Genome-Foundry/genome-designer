import invariant from '../../../utils/environment/invariant';
import {isRealNumber, isOne, isZero, deg2rad, rad2deg} from '../utils';
import Vector2D from './vector2d';

export default class Matrix2D {

  /**
   * a 3x3 matrix designed to perform transformations in 2D space.
   * This class currently only implements the most basic operations e.g. Matrix x Vector, Matrix x Matrix, Inverse
   * @constructor
   * @param {undefined || Array}
   */
  constructor(v) {
    invariant(v === undefined || Array.isArray(v), 'invalid parameter');
    if (v) {
      this._v = v.slice();
    } else {
      // matrix defaults to the identity matrix with 1,1,1, from top left to bottom right
      this._v = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    }
    invariant(this.validate(), 'Bad Matrix');
  }

  /**
   * clone the matrix
   * @return {Matrix2D} [description]
   */
  clone() {
    return new Matrix2D(this._v);
  }

  /**
   * return true if matrix is approximately identity
   */
  isIdentity() {
    return isOne(this._v[0]) &&
      isZero(this._v[1]) &&
      isZero(this._v[2]) &&
      isZero(this._v[3]) &&
      isOne(this._v[4]) &&
      isZero(this._v[5]) &&
      isZero(this._v[6]) &&
      isZero(this._v[7]) &&
      isOne(this._v[8]);
  }

  /**
   * ensure all the numbers in the matrix are reasonable
   */
  validate() {
    if (this._v && this._v.length === 9) {
      for (let i = 0; i < 9; i += 1) {
        // all 9 elements should be numbers and not NaN or Infinity or -Infinity
        if (!isRealNumber(this._v[i])) {
          return false;
        }
      }
      // bottom row should always be identity, or very close
      if (!isZero(this._v[6]) || !isZero(this._v[7]) || !isOne(this._v[8])) {
        return false;
      }
      return true;
    }
    return false;
  }

  /**
   * return the decomposed rotation value from the matrix ( in degrees )
   * NOTE: Matrices can contain ambiguous sets of transforms...use at your peril
   * @returns Number - rotation in degrees
   */
  decomposeRotation() {
    return rad2deg(Math.atan2(this._v[3], this._v[0]));
  }

  /**
   * likewise for translation
   * @returns Vector2D
   */
  decomposeTranslate() {
    return new Vector2D(this._v[2], this._v[5]);
  }


  /**
   * likewise for scale
   * @returns {Vector2D}
   */
  decomposeScale() {
    const scaleX = Math.sqrt(this._v[0] * this._v[0] + this._v[1] * this._v[1]);
    const scaleY = Math.sqrt(this._v[3] * this._v[3] + this._v[4] * this._v[4]);
    return new Vector2D(scaleX, scaleY);
  }

  /**
   * returns an object with translate: Vector2D, rotate: number, scale: Vector2D.
   * Based on http://math.stackexchange.com/questions/13150/extracting-rotation-scale-values-from-2d-transformation-matrix
   */
  decompose() {
    return {
      translate: this.decomposeTranslate(),
      rotate: this.decomposeRotation(),
      scale: this.decomposeScale(),
    };
  }

  /**
   * construct a translation matrix
   * @param  {number} x
   * @param  {number} y
   * @return {Matrix2D}
   */
  static translate(x, y) {
    const m = new Matrix2D();
    m._v[2] = x;
    m._v[5] = y;
    return m;
  }

  /**
   * construct a scale matrix
   * @param  {number} x
   * @param  {number} y
   * @return {Matrix2D}
   */
  static scale(x, y) {
    const m = new Matrix2D();
    m._v[0] = x;
    m._v[4] = y;
    return m;
  }
  /**
   * construct a rotation matrix
   * @param  {number} degrees
   * @return {Matrix2D}
   */
  static rotate(degrees) {
    const m = new Matrix2D();
    const r = deg2rad(degrees);
    m._v[0] = Math.cos(r);
    m._v[1] = -Math.sin(r);
    m._v[3] = Math.sin(r);
    m._v[4] = Math.cos(r);
    return m;
  }
  /**
   * multiply a vector by this matrix, returning a new vector
   * @param {Vector2D} vector
   * @return Vector2D
   */
  multiplyVector(vector) {
    const out = new Vector2D();
    // dot matrix with vector, using 1 for the missing w component of our vector
    out.x = this._v[0] * vector.x + this._v[1] * vector.y + this._v[2] * 1;
    out.y = this._v[3] * vector.x + this._v[4] * vector.y + this._v[5] * 1;
    return out;
  }

  /**
   * multiply this matrix by another
   * @param {Matrix2D} m
   * @param Matrix2D
   */
  multiplyMatrix(m) {
    const o = new Matrix2D();
    const a = this._v;
    const b = m._v;
    const c = o._v;
    // dot product of first row with each column of m
    c[0] = a[0] * b[0] + a[1] * b[3] + a[2] * b[6];
    c[1] = a[0] * b[1] + a[1] * b[4] + a[2] * b[7];
    c[2] = a[0] * b[2] + a[1] * b[5] + a[2] * b[8];
    // dot product of second row with each column of m
    c[3] = a[3] * b[0] + a[4] * b[3] + a[5] * b[6];
    c[4] = a[3] * b[1] + a[4] * b[4] + a[5] * b[7];
    c[5] = a[3] * b[2] + a[4] * b[5] + a[5] * b[8];
    // dot product of third row with each column of m
    c[6] = a[6] * b[0] + a[7] * b[3] + a[8] * b[6];
    c[7] = a[6] * b[1] + a[7] * b[4] + a[8] * b[7];
    c[8] = a[6] * b[2] + a[7] * b[5] + a[8] * b[8];
    // validate
    invariant(o.validate(), 'Bad Matrix');
    return o;
  }

  /**
   * Return the inverse of this matrix
   * @return Matrix2D
   */
  inverse() {
    const v = this._v;
    // computes the inverse of a matrix m
    // 1. calculate the determinant http://en.wikipedia.org/wiki/Determinant#3.C2.A0.C3.97.C2.A03_matrices
    const det = v[0] * (v[4] * v[8] - v[7] * v[5]) -
      v[1] * (v[3] * v[8] - v[5] * v[6]) +
      v[2] * (v[3] * v[7] - v[4] * v[6]);
    const invdet = 1 / det;
    const out = new Matrix2D();
    const o = out._v;
    o[0] = (v[4] * v[8] - v[7] * v[5]) * invdet;
    o[1] = (v[2] * v[7] - v[1] * v[8]) * invdet;
    o[2] = (v[1] * v[5] - v[2] * v[4]) * invdet;
    o[3] = (v[5] * v[6] - v[3] * v[8]) * invdet;
    o[4] = (v[0] * v[8] - v[2] * v[6]) * invdet;
    o[5] = (v[3] * v[2] - v[0] * v[5]) * invdet;
    o[6] = (v[3] * v[7] - v[6] * v[4]) * invdet;
    o[7] = (v[6] * v[1] - v[0] * v[7]) * invdet;
    o[8] = (v[0] * v[4] - v[3] * v[1]) * invdet;
    invariant(out.validate(), 'Bad Matrix');
    return out;
  }

  /**
   * import our values from a 6 element css matrix
   * @param cssMatrix
   */
  importCSSValues(cssMatrix) {
    // reset to identity first ( since the CSS matrix doesn't have a bottom row )
    this._v = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    this._v[0] = cssMatrix.a;
    this._v[3] = cssMatrix.b;
    this._v[1] = cssMatrix.c;
    this._v[4] = cssMatrix.d;
    this._v[2] = cssMatrix.e;
    this._v[5] = cssMatrix.f;
    return this;
  }

  /**
   * get the string form of the matrix formatted for use with the css property 'transform'
   * CSS and SVG use a slightly strange form of the 3x3 matrix. It does not include the bottom row
   * ( which should always be identity and is written in column order.
   * @return string
   */
  toCSSString() {
    const v = this._v;
    return `matrix(${v[0]}, ${v[3]}, ${v[1]}, ${v[4]}, ${v[2]}, ${v[5]})`;
  }
}
