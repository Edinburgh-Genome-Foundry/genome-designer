import invariant from '../../../utils/environment/invariant';
import Vector2D from './vector2d';
import Intersection2D from './intersection2d';

//shallow hasOwnProperty check
const hasProp = (obj, prop) => {
  return obj.hasOwnProperty(prop);
};

export default class Line2D {

  /**
   * a line composed of a start and end point
   * @constructor
   * @param {Vector2D} start
   * @param {Vector2D} end
   */
  constructor(start, end) {
    switch (arguments.length) {
    case 0:
      this._start = new Vector2D();
      this._end = new Vector2D();
      break;

    case 1:
      invariant(hasProp(start, 'x1') && hasProp(start, 'y1') && hasProp(start, 'x2') && hasProp(start, 'y2'), 'Bad parameter');
      this._start = new Vector2D(start.x1, start.y1);
      this._end = new Vector2D(start.x2, start.y2);
      break;

    case 2:
      this._start = start.clone();
      this._end = end.clone();
      break;

    case 4:
      this._start = new Vector2D(arguments[0], arguments[1]);
      this._end = new Vector2D(arguments[2], arguments[3]);
      break;

    default:
      throw new Error('Bad parameters');
    }
  }

  /**
   * getter for start of line
   * @return {Vector2D} [description]
   */
  get start() {
    return this._start.clone();
  }
  /**
   * setter for start
   * @param  {Vector2D} v
   */
  set start(v) {
    this._start = v.clone();
  }

  /**
   * getter for end of line
   * @return {Vector2D} [description]
   */
  get end() {
    return this._end.clone();
  }
  /**
   * setter for end
   * @param  {Vector2D} v
   */
  set start(v) {
    this._end = v.clone();
  }

  /**
   * getter for x start
   * @return {number}
   */
  get x1() {
    return this.start.x;
  }
  /**
   * getter for y start
   * @return {number}
   */
  get y1() {
    return this.start.y;
  }

  /**
   * getter for x end
   * @return {number}
   */
  get x2() {
    return this.end.x;
  }

  /**
   * getter for y end
   * @return {number}
   */
  get y2() {
    return this.end.y;
  }

  /**
   * clone the line
   * @return {Line2D}
   */
  clone() {
    return new Line2D(this.start, this.end);
  }

  /**
   * JSONable version of object
   * @return object
   */
  toObject() {
    return {
      start: this.start.toObject(),
      end: this.end.toObject(),
    };
  }

  /**
   * static constructor, produces a Line from the product of toObject
   * @param  {object} o
   * @return Line2D
   */
  static fromObject(o) {
    invariant(o && o.start && o.end, 'Bad parameter');
    return new Line2D(Vector2D.fromObject(o.start), Vector2D.fromObject(o.end));
  }

  /**
   * return length of line
   * return number
   */
  len() {
    const xl = this.x2 - this.x1;
    const yl = this.y2 - this.y1;
    return Math.sqrt(xl * xl + yl * yl);
  }

  /**
   * return the slope of the line. Returns infinity if the line is vertical
   * @return {number} [description]
   */
  slope() {
    const xd = (this.start.x - this.end.x);
    if (xd === 0) {
      return Infinity;
    }
    return (this.start.y - this.end.y) / xd;
  }

  /**
   * distance of point to line segment formed by this.start, this.end squared.
   * @param {Vector2D} p
   * @return {number} [description]
   */
  distanceToSegment(p) {
    return Math.sqrt(this.distanceToSegmentSquared(p));
  }

  /**
   * return the squared distance of the point to this line
   * @param  {Vector2D} p
   * @return {number}
   */
  distanceToSegmentSquared(p) {
    function sqr(x) {
      return x * x;
    }
    function dist2(v, w) {
      return sqr(v.x - w.x) + sqr(v.y - w.y);
    }
    const v = this.start;
    const w = this.end;
    const l2 = dist2(v, w);
    if (l2 === 0) {
      return dist2(p, v);
    }
    const t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    if (t < 0) {
      return dist2(p, v);
    }
    if (t > 1) {
      return dist2(p, w);
    }
    return dist2(p, {
      x: v.x + t * (w.x - v.x),
      y: v.y + t * (w.y - v.y),
    });
  }


  /**
   * parametric point on line
   * @param {number} p
   */
  pointOnLine(p) {
    const x = this.x1 + (this.x2 - this.x1) * p;
    const y = this.y1 + (this.y2 - this.y1) * p;
    return new Vector2D(x, y);
  }

  /**
   * intersection of this line with another line. This is really line segment intersection since
   * it considers the lines finite as defined by their end points

   * @param {Line2D} other - other line segment to intersect with
   * @returns {Intersection2D}
   */
  intersectWithLine(other) {
    let result;
    const uaT = (other.x2 - other.x1) * (this.y1 - other.y1) - (other.y2 - other.y1) * (this.x1 - other.x1);
    const ubT = (this.x2 - this.x1) * (this.y1 - other.y1) - (this.y2 - this.y1) * (this.x1 - other.x1);
    const uB = (other.y2 - other.y1) * (this.x2 - this.x1) - (other.x2 - other.x1) * (this.y2 - this.y1);

    if (uB !== 0) {
      const ua = uaT / uB;
      const ub = ubT / uB;

      if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
        result = new Intersection2D(new Vector2D(
          this.x1 + ua * (this.x2 - this.x1),
          this.y1 + ua * (this.y2 - this.y1)
        ));

        result.status = 'Intersection';
      } else {
        result = new Intersection2D('No Intersection');
      }
    } else {
      if (uaT === 0 || ubT === 0) {
        result = new Intersection2D('Coincident');
      } else {
        result = new Intersection2D('Parallel');
      }
    }
    return result;
  }

  /**
   * multiple / scale the line by the given coeffecient
   * @param (numner) v
   */
  multiply(v) {
    return new Line2D(this.start.multiply(v), this.end.multiply(v));
  }

  /**
   * stringify the line
   * @return {string}
   */
  toString() {
    return `line2d: ${this.start.toString()} : ${this.end.toString()}`;
  }
}
