var _ = require('underscore');
var U = require('./utils');

var G = {};

/**
 * move the start and end points of the array of points
 * toward the subsequent / previous point by the given offsets
 * @param  {[type]} p          [description]
 * @param  {[type]} startInset [description]
 * @param  {[type]} endInset   [description]
 * @return {[type]}            [description]
 */
G.insetPath = function(p, startInset, endInset) {

  U.ASSERT(p && p.length >= 2, "Bad parameter");

  // parametric limit for inset so that it does not exceed the length
  // of the segment being inset.

  var K = 0.99;

  var lx = p[1].x - p[0].x;
  var pp = lx ? Math.min(K, startInset / Math.abs(lx)) : 0;
  var x = p[0].x + lx * pp;

  var ly = p[1].y - p[0].y;
  pp = ly ? Math.min(K, startInset / Math.abs(ly)) : 0;
  var y = p[0].y + ly * pp;

  p[0] = new G.Vector2D(x, y);

  var n = p.length - 1;

  lx = p[n-1].x - p[n].x;
  pp = lx ? Math.min(K, endInset / Math.abs(lx)) : 0;
  x = p[n].x + lx * pp;

  ly = p[n-1].y - p[n].y;
  pp = ly ? Math.min(K, endInset / Math.abs(ly)) : 0;
  y = p[n].y + ly * pp;

  p[n] = new G.Vector2D(x, y);

};

/**
 * convert from common units using the given DPI as a basis.
 * Acceptable units are 'px', 'in', 'cm', 'pt', 'pc'
 * @param {Number} from
 * @param {String} fromUnits
 * @param {String} toUnits
 * @param {Number} [_dpi] - defaults to 96
 *
 */
G.ConvertUnits = function (from, fromUnits, toUnits, _dpi) {

  U.ASSERT(U.IS_NUMBER(from), "Bad parameter");

  var dpi = _dpi || 96;

  U.ASSERT(U.IS_POSITIVE_NUMBER(dpi), "Bad parameter");

  var map = {
    'px': 1,
    'in': dpi,
    'pt': dpi / 72,
    'pc': dpi / 6,
    'mm': dpi / 25.4,
    'cm': dpi / 2.54
  };

  var units = Object.keys(map);

  U.ASSERT(units.indexOf(fromUnits) >= 0 && units.indexOf(toUnits) >= 0, "Bad units");

  var pixels = from * map[fromUnits];

  return pixels / map[toUnits];
};

G.ToPixels = function (s, _dpi) {

  var parts = /^\s*(\d*\.?\d*)\s*(px|in|pt|pc|mm|cm)?\s*$/;

  var match = parts.exec(s);

  U.ASSERT(match, "Could not parse");

  var units = match[2] || 'px';
  var from = parseFloat(match[1]);

  return G.ConvertUnits(from, units, 'px', _dpi);
};

/**
 * a 2D Vector/Point
 * @param [x]
 * @param [y]
 * @constructor
 */
G.Vector2D = function (x, y) {

  this._v = [x || 0, y || 0];

  // still necessary to check for Infinity etc
  U.ASSERT(U.IS_NUMBER(this._v[0]), U.IS_NUMBER(this._v[1]), "Bad parameters");

  Object.defineProperty(this, 'x', {

    get: function () {
      return this._v[0];
    }.bind(this),

    set: function (newValue) {

      U.ASSERT(U.IS_NUMBER(newValue), "Bad parameter");

      this._v[0] = newValue;

    }.bind(this),

    enumerable: true
  });

  Object.defineProperty(this, 'y', {

    get: function () {
      return this._v[1]
    }.bind(this),

    set: function (newValue) {

      U.ASSERT(U.IS_NUMBER(newValue), "Bad parameter");

      this._v[1] = newValue;

    }.bind(this),

    enumerable: true
  });
};


/**
 * comma separated string representation
 * @returns {*}
 */
G.Vector2D.prototype.toObject = function () {

  return _.sprintf("%f,%f", this.x, this.y);
};

/**
 * reverse of toJSON, but a static member that constructs a new instance
 */
G.Vector2D.fromObject = function (str) {

  U.ASSERT(str, "Bad parameter");
  var a = str.split(',');
  U.ASSERT(a.length === 2, "Bad parameter");
  var v = new G.Vector2D();
  v.x = parseFloat(a[0]);
  v.y = parseFloat(a[1]);
  U.ASSERT(U.IS_NUMBER(v.x, "Bad parameter"));
  U.ASSERT(U.IS_NUMBER(v.y, "Bad parameter"));
  return v;
};

/**
 * return a copy of ourselves
 * @returns {G.Vector2D}
 */
G.Vector2D.prototype.clone = function () {

  return new G.Vector2D(this._v[0], this._v[1]);
};

/**
 * return a new vector rounded to the nearest k integer
 * @param  {[type]} k [description]
 * @return {[type]}   [description]
 */
G.Vector2D.prototype.snap = function(k) {
  return new G.Vector2D(Math.floor(this.x / k) * k, Math.floor(this.y / k) * k);
};

/**
 * Point on circumference of circle
 * @param xc
 * @param yc
 * @param r
 * @param degrees
 */
G.Vector2D.pointOnCircumference = function (xc, yc, r, degrees) {

  return new G.Vector2D(
    xc + r * Math.cos(U.D2R(degrees)),
    yc + r * Math.sin(U.D2R(degrees))
  );
};

/**
 * Point on circumference of ellipse centered in box
 * @param xc
 * @param yc
 * @param r
 * @param degrees
 */
G.Vector2D.pointOnEllipse = function (b, degrees) {

  return new G.Vector2D(
    b.cx + b.w / 2 * Math.cos(U.D2R(degrees)),
    b.cy + b.h / 2 * Math.sin(U.D2R(degrees))
  );
};

