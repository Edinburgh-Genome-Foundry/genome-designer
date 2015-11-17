import invariant from '../../../utils/environment/invariant';
import Vector2D from './vector2d';
import Line2D from './line2d';

export default class Box2D {
  /**
   * flexible axis aligned box class. Can be initialized with almost any
   * reasonable values or object i.e. 4 numbers, an object with a combination
   * or x,y,w,h,l,t,r,b,left,top,right,bottom,width,height
   * @param [x]
   * @param [y]
   * @param [w]
   * @param [h]
   * @constructor
   */
  constructor(x, y, w, h) {
    // parse arguments
    if (arguments.length === 4) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
    } else {
      if (arguments.length === 1) {
        // map the properties ( keys ), if present, to our
        // named property ( the values )
        this.extend(arguments[0], {
          x: 'x',
          left: 'x',
          y: 'y',
          top: 'y',
          w: 'w',
          h: 'h',
          width: 'w',
          height: 'h',
          right: 'r',
          bottom: 'b',
          r: 'r',
          b: 'b',
        });
      } else {
        if (arguments.length === 0) {
          this.x = this.y = this.w = this.h = 0;
        } else {
          throw new Error('Bad parameters');
        }
      }
    }
  }

  /**
   * extend ourselves with any of the property names in props,
   * renaming them to the given target property name
   * @param  {[type]} from  [description]
   * @param  {[type]} props [description]
   * @return {[type]}       [description]
   */
  extend(from, props) {
    for (const key in props) {
      if (from.hasOwnProperty(key)) {
        this[props[key]] = from[key];
      }
    }
  }

  /**
   * simple toString 4 CSV values
   * @returns {*}
   */
  toString() {
    return `${this.x}, ${this.y}, ${this.w}, ${this.h}`;
  }

  /**
   * construct a box from a string, opposite of toString
   */
  static fromString(s) {
    invariant(s, 'Bad parameter');
    const values = s.split(',');
    invariant(values && values.length === 4, 'Unexpected format');
    return new Box2D(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), parseFloat(values[3]));
  }

  /**
   * return an AABB defined by the limits of this point
   * and another point
   * @param  {[Vector2D} a
   * @return {Box2D}
   */
  static boxFromPoints(a) {
    let xmin = Number.MAX_VALUE;
    let ymin = Number.MAX_VALUE;
    let xmax = -Number.MAX_VALUE;
    let ymax = -Number.MAX_VALUE;

    for (let i = 0; i < a.length; i += 1) {
      xmin = Math.min(xmin, a[i].x);
      ymin = Math.min(ymin, a[i].y);
      xmax = Math.max(xmax, a[i].x);
      ymax = Math.max(ymax, a[i].y);
    }

    return new Box2D(xmin, ymin, xmax - xmin, ymax - ymin);
  }

  /**
   * accessors for all corners, edges of the box
   */
  get left() {
    return this.x;
  }
  set left(_x) {
    this.x = _x;
  }
  get width() {
    return this.w;
  }
  set width(_w) {
    this.w = _w;
  }
  get height() {
    return this.h;
  }
  set height(_h) {
    this.h = _h;
  }
  get top() {
    return this.y;
  }
  set top(_y) {
    this.y = _y;
  }
  get r() {
    return this.x + this.w;
  }
  set r(_r) {
    this.w = _r - this.x;
  }
  get b() {
    return this.y + this.h;
  }
  set b(_b) {
    this.h = _b - this.y;
  }
  get cx() {
    return this.x + this.w / 2;
  }
  set cx(_cx) {
    this.x = _cx - this.w / 2;
  }
  get cy() {
    return this.y + this.h / 2;
  }
  set cy(_cy) {
    this.y = _cy - this.h / 2;
  }
  get center() {
    return new Vector2D(this.cx, this.cy);
  }
  set center(v) {
    this.cx = v.x;
    this.cy = v.y;
  }
  get topLeft() {
    return new Vector2D(this.x, this.y);
  }
  set topLeft(v) {
    this.x = v.x;
    this.y = v.y;
  }
  get topRight() {
    return new Vector2D(this.r, this.y);
  }
  set topRight(v) {
    this.r = v.x;
    this.y = v.y;
  }
  get bottomRight() {
    return new Vector2D(this.r, this.b);
  }
  set bottomRight(v) {
    this.r = v.x;
    this.b = v.y;
  }
  get bottomLeft() {
    return new Vector2D(this.x, this.b);
  }
  set bottomLeft(v) {
    this.x = v.x;
    this.b = v.y;
  }

  /**
   * return a cloned copy of this
   * @return Box2D
   */
  clone() {
    return new Box2D(this.x, this.y, this.w, this.h);
  }

  /**
   * normalize by returning a new box with positive extents
   */
  normalize() {
    return new Box2D(
      Math.min(this.x, this.r),
      Math.min(this.y, this.b),
      Math.abs(this.w),
      Math.abs(this.h)
    );
  }

  /**
   * return a new Box inflated by the given signed amount
   * @param {number} inflateX
   * @param {number} inflateY
   */
  inflate(inflateX, inflateY) {
    const b = new Box2D(this.x, this.y, this.w + inflateX * 2, this.h + inflateY * 2);
    b.cx = this.cx;
    b.cy = this.cy;
    return b;
  }

  /**
   * scale width/height of box around center returning a new box
   * @param x
   * @param y
   */
  scale(x, y) {
    return new Box2D(
      this.cx - (this.width * x) / 2,
      this.cy - (this.height * y) / 2,
      this.width * x,
      this.height * y);
  }

  /**
   * return a new box that is this box * e
   * @param e
   */
  multiply(e) {
    return new Box2D(this.x * e, this.y * e, this.width * e, this.height * e);
  }

  /**
   * return a new box that is this box / e
   * @param e
   */
  divide(e) {
    return new Box2D(this.x / e, this.y / e, this.width / e, this.height / e);
  }

  /**
   * return true if this box is identical to another box
   * @param other
   * @returns {boolean}
   */
  equals(other) {
    return other.x === this.x &&
      other.y === this.y &&
      other.width === this.width &&
      other.height === this.height;
  }

  /**
   * return a new box that is the union of this box and some other box/rect like object
   * @param box - anything with x,y,w,h properties
   * @returns Box2D - the union of this and box
   */
  union(box) {
    const u = new Box2D(
      Math.min(this.x, box.x),
      Math.min(this.y, box.y),
      0, 0
    );

    u.r = Math.max(this.r, box.x + box.w);
    u.b = Math.max(this.b, box.y + box.h);

    return u;
  }

  /**
   * get the nth edge
   * 0: top left -> top right
   * 1: top right -> bottom right
   * 2: bottom right -> bottom left
   * 3: bottom left -> top left
   * @param {Number} n
   */
  getEdge(n) {
    invariant(n >= 0 && n < 4, 'Bad parameter');
    switch (n) {
    case 0:
      return new Line2D(new Vector2D(this.x, this.y), new Vector2D(this.r, this.y));
    case 1:
      return new Line2D(new Vector2D(this.r, this.y), new Vector2D(this.r, this.b));
    case 2:
      return new Line2D(new Vector2D(this.r, this.b), new Vector2D(this.x, this.b));
    default:
      return new Line2D(new Vector2D(this.x, this.b), new Vector2D(this.x, this.y));
    }
  }

  /**
   * return the union of the given boxes or an empty box if the list is empty
   * @static
   */
  static union(boxes) {
    const u = new Box2D(0, 0, 0, 0);

    if (boxes && boxes.length) {
      u.x = Math.min.apply(null, boxes.map(box => box.x));
      u.y = Math.min.apply(null, boxes.map(box => box.y));
      u.r = Math.min.apply(null, boxes.map(box => box.r));
      u.b = Math.min.apply(null, boxes.map(box => box.b));
    }
    return u;
  }

  /**
   * return the intersection of this box with the other box
   * @param box
   */
  intersectWithBox(box) {
    // minimum of right edges
    const minx = Math.min(this.r, box.r);
    // maximum of left edges
    const maxx = Math.max(this.x, box.x);
    // minimum of bottom edges
    const miny = Math.min(this.b, box.b);
    // maximum of top edges
    const maxy = Math.max(this.y, box.y);
    // if area is greater than zero there is an intersection
    if (maxx < minx && maxy < miny) {
      const x = Math.min(minx, maxx);
      const y = Math.min(miny, maxy);
      const w = Math.max(minx, maxx) - x;
      const h = Math.max(miny, maxy) - y;
      return new Box2D(x, y, w, h);
    }
    return null;
  }

  /**
   * return true if we are completely inside the other box
   * @param other
   */
  isInside(other) {
    return this.x >= other.x &&
      this.y >= other.y &&
      this.r <= other.r &&
      this.b <= other.b;
  }

  /**
   * return true if the given point ( anything with x/y properties ) is inside the box
   * @param p
   */
  pointInBox(p) {
    return p.x >= this.x && p.y >= this.y && p.x < this.r && p.y < this.b;
  }

  /**
   * return true if the box have zero or negative extents in either axis
   */
  isEmpty() {
    return this.w <= 0 || this.h <= 0;
  }
}
