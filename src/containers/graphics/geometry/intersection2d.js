import invariant from '../../../utils/environment/invariant';

export default class Intersection2D {
  /**
   * the generic results of various types of intersection test.
   * For valid intersections the points property is an array of
   * Vector2D objects. There is also a point property that returns
   * the first point in the points array. The status property is a string that indicates why the intersection test
   * failed if any
   * @constructor
   * @param {G.Vector2D|String|undefined} arg - can be a vector or a status string or nothing
   */
  constructor(arg) {
    if (arg && arg.constructor.name === 'Vector2D') {
      this.points = [arg];
    } else {
      if (typeof arg === 'string') {
        this._status = arg;
      }
      this.points = [];
    }
  }

  /**
   * return the first point in our intersection set or null if there are no intersections
   * @return {[type]} [description]
   */
  get point() {
    if (this.points && this.points.length) {
      return this.points[0];
    }
    return null;
  }

  /**
   * return our status string
   * @return String
   */
  get status() {
    return this._status;
  }

  /**
   * setter for our status
   * @param  {String} s
   */
  set status(s) {
    invariant(typeof s === 'string', 'expected a string');
    this._status = s;
  }

  /**
   * add a point to our intersection set
   * @param {Vector2D} p
   */
  add(p) {
    this.points = this.points || [];
    this.points.push(p);
  }
}