/**
 * angle in degrees between two vectors
 * @param other
 */
G.Vector2D.prototype.angleBetween = function (other) {

  var rads = Math.atan2(other.y - this.y, other.x - this.x);

  // atan2 return negative PI radians for the 180-360 degrees ( 9 o'clock to 3 o'clock )

  if (rads < 0) {
    rads = 2 * Math.PI + rads;
  }

  return U.R2D(rads);

};

/**
 * add another vector
 * @param {G.Vector2D} vector
 * @returns {G.Vector2D}
 */
G.Vector2D.prototype.add = function (vector) {
  return new G.Vector2D(this.x + vector.x, this.y + vector.y);
};

/**
 * subtract another vector
 * @param {G.Vector2D} vector
 * @returns {G.Vector2D}
 */
G.Vector2D.prototype.sub = function (vector) {
  return new G.Vector2D(this.x - vector.x, this.y - vector.y);
};

/**
 * multiply vector by coeffecient or another vector
 * @param {Number} e
 * @returns {G.Vector2D | Number}
 */
G.Vector2D.prototype.multiply = function (e) {

  if (_.isNumber(e)) {
    return new G.Vector2D(this.x * e, this.y * e);
  }
  return new G.Vector2D(this.x * e.x, this.y * e.y);
};

/**
 * divide vector by a constant
 * @param {Number} e
 * @returns {G.Vector2D}
 */
G.Vector2D.prototype.divide = function (e) {
  U.ASSERT(e !== 0, "Div by zero");
  return new G.Vector2D(this.x / e, this.y / e);
};

/**
 * length of vector
 * @returns {number}
 */
G.Vector2D.prototype.len = function () {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};

/**
 * distance between two points
 * @param  {[type]} other [description]
 * @return {[type]}       [description]
 */
G.Vector2D.prototype.distance = function (other) {
  return new G.LineSegment(this, other).len();
};

/**
 * dot product
 * @param other
 * @returns G.Vector2D
 */
G.Vector2D.prototype.dot = function (other) {
  return new G.Vector2D(this.x * other.x + this.y * other.y);
};

/**
 * string out
 */
G.Vector2D.prototype.toString = function () {
  return _.sprintf("v2d(%f, %f)", this.x, this.y);
};

/**
 * return if within a certain threshold of proximity
 * @param  {[type]} other     [description]
 * @param  {[type]} threshold [description]
 * @return {[type]}           [description]
 */
G.Vector2D.prototype.similar = function(other, threshold) {
  var t = threshold || 1e-6;
  var dx = Math.abs(this.x - other.x);
  var dy = Math.abs(this.y - other.y);
  return (dx < t) && (dy < t);
};

/**
 * Given a source width/height of a box, return the aspect ratio correct size of the box when scaled down ( or optionally
 * up ) to fit within the given window
 * @param sourceWidth
 * @param sourceHeight
 * @param maxWidth
 * @param maxHeight
 * @param upscale
 * @returns {G.Vector2D}
 */
G.Vector2D.scaleToWindow = function (sourceWidth, sourceHeight, maxWidth, maxHeight, upscale) {

  // will hold thumb size on exit from this section

  var tx, ty;

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

  // return as point

  return new G.Vector2D(tx, ty);
};

/**
 * a 3x3 matrix designed to perform transformations in 2D space.
 * This class currently only implements the most basic operations e.g. Matrix x Vector, Matrix x Matrix, Inverse
 * @constructor
 */
G.Matrix2D = function (v) {

  if (v) {
    this._v = v.slice();
  } else {
    // matrix defaults to the identity matrix with 1,1,1, from top left to bottom right
    this._v = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  }

  U.ASSERT(this.validate(), "Bad Matrix");
};

/**
 * copy the matrix
 * @return {[type]} [description]
 */
G.Matrix2D.prototype.clone = function () {
  return new G.Matrix2D(this._v);
};

/**
 * return true if matrix is approximately identity
 */
G.Matrix2D.prototype.isIdentity = function () {

  return U.ONE(this._v[0]) &&
    U.ZERO(this._v[1]) &&
    U.ZERO(this._v[2]) &&
    U.ZERO(this._v[3]) &&
    U.ONE(this._v[4]) &&
    U.ZERO(this._v[5]) &&
    U.ZERO(this._v[6]) &&
    U.ZERO(this._v[7]) &&
    U.ONE(this._v[8]);

};


/**
 * ensure all the numbers in the matrix are reasonable
 */
G.Matrix2D.prototype.validate = function () {

  if (this._v && this._v.length === 9) {

    for (var i = 0; i < 9; i += 1) {

      if (!_.isNumber(this._v[i]) || _.isNaN(this._v[i]) || !_.isFinite(this._v[i])) {
        return false;
      }
    }

    // bottom row should always be identity, or very close

    if (!U.ZERO(this._v[6]) || !U.ZERO(this._v[7]) || !U.ONE(this._v[8])) {
      return false;
    }

    // here all looks good

    return true;
  }

  return false;
};

/**
 * return the decomposed rotation value from the matrix ( in degrees )
 * NOTE: Matrices can contain ambiguous sets of transforms...use at your peril
 * @returns Number - rotation in degrees
 */
G.Matrix2D.prototype.decomposeRotation = function () {

  return U.R2D(Math.atan2(this._v[3], this._v[0]));

};
/**
 * likewise for translation
 * @returns {G.Vector2D}
 */
G.Matrix2D.prototype.decomposeTranslate = function () {

  return new G.Vector2D(this._v[2], this._v[5]);
};

