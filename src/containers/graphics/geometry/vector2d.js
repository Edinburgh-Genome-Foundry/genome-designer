import invariant from '../../../utils/environment/invariant';
import { isRealNumber, deg2rad, rad2deg } from '../utils';
import Line2D from './line2D';
/**
 * a 2D Vector/Point
 */
export default class Vector2D {
  /**
   * @constructor
   * @param {Number} x
   * @param {Number} y
   */
  constructor(x = 0, y = 0) {
    invariant(isRealNumber(x) && isRealNumber(y), 'Bad parameters');
    this._v = [x, y];
  }

  get x() {
    return this._v[0];
  }

  set x(newValue) {
    invariant(isRealNumber(newValue), 'Bad parameter');
    this._v[0] = newValue;
  }

  get y() {
    return this._v[1];
  }

  set y(newValue) {
    invariant(isRealNumber(newValue), 'Bad parameter');

    this._v[1] = newValue;
  }

  /**
   * comma separated string representation
   * @returns {String}
   */
  toObject() {
    return `${this.x},${this.y}`;
  }

  /**
   * reverse of toObject, but a static member that constructs a new instance
   */
  static fromObject(str) {
    invariant(str, 'Bad parameter');
    const a = str.split(',');
    invariant(a.length === 2, 'Bad parameter');
    const v = new Vector2D();
    v.x = parseFloat(a[0]);
    v.y = parseFloat(a[1]);
    invariant(isRealNumber(v.x), 'Bad parameter');
    invariant(isRealNumber(v.y), 'Bad parameter');
    return v;
  }

  /**
   * string out
   */
  toString() {
    return `v2d(${this.x}, ${this.y})`;
  }

  /**
   * return a copy of ourselves
   * @returns {Vector2D}
   */
  clone() {
    return new Vector2D(this.x, this.y);
  }

  /**
   * return a new vector rounded to the nearest k integer
   * @param {Number} k [description]
   * @return {Vector2D}   [description]
   */
  snap(k) {
    return new Vector2D(Math.floor(this.x / k) * k, Math.floor(this.y / k) * k);
  }

  /**
   * Point on circumference of circle
   * @param {Number} xc
   * @param {Number} yc
   * @param {Number} r
   * @param {Number} degrees
   */
  static pointOnCircumference(xc, yc, r, degrees) {
    return new Vector2D(
      xc + r * Math.cos(deg2rad(degrees)),
      yc + r * Math.sin(deg2rad(degrees))
    );
  }

  /**
   * angle in degrees between two vectors
   * @param {Number} other
   */
  angleBetween(other) {
    let rads = Math.atan2(other.y - this.y, other.x - this.x);

    // atan2 return negative PI radians for the 180-360 degrees ( 9 o'clock to 3 o'clock )
    if (rads < 0) {
      rads = 2 * Math.PI + rads;
    }

    return rad2deg(rads);
  }

  /**
   * add another vector
   * @param {Vector2D} vector
   * @returns {Vector2D}
   */
  add(vector) {
    return new Vector2D(this.x + vector.x, this.y + vector.y);
  }

  /**
   * subtract another vector
   * @param {Vector2D} vector
   * @returns {Vector2D}
   */
  sub(vector) {
    return new Vector2D(this.x - vector.x, this.y - vector.y);
  }

  /**
   * multiply vector by coeffecient or another vector
   * @param {Number|Vector2D} e
   * @returns {Vector2D | Number}
   */
  multiply(e) {
    return isRealNumber(e) ?
      new Vector2D(this.x * e, this.y * e) :
      new Vector2D(this.x * e.x, this.y * e.y);
  }

  /**
   * scale is an alias for multiply
   */
  scale(c) {
    return this.multiply(c);
  }

  /**
   * divide vector by a constant
   * @param {Number} e
   * @returns {Vector2D}
   */
  divide(e) {
    return new Vector2D(this.x / e, this.y / e);
  }

  /**
   * length of vector
   * @returns {number}
   */
  len() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * distance between two points
   * @param {vector} other [description]
   * @return {Number}       [description]
   */
  distance(other) {
    return new Line2D(this, other).len();
  }

  /**
   * dot product
   * @param {vector} other
   * @returns Vector2D
   */
  dot(other) {
    return this.x * other.x + this.y * other.y;
  }

  /**
   * return if within a certain threshold of proximity
   * @param {vector} other     [description]
   * @param {Number} threshold [description]
   * @return {boolean}           [description]
   */
  similar(other, threshold = 1e-6) {
    const dx = Math.abs(this.x - other.x);
    const dy = Math.abs(this.y - other.y);
    return (dx < threshold) && (dy < threshold);
  }

  /**
   * Given a source width/height of a box, return the aspect ratio correct size of the box when scaled down ( or optionally
   * up ) to fit within the given window
   * @param {Number} sourceWidth
   * @param {Number} sourceHeight
   * @param {Number} maxWidth
   * @param {Number} maxHeight
   * @param {Number} upscale
   * @returns {Vector2D}
   */
  static scaleToWindow(sourceWidth, sourceHeight, maxWidth, maxHeight, upscale) {
    // will hold thumb size on exit from this section
    let tx;
    let ty;

    // if image fits entirely in window then just go with image size unless upscaling required
    if (sourceWidth <= maxWidth && sourceHeight <= maxHeight && !upscale) {
      tx = sourceWidth;
      ty = sourceHeight;
    } else {
      // 1. Figure out which dimension is the worst fit, this is the axis/side
      //    that we have to accommodate.

      if ((maxWidth / sourceWidth) < (maxHeight / sourceHeight)) {
        // width is the worst fit
        // make width == window width
        tx = maxWidth;

        // make height in correct ratio to original
        ty = (sourceHeight * (maxWidth / sourceWidth)) >> 0;
      } else {
        // height is the worst fit
        // make height == window height
        ty = maxHeight;

        // make height in correct ratio to original
        tx = (sourceWidth * (maxHeight / sourceHeight)) >> 0;
      }
    }

    return new Vector2D(tx, ty);
  }
}
