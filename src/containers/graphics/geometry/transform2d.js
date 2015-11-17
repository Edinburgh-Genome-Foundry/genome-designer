import invariant from '../../../utils/environment/invariant';
import {isRealNumber} from '../utils';
import Vector2D from './vector2d';
import Matrix2D from './matrix2d';

export default class Transform2D {
  /**
   * Represents a 2D transform consisting of Scale/Rotate/Transform components. This is unit less.
   * When composed into a matrix the order of operations is S/R/T. Rotation and scaling always occurs around
   * the center i.e. translation to origin occurs, followed by S, then R and T to the final position
   *
   * @param {Vector2D} [s] - initial scale, defaults to 1,1
   * @param {Number}      [r] - rotation in degrees, defaults to 0
   * @param {Vector2D} [t] - initial translation, defaults to 0, 0
   * @param {Vector2D} [f] - x/y flipping -1 or 1 are the only acceptable values
   *
   * @constructor
   */
  constructor(s = new Vector2D(1, 1), r = 0, t = new Vector2D(), f = new Vector2D(1, 1)) {
    this._s = s.clone();
    this._r = r;
    this._t = t.clone();
    this._f = f.clone();
  }

  /**
   * scale getter, getters/setters always clone input/outputs
   * and invalidate our cache
   * @return {Vector2D}
   */
  get scale() {
    return this._s.clone();
  }

  /**
   * scale setter
   * @param  {Vector2D} v
   */
  set scale(v) {
    // scale must be positive ( use flip to mirror the object )
    invariant(isRealNumber(v.x) && isRealNumber(v.y) && v.x >= 0 && v.y >= 0, 'invalid scale');
    this._s = v.clone();
    this.cache = this.cacheKey = null;
  }

  /**
   * translate getter
   * @return {Vector2D}
   */
  get translate() {
    return this._t.clone();
  }

  /**
   * translate setter
   * @param  {Vector2D} v
   */
  set translate(v) {
    invariant(isRealNumber(v.x) && isRealNumber(v.y), 'invalid translate');
    this._t = v.clone();
    this.cache = this.cacheKey = null;
  }

  /**
   * flip getter setter
   * @return {Vector2D}
   */
  get flip() {
    return this._f.clone();
  }

  /**
   * flip setter
   * @param {Vector2d}
   * @return {void}
   */
  set flip(v) {
    invariant((v.x === 1 || v.x === -1) && (v.y === 1 || v.y === -1), 'invalid flip');
    this._f = v.clone();
    this.cache = this.cacheKey = null;
  }

  /**
   * rotate getter
   * @return {number}
   */
  get rotate() {
    return this._r;
  }

  /**
   * rotate setter
   * @param  {number} v
   */
  set rotate(v) {
    invariant(isRealNumber(v), 'invalid rotate');
    this._r = v;
    this.cache = this.cacheKey = null;
  }

  /**
   * clone the entire transform
   * @return {Transform2D}
   */
  clone() {
    return new Transform2D(this._s, this._r, this._t, this._f);
  }

  /**
   * return a JSONable object representation of the transform
   * @return {object}
   */
  toObject() {
    return {
      translate: this.translate.toObject(),
      scale: this.scale.toObject(),
      flip: this.flip.toObject(),
      rotate: this.rotate,
    };
  }

  /**
   * create a new Transform2D from an object created with toObject
   * @param  {object} o
   * @return Transform2D
   */
  static fromObject(o) {
    const t = new Transform2D();
    t.translate = Vector2D.fromObject(o.translate);
    t.scale = Vector2D.fromObject(o.scale);
    t.flip = Vector2D.fromObject(o.flip);
    t.rotate = o.rotate;
    return t;
  }

  /**
   * compose our transformations into a single 3x3 matrix.
   * The order is consequential of course.
   * 1. translate so center is at the origin
   * 2. apply scaling ( using flip.x/flip.y to set the sign)
   * 3. apply rotation
   * 4. pply translate to final position
   *
   *
   * @param {number} w
   * @param {number} h
   * @returns Matrix2D
   */
  getTransformationMatrix(w, h) {
    invariant(isRealNumber(w) && isRealNumber(h), 'invalid width and/or height');
    // form a cache key
    const key = w + ':' + h;
    // return a copy of our cache if possible
    if (key === this.cacheKey) {
      return new Matrix2D(this.cache._v);
    }
    const _m1 = Matrix2D.translate(-(w / 2), -(h / 2));
    const _m2 = Matrix2D.scale(this.scale.x * this.flip.x, this.scale.y * this.flip.y);
    const _m3 = Matrix2D.rotate(this.rotate);
    const _m4 = Matrix2D.translate(this.translate.x, this.translate.y);
    const _t = _m4.multiplyMatrix(_m3).multiplyMatrix(_m2).multiplyMatrix(_m1);

    this.cache = new Matrix2D(_t._v);
    this.cacheKey = key;

    return _t;
  }
}