/**
 * likewise for scale
 * @returns {G.Vector2D}
 */
G.Matrix2D.prototype.decomposeScale = function () {

  var signA = this._v[0] >= 0 ? 1 : -1;
  var signB = this._v[4] >= 0 ? 1 : -1;

  var scaleX = Math.sqrt(this._v[0] * this._v[0] + this._v[1] * this._v[1]);
  var scaleY = Math.sqrt(this._v[3] * this._v[3] + this._v[4] * this._v[4]);

  return new G.Vector2D(scaleX, scaleY);
};

/**
 * returns an object with translate: Vector2D, rotate: number, scale: Vector2D.
 * Based on http://math.stackexchange.com/questions/13150/extracting-rotation-scale-values-from-2d-transformation-matrix
 */
G.Matrix2D.prototype.decompose = function () {

  return {
    translate: this.decomposeTranslate(),
    rotate: this.decomposeRotation(),
    scale: this.decomposeScale()
  };

};


G.Matrix2D.translate = function (x, y) {

  var m = new G.Matrix2D();

  m._v[2] = x;
  m._v[5] = y;

  return m;
};

G.Matrix2D.scale = function (x, y) {

  var m = new G.Matrix2D();

  m._v[0] = x;
  m._v[4] = y;

  return m;
};

G.Matrix2D.rotate = function (degrees) {

  var m = new G.Matrix2D();

  var r = U.D2R(degrees);

  m._v[0] = Math.cos(r);
  m._v[1] = -Math.sin(r);
  m._v[3] = Math.sin(r);
  m._v[4] = Math.cos(r);

  return m;
};

/**
 *
 * @param {G.Vector2D} vector
 */
G.Matrix2D.prototype.multiplyVector = function (vector) {

  var out = new G.Vector2D();

  // dot matrix with vector, using 1 for the missing w component of our vector

  out.x = this._v[0] * vector.x + this._v[1] * vector.y + this._v[2] * 1;
  out.y = this._v[3] * vector.x + this._v[4] * vector.y + this._v[5] * 1;

  return out;
};

/**
 *
 * @param {G.Vector2D} vector
 */
G.Matrix2D.prototype.multiplyMatrix = function (m) {

  var o = new G.Matrix2D();

  var a = this._v,
    b = m._v,
    c = o._v;

  // [1,2,3] [a,b,c] [1 * a + 2 * d + 3 * g, ....
  // [4,5,6] [d,e,f] [4 * a + 5 * d + 6 * g, ...
  // [7,8,9] [g,h,i] [

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

  U.ASSERT(o.validate(), "Bad Matrix");

  return o;
};

/**
 * return a new matrix that is the inverse of the original
 */
G.Matrix2D.prototype.inverse = function () {

  var v = this._v;

  // computes the inverse of a matrix m

  // 1. calculate the determinant http://en.wikipedia.org/wiki/Determinant#3.C2.A0.C3.97.C2.A03_matrices

  var det = v[0] * (v[4] * v[8] - v[7] * v[5]) -
    v[1] * (v[3] * v[8] - v[5] * v[6]) +
    v[2] * (v[3] * v[7] - v[4] * v[6]);

  var invdet = 1 / det;

  var out = new G.Matrix2D();
  var o = out._v;

  o[0] = (v[4] * v[8] - v[7] * v[5]) * invdet;
  o[1] = (v[2] * v[7] - v[1] * v[8]) * invdet;
  o[2] = (v[1] * v[5] - v[2] * v[4]) * invdet;
  o[3] = (v[5] * v[6] - v[3] * v[8]) * invdet;
  o[4] = (v[0] * v[8] - v[2] * v[6]) * invdet;
  o[5] = (v[3] * v[2] - v[0] * v[5]) * invdet;
  o[6] = (v[3] * v[7] - v[6] * v[4]) * invdet;
  o[7] = (v[6] * v[1] - v[0] * v[7]) * invdet;
  o[8] = (v[0] * v[4] - v[3] * v[1]) * invdet;

  U.ASSERT(out.validate(), "Bad Matrix");

  return out;

};

/**
 * import our values from a 6 element css matrix
 * @param cssMatrix
 */
G.Matrix2D.prototype.importCSSValues = function (cssMatrix) {

  // reset to identity first ( since the CSS matrix doesn't have a bottom row )

  this._v = [1, 0, 0, 0, 1, 0, 0, 0, 1];

  this._v[0] = cssMatrix.a;
  this._v[3] = cssMatrix.b;
  this._v[1] = cssMatrix.c;
  this._v[4] = cssMatrix.d;
  this._v[2] = cssMatrix.e;
  this._v[5] = cssMatrix.f;

  return this;
};

/**
 * get the string form of the matrix formatted for use with the css property 'transform'
 * CSS and SVG use a slightly strange form of the 3x3 matrix. It does not include the bottom row
 * ( which should always be identity and is written in column order.
 */
G.Matrix2D.prototype.toCSSString = function () {

  var v = this._v;

  var s = _.sprintf('matrix(%f, %f, %f, %f, %f, %f)',
    v[0], v[3], v[1], v[4], v[2], v[5]);

  return s;
};

/**
 * toString is just the CSS representation
 */
G.Matrix2D.prototype.toString = function () {
  return this.toCSSString();
}

/**
 * Represents a 2D transform consisting of Scale/Rotate/Transform components. This is unit less.
 * When composed into a matrix the order of operations is S/R/T. Rotation and scaling always occurs around
 * the center i.e. translation to origin occurs, followed by S, then R and T to the final position
 *
 * @param {G.Vector2D} [s] - initial scale, defaults to 1,1
 * @param {Number}      [r] - rotation in degrees, defaults to 0
 * @param {G.Vector2D} [t] - initial translation, defaults to 0, 0
 * @param {G.Vector2D} [f] - x/y flipping -1 or 1 are the only acceptable values
 *
 * @constructor
 */
G.Transform2D = function (s, r, t, f) {

  this._s = s || new G.Vector2D(1, 1);

  this._r = r || 0;

  this._t = t || new G.Vector2D();

  this._f = f || new G.Vector2D(1, 1);


  Object.defineProperty(this, 'scale', {

    get: function () {
      return this._s.clone();
    }.bind(this),

    set: function (newScale) {

      U.ASSERT(U.IS_A(newScale, G.Vector2D), "Bad parameter");
      this._s = newScale.clone();

      this.cache = this.cacheKey = null;

    }.bind(this),

    enumerable: true
  });

  Object.defineProperty(this, 'rotate', {

    get: function () {
      return this._r;
    }.bind(this),

    set: function (newRotate) {

      U.ASSERT(U.IS_NUMBER(newRotate), "Bad parameter");
      // clamp to +/- 359.999999
      this._r = newRotate % 360;

      this.cache = this.cacheKey = null;

    }.bind(this),

    enumerable: true
  });

  Object.defineProperty(this, 'translate', {

    get: function () {
      return this._t.clone();
    }.bind(this),

    set: function (newTranslate) {

      U.ASSERT(U.IS_A(newTranslate, G.Vector2D), "Bad parameter");
      this._t = newTranslate.clone();

      this.cache = this.cacheKey = null;

    }.bind(this),

    enumerable: true
  });

  Object.defineProperty(this, 'flip', {

    get: function () {
      return this._f.clone();
    }.bind(this),

    set: function (newFlip) {

      U.ASSERT(U.IS_A(newFlip, G.Vector2D), "Bad parameter");
      this._f = newFlip.clone();

      this.cache = this.cacheKey = null;

    }.bind(this),

    enumerable: true
  });

};

/**
 * clone the transform
 */
G.Transform2D.prototype.clone = function () {

  var c = new G.Transform2D();
  c.translate = this.translate;
  c.rotate = this.rotate;
  c.scale = this.scale;
  c.flip = this.flip;
  return c;
};


/**
 * a JSONable version of the transform
 * @returns {{translateX: *, translateY: *, scaleX: *, scaleY: *, flipX: *, flipY: *, rotate: *}}
 */
G.Transform2D.prototype.toObject = function () {

  return {
    translate: this.translate.toObject(),
    scale: this.scale.toObject(),
    flip: this.flip.toObject(),
    rotate: this.rotate,
  };
};

/**
 * opposite of toObject! Returns the size that was specified in toObject.
 * NOTE: DOES NOT fire the transformUpdated event.
 * @param o
 */
G.Transform2D.fromObject = function (o) {

  var t = new G.Transform2D();
  t.translate = G.Vector2D.fromObject(o.translate);
  t.scale = G.Vector2D.fromObject(o.scale);
  t.flip = G.Vector2D.fromObject(o.flip);
  t.rotate = o.rotate;
  return t;

};

/**
 * import S/R/T from matrix
 * @param m
 */
G.Transform2D.prototype.fromMatrix = function (m) {

  this.translate = m.decomposeTranslate();
  this.rotate = m.decomposeRotation();
  this.scale = m.decomposeScale();

};


/**
 * compose our transformations into a single 3x3 matrix.
 * The order is consequential of course.
 * 1. translate so center is at the origin
 * 2. apply scaling ( using flip.x/flip.y to set the sign)
 * 3. apply rotation
 * 4. pply translate to final position
 *
 * If you don't want to include flipping in the transformation ( e.g. for UI elements use
 * the getTransformatioødenMatrixNoFlip version
 *
 * @param w
 * @param h
 * @returns G.Matrix2D
 */
G.Transform2D.prototype.getTransformationMatrix = function (w, h) {

  // form a cache key
  var key = w + ":" + h;

  // return a copy of our cache if possible
  if (key === this.cacheKey) {
    return new G.Matrix2D(this.cache._v);
  }

  var _m1 = G.Matrix2D.translate(-(w / 2), -(h / 2));

  var _m2 = G.Matrix2D.scale(this.scale.x * this.flip.x, this.scale.y * this.flip.y);

  var _m3 = G.Matrix2D.rotate(this.rotate);

  var _m4 = G.Matrix2D.translate(this.translate.x, this.translate.y);

  var _t = _m4.multiplyMatrix(_m3).multiplyMatrix(_m2).multiplyMatrix(_m1);

  this.cache = new G.Matrix2D(_t._v);
  this.cacheKey = key;

  return _t;
};

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
G.Box = function (x, y, w, h) {

  // define property accessors e.g. 'left', 'center' etc

  this.defineAccessors();

  // parse arguments

  if (arguments.length === 4) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  } else {
    if (arguments.length === 1) {

      U.extendWithMap(this, arguments[0], {
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
        b: 'b'
      });

    } else {
      if (arguments.length === 0) {
        this.x = this.y = this.w = this.h = 0;
      } else {
        throw new Error("Bad parameters");
      }
    }
  }

};

/**
 * simple toString 4 CSV values
 * @returns {*}
 */
G.Box.prototype.toString = function () {
  return _.sprintf("%f,%f,%f,%f", this.x, this.y, this.w, this.h);
};

/**
 * construct a box from a string, opposite of toString
 */
G.Box.fromString = function (s) {

  U.ASSERT(s, "Bad parameter");
  var values = s.split(',');
  U.ASSERT(values && values.length === 4, "Unexpected format");

  return new G.Box(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), parseFloat(values[3]));
};

/**
 * return an AABB defined by the limits of this point
 * and another point
 * @param  {[G.Vector2D]} a
 * @return {G.Box}
 */
G.Box.boxFromPoints = function (a) {

  var xmin = Number.MAX_VALUE;
  var ymin = Number.MAX_VALUE;
  var xmax = -Number.MAX_VALUE;
  var ymax = -Number.MAX_VALUE;

  for (var i = 0; i < a.length; i += 1) {
    xmin = Math.min(xmin, a[i].x);
    ymin = Math.min(ymin, a[i].y);
    xmax = Math.max(xmax, a[i].x);
    ymax = Math.max(ymax, a[i].y);
  }

  return new G.Box(xmin, ymin, xmax - xmin, ymax - ymin);
};


/**
 * the box object only stores x/y/w/h. Other useful properties
 * e.g. width, right, center are made available as properties
 */
G.Box.prototype.defineAccessors = function () {

  Object.defineProperty(this, 'left', {
    enumerable: false,
    get: function () {

      return this.x;
    },
    set: function (_x) {

      this.x = _x;
    }
  });

  Object.defineProperty(this, 'width', {
    enumerable: false,
    get: function () {

      return this.w;
    },
    set: function (_w) {

      this.w = _w;
    }
  });

  Object.defineProperty(this, 'height', {
    enumerable: false,
    get: function () {

      return this.h;
    },
    set: function (_h) {

      this.h = _h;
    }
  });

  Object.defineProperty(this, 'top', {
    enumerable: false,
    get: function () {

      return this.y;
    },
    set: function (_y) {

      this.y = _y;
    }
  });

  Object.defineProperty(this, 'r', {
    enumerable: false,
    get: function () {

      return this.x + this.w;
    },
    set: function (_r) {

      this.w = _r - this.x;
    }
  });

  Object.defineProperty(this, 'b', {
    enumerable: false,
    get: function () {

      return this.y + this.h;
    },
    set: function (_b) {

      this.h = _b - this.y;
    }
  });

  Object.defineProperty(this, 'cx', {
    enumerable: false,
    get: function () {

      return this.x + this.w / 2;
    },
    set: function (cx) {

      this.x = cx - this.w / 2;
    }
  });

  Object.defineProperty(this, 'cy', {
    enumerable: false,
    get: function () {

      return this.y + this.h / 2;
    },
    set: function (cy) {

      this.y = cy - this.h / 2;
    }
  });

  /**
   * get/set center / corners as vectors
   */
  Object.defineProperty(this, 'center', {
    enumerable: false,
    get: function () {
      return new G.Vector2D(this.cx, this.cy);
    },
    set: function (v) {
      this.cx = v.x;
      this.cy = v.y;
    }
  });

  Object.defineProperty(this, 'topLeft', {
    enumerable: false,
    get: function () {
      return new G.Vector2D(this.x, this.y);
    },
    set: function (v) {

      this.x = v.x;
      this.y = v.y;
    }
  });

  Object.defineProperty(this, 'topRight', {
    enumerable: false,
    get: function () {
      return new G.Vector2D(this.r, this.y);
    },
    set: function (v) {

      this.r = v.x;
      this.y = v.y;
    }
  });

  Object.defineProperty(this, 'bottomRight', {
    enumerable: false,
    get: function () {
      return new G.Vector2D(this.r, this.b);
    },
    set: function (v) {

      this.r = v.x;
      this.b = v.y;
    }
  });

  Object.defineProperty(this, 'bottomLeft', {
    enumerable: false,
    get: function () {
      return new G.Vector2D(this.x, this.b);
    },
    set: function (v) {

      this.x = v.x;
      this.b = v.y;
    }
  });

  Object.defineProperty(this, 'topEdge', {
    enumerable: false,
    get: function () {
      return new G.LineSegment(this.topLeft, this.topRight);
    }
  });

  Object.defineProperty(this, 'rightEdge', {
    enumerable: false,
    get: function () {
      return new G.LineSegment(this.topRight, this.bottomRight);
    }
  });
  Object.defineProperty(this, 'bottomEdge', {
    enumerable: false,
    get: function () {
      return new G.LineSegment(this.bottomRight, this.bottomLeft);
    }
  });
  Object.defineProperty(this, 'leftEdge', {
    enumerable: false,
    get: function () {
      return new G.LineSegment(this.bottomRight, this.topLeft);
    }
  });
};

/**
 * return a cloned copy of this
 */
G.Box.prototype.clone = function () {

  return new G.Box(this.x, this.y, this.w, this.h);
};

/**
 * normalize by returning a new box with positive extents
 */
G.Box.prototype.normalize = function () {

  return new G.Box(
    Math.min(this.x, this.r),
    Math.min(this.y, this.b),
    Math.abs(this.w),
    Math.abs(this.h)
  )
};

/**
 * return a new Box inflated by the given signed amount
 * @param inflateX
 * @param inflateY
 */
G.Box.prototype.inflate = function (inflateX, inflateY) {

  var b = new G.Box(this.x, this.y, this.w + inflateX * 2, this.h + inflateY * 2);
  b.cx = this.cx;
  b.cy = this.cy;
  return b;
};

/**
 * scale width/height of box around center returning a new box
 * @param x
 * @param y
 */
G.Box.prototype.scale = function (x, y) {

  return new G.Box(
    this.cx - (this.width * x) / 2,
    this.cy - (this.height * y) / 2,
    this.width * x,
    this.height * y);
};

/**
 * return a new box that is this box * e
 * @param e
 */
G.Box.prototype.multiply = function (e) {

  return new G.Box(this.x * e, this.y * e, this.width * e, this.height * e);
};

/**
 * return a new box that is this box / e
 * @param e
 */
G.Box.prototype.divide = function (e) {

  return new G.Box(this.x / e, this.y / e, this.width / e, this.height / e);
};


/**
 * return true if this box is identical to another box
 * @param other
 * @returns {boolean}
 */
G.Box.prototype.equals = function (other) {

  return other.x === this.x &&
    other.y === this.y &&
    other.width === this.width &&
    other.height === this.height;
};

/**
 * return a new box that is the union of this box and some other box/rect like object
 * @param box - anything with x,y,w,h properties
 * @returns G.Box - the union of this and box
 */
G.Box.prototype.union = function (box) {

  var u = new G.Box(
    Math.min(this.x, box.x),
    Math.min(this.y, box.y),
    0, 0
  );

  u.r = Math.max(this.r, box.x + box.w);
  u.b = Math.max(this.b, box.y + box.h);

  return u;
};

/**
 * get the nth edge
 * 0: top left -> top right
 * 1: top right -> bottom right
 * 2: bottom right -> bottom left
 * 3: bottom left -> top left
 * @param {Number} n
 */
G.Box.prototype.getEdge = function (n) {

  U.ASSERT(n >= 0 && n < 4, "Bad parameter");

  switch (n) {
  case 0:
    return new G.LineSegment(new G.Vector2D(this.x, this.y), new G.Vector2D(this.r, this.y));
  case 1:
    return new G.LineSegment(new G.Vector2D(this.r, this.y), new G.Vector2D(this.r, this.b));
  case 2:
    return new G.LineSegment(new G.Vector2D(this.r, this.b), new G.Vector2D(this.x, this.b));
  case 3:
    return new G.LineSegment(new G.Vector2D(this.x, this.b), new G.Vector2D(this.x, this.y));
  }
};

/**
 * return the union of the given boxes or an empty box if the list is empty
 * @static
 */
G.Box.union = function (boxes) {

  var u = new G.Box(0, 0, 0, 0);

  if (boxes && boxes.length) {

    u.x = _.min(boxes, function (box) {
      return box.x;
    }).x;

    u.y = _.min(boxes, function (box) {
      return box.y;
    }).y;

    u.r = _.max(boxes, function (box) {
      return box.r;
    }).r;

    u.b = _.max(boxes, function (box) {
      return box.b;
    }).b;
  }

  return u;
};

/**
 * return the intersection of this box with the other box
 * @param box
 */
G.Box.prototype.intersectWithBox = function (box) {

  // minimum of right edges

  var minx = Math.min(this.r, box.r);

  // maximum of left edges

  var maxx = Math.max(this.x, box.x);

  // minimum of bottom edges

  var miny = Math.min(this.b, box.b);

  // maximum of top edges

  var maxy = Math.max(this.y, box.y);

  // if area is greater than zero there is an intersection

  if (maxx < minx && maxy < miny) {

    var x = Math.min(minx, maxx);

    var y = Math.min(miny, maxy);

    var w = Math.max(minx, maxx) - x;

    var h = Math.max(miny, maxy) - y;

    return new G.Box(x, y, w, h);

  }

  return null;
};

/**
 * return true if we are completely inside the other box
 * @param other
 */
G.Box.prototype.isInside = function (other) {

  return this.x >= other.x &&
    this.y >= other.y &&
    this.r <= other.r &&
    this.b <= other.b;
};

/**
 * return true if the given point ( anything with x/y properties ) is inside the box
 * @param p
 */
G.Box.prototype.pointInBox = function (p) {

  return p.x >= this.x && p.y >= this.y && p.x < this.r && p.y < this.b;
};

/**
 * return true if the box have zero or negative extents in either axis
 */
G.Box.prototype.isEmpty = function () {

  return this.w <= 0 || this.h <= 0;
};

/**
 * return a polygon that is the result of transforming this boxes corners by
 * the given transformation matrix. Order of points is top left, top right, bottom right, bottom left
 * @param matrix
 */
G.Box.prototype.transformToPolygon = function (matrix) {

  var v = [];

  v[0] = matrix.multiplyVector(new G.Vector2D(this.x, this.y));
  v[1] = matrix.multiplyVector(new G.Vector2D(this.r, this.y));
  v[2] = matrix.multiplyVector(new G.Vector2D(this.r, this.b));
  v[3] = matrix.multiplyVector(new G.Vector2D(this.x, this.b));

  return new G.Polygon(v);
};

/**
 * a line composed of a start and end point
 * @param {G.Vector2D} start
 * @param {G.Vector2D} end
 * @constructor
 */
G.LineSegment = function (start, end) {

  switch (arguments.length) {

    case 0:
      this._start = new G.Vector2D();
      this._end = new G.Vector2D();
      break;

    case 1:
      U.ASSERT(_.has(start, 'x1') && _.has(start, 'y1') && _.has(start, 'x2') && _.has(start, 'y2'), "Bad parameter");
      this._start = new G.Vector2D(start.x1, start.y1);
      this._end = new G.Vector2D(start.x2, start.y2);
    break;

    case 2:
      this._start = start.clone();
      this._end = end.clone();
      break;

    case 4:
      this._start = new G.Vector2D(arguments[0], arguments[1]);
      this._end = new G.Vector2D(arguments[2], arguments[3]);
      break;

    default:
      throw new Error("Bad parameters");
      break;

  }

  Object.defineProperty(this, 'start', {
    get: function () {
      return this._start.clone();
    },
    set: function (v) {
      this._start = v.clone();
    }
  });

  Object.defineProperty(this, 'end', {
    get: function () {
      return this._end.clone();
    },
    set: function (v) {
      this._end = v.clone();
    }
  });

  Object.defineProperty(this, 'x1', {
    get: function () {
      return this._start.x;
    }
  });
  Object.defineProperty(this, 'y1', {
    get: function () {
      return this._start.y;
    }
  });
  Object.defineProperty(this, 'x2', {
    get: function () {
      return this._end.x;
    }
  });
  Object.defineProperty(this, 'y2', {
    get: function () {
      return this._end.y;
    }
  });

};

/**
 * lines must be serializable for use in certain node types.
 * @return {[type]} [description]
 */
G.LineSegment.prototype.toObject = function () {
  return {
    start: this.start.toObject(),
    end: this.end.toObject()
  }
};

/**
 * deserialize
 * @param  {Object} o
 * @return {G.LineSegment}
 */
G.LineSegment.fromObject = function (o) {
  U.ASSERT(o && o.start && o.end, "Bad parameter");
  var l = new G.LineSegment(G.Vector2D.fromObject(o.start), G.Vector2D.fromObject(o.end));
  return l;
};

/**
 * return length of line
 */
G.LineSegment.prototype.len = function () {

  var xl = this.x2 - this.x1,
    yl = this.y2 - this.y1;

  return Math.sqrt(xl * xl + yl * yl);
};

/**
 * return the slope of the line. Returns infinity if the line is vertical
 * @return {[type]} [description]
 */
G.LineSegment.prototype.slope = function () {

  var xd = (this.start.x - this.end.x);
  if (xd === 0) {
    return Infinity;
  }
  return (this.start.y - this.end.y) / xd;
};

/**
 * distance of point to line segment formed by this.start, this.end squared.
 * @return {[type]} [description]
 */
G.LineSegment.prototype.distanceToSegment = function (p) {
  return Math.sqrt(this.distanceToSegmentSquared(p));
};

G.LineSegment.prototype.distanceToSegmentSquared = function (p) {

  function sqr(x) {
    return x * x
  }

  function dist2(v, w) {
    return sqr(v.x - w.x) + sqr(v.y - w.y)
  }

  var v = this.start,
    w = this.end;

  var l2 = dist2(v, w);

  if (l2 == 0) return dist2(p, v);

  var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;

  if (t < 0) return dist2(p, v);
  if (t > 1) return dist2(p, w);

  return dist2(p, {
    x: v.x + t * (w.x - v.x),
    y: v.y + t * (w.y - v.y)
  });
};


/**
 * parametric point on line
 * @param p
 */
G.LineSegment.prototype.pointOnLine = function (p) {

  var x = this.x1 + (this.x2 - this.x1) * p,
    y = this.y1 + (this.y2 - this.y1) * p;

  return new G.Vector2D(x, y);
};

/**
 * intersection of this line with another line. This is really line segment intersection since
 * it considers the lines finite as defined by their end points

 * @param {G.LineSegment} other - other line segment to intersect with
 * @returns {G.Vector}
 */
G.LineSegment.prototype.intersectWithLine = function (other) {

  var result;

  var ua_t = (other.x2 - other.x1) * (this.y1 - other.y1) - (other.y2 - other.y1) * (this.x1 - other.x1);
  var ub_t = (this.x2 - this.x1) * (this.y1 - other.y1) - (this.y2 - this.y1) * (this.x1 - other.x1);
  var u_b = (other.y2 - other.y1) * (this.x2 - this.x1) - (other.x2 - other.x1) * (this.y2 - this.y1);

  if (u_b !== 0) {
    var ua = ua_t / u_b;
    var ub = ub_t / u_b;

    if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {

      result = new G.Intersection(new G.Vector2D(
        this.x1 + ua * (this.x2 - this.x1),
        this.y1 + ua * (this.y2 - this.y1)
      ));

      result.status = "Intersection";

    } else {
      result = new G.Intersection("No Intersection");
    }
  } else {
    if (ua_t === 0 || ub_t === 0) {
      result = new G.Intersection("Coincident");
    } else {
      result = new G.Intersection("Parallel");
    }
  }

  return result;
};

/**
 * get three points the define an arrow head. If end is true
 * the arrow is at the end of the line, otherwise it is at the start
 * @param  {[type]} start [description]
 * @return {[type]}       [description]
 */
G.LineSegment.prototype.getArrowHead = function (end) {

  // http://www.dbp-consulting.com/tutorials/canvas/CanvasArrow.html

  var angle = U.D2R(20);
  var d = 12;
  // calculate the angle of the line
  var lineangle = Math.atan2(this.y2 - this.y1, this.x2 - this.x1);
  // h is the line length of a side of the arrow head
  var h = Math.abs(d / Math.cos(angle));

  if (end) {
    var angle1 = lineangle + Math.PI + angle;
    var topx = this.x2 + Math.cos(angle1) * h;
    var topy = this.y2 + Math.sin(angle1) * h;
    var angle2 = lineangle + Math.PI - angle;
    var botx = this.x2 + Math.cos(angle2) * h;
    var boty = this.y2 + Math.sin(angle2) * h;
    return [new G.Vector2D(topx, topy), this.end, new G.Vector2D(botx, boty)];
  } else {
    var angle1 = lineangle + angle;
    var topx = this.x1 + Math.cos(angle1) * h;
    var topy = this.y1 + Math.sin(angle1) * h;
    var angle2 = lineangle - angle;
    var botx = this.x1 + Math.cos(angle2) * h;
    var boty = this.y1 + Math.sin(angle2) * h;
    return [new G.Vector2D(topx, topy), this.start, new G.Vector2D(botx, boty)];
  }
};

/**
 * swap start and end
 * @return {[type]} [description]
 */
G.LineSegment.prototype.reverse = function() {
  var temp = this._start;
  this._start = this._end;
  this._end = temp;
};

G.LineSegment.prototype.toString = function () {
  return _.sprintf("start: %s end: %s", this.start.toString(), this.end.toString());
};


/**
 * a polygon, composed of n G.Vector2D points. The polygon is assumed to be closed i.e.
 * there is an implicit connection between the last and first points.
 * @param {[G.Vector2D]} vectors
 * @constructor
 */
G.Polygon = function (vectors) {

  // clone the given vector array or set to an empty array

  this._v = vectors ? _.map(vectors, function (v) {
    return v.clone();
  }) : [];

  // number of points in the polygon

  Object.defineProperty(this, 'count', {
    enumerable: true,
    get: function () {

      return this._v.length;
    }
  });

  // return a copy of our vectors

  Object.defineProperty(this, 'vectors', {
    enumerable: true,
    get: function () {

      return _.map(this._v, function (v) {
        return v.clone();
      });
    }
  });

};

/**
 * return the nth vector
 * @param {Number} n
 */
G.Polygon.prototype.get = function (n) {

  U.ASSERT(n >= 0 && n < this.count, "Bad parameter");

  return this._v[n].clone();
};

/**
 * set the nth vector
 * @param {Number} n
 */
G.Polygon.prototype.set = function (n, v) {

  U.ASSERT(n >= 0 && n < this.count && U.IS_A(v, G.Vector2D), "Bad parameter");

  return this._v[n] = v.clone();
};

/**
 * get the nth edge
 * @param {Number} n
 */
G.Polygon.prototype.getEdge = function (n) {

  U.ASSERT(n >= 0 && n < this.count, "Bad parameter");

  return new G.LineSegment(this._v[n], this._v[(n + 1) % this.count]);
};

/**
 * return our AABB as a box
 */
G.Polygon.prototype.getAABB = function () {

  var x = _.min(_.pluck(this._v, "x"));
  var y = _.min(_.pluck(this._v, "y"));
  var r = _.max(_.pluck(this._v, "x"));
  var b = _.max(_.pluck(this._v, "y"));

  return new G.Box(x, y, r - x, b - y);
};

/**
 * return true if this polygon, assumed to be a box, intersects the given box
 * @param box
 */
G.Polygon.prototype.intersectsAABB = function (box) {

  U.ASSERT(this._v.length === 4, "Polygon must be a box");

  // get a normalized copy of the box

  var b = box.normalize();

  // if any of our vertices are in the box we intersect

  var inside = _.filter(this._v, function (v) {
    return b.pointInBox(v);
  }, this);

  if (inside && inside.length) {
    return true;
  }

  // test edges for intersection

  for (var i = 0; i < 4; i += 1) {

    // get edge of box
    var e = b.getEdge(i);

    // test against all our edges
    for (var j = 0; j < 4; j += 1) {
      if (this.getEdge(j).intersectWithLine(e).status === 'Intersection') {
        return true;
      }
    }
  }

  // if here no intersection
  return false;

};

/**
 * make a star polygon
 * @param  {[type]} centerX     [description]
 * @param  {[type]} centerY     [description]
 * @param  {[type]} arms        [description]
 * @param  {[type]} outerRadius [description]
 * @param  {[type]} innerRadius [description]
 */
G.Polygon.prototype.star = function (centerX, centerY, arms, outerRadius, innerRadius) {

  this._v = [];

  var angle = Math.PI / arms;

  for (var i = 0; i < 2 * arms; i++) {
    // Use outer or inner radius depending on what iteration we are in.
    var r = (i & 1) == 0 ? outerRadius : innerRadius;

    var currX = centerX + Math.cos(U.D2R(270) + i * angle) * r;
    var currY = centerY + Math.sin(U.D2R(270) + i * angle) * r;

    this._v.push(new G.Vector2D(currX, currY));
  }
};

/**
 * return boundary of polygon with n edges within the given box
 * @param  {[type]} edges [description]
 * @return {[type]}       [description]
 */
G.Polygon.prototype.ngon = function (edges, b) {

  var angle = Math.PI * 2 / edges;
  var r = b.w / 2;
  this._v = [];
  for (var i = 0; i < edges; i += 1) {
    this._v.push(G.Vector2D.pointOnEllipse(b, U.R2D(U.D2R(270) + i * angle)));
  }

};

/**
 * the generic results of various types of intersection test.
 * For valid intersections the points property is an array of
 * G.Vector2D objects. There is also a point property that returns
 * the first point in the points array. The status property is a string that indicates why the intersection test
 * failed if any
 * @constructor
 * @param {G.Vector2D|String|undefined} arg - can be a vector or a status string or nothing
 */
G.Intersection = function (arg) {

  if (U.IS_A(arg, G.Vector2D)) {
    this.points = [arg];
  } else {
    if (_.isString(arg)) {
      this._status = arg;
    }
    this.points = [];
  }

  /**
   * return the first point of our results, or null if no points
   */
  Object.defineProperty(this, 'point', {
    enumerable: true,
    get: function () {
      if (this.points && this.points.length > 0) {
        return this.points[0];
      }

      return null;
    }
  });

  // status of intersection

  Object.defineProperty(this, 'status', {
    enumerable: true,
    get: function () {
      return this._status;
    },
    set: function (s) {
      this._status = s;
      return this;
    }
  });
};

/**
 * add an object with x/y values to the results
 * @param {G.Vector2D} p
 */
G.Intersection.prototype.add = function (p) {

  U.ASSERT(U.IS_A(p, G.Vector2D), "Bad parameter");
  this.points = this.points || [];
  this.points.push(p.clone());
  return this;
};

module.exports = G;
