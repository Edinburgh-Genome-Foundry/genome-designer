var ColorJS = require('color-js');

/**
 * just a wrapper for color-js with some added functionality
 * and svg element in the appropiate way.
 * @param {String} str - a string represeting a single color
 */
var Color = function (str) {

  this._c = new ColorJS(str);

  Object.defineProperty(this, 'R', {
    get: function () {
      return this._c.getRed();
    }.bind(this)
  });
  Object.defineProperty(this, 'G', {
    get: function () {
      return this._c.getGreen();
    }.bind(this)
  });
  Object.defineProperty(this, 'B', {
    get: function () {
      return this._c.getBlue();
    }.bind(this)
  });
  Object.defineProperty(this, 'H', {
    get: function () {
      return this._c.getHue();
    }.bind(this)
  });
  Object.defineProperty(this, 'S', {
    get: function () {
      return this._c.getSaturation();
    }.bind(this)
  });
  Object.defineProperty(this, 'Li', {
    get: function () {
      return this._c.getLightness();
    }.bind(this)
  });
  Object.defineProperty(this, 'Lu', {
    get: function () {
      return this._c.getLuminance();
    }.bind(this)
  });
  Object.defineProperty(this, 'A', {
    get: function () {
      return this._c.getAlpha();
    }.bind(this)
  });

};

/**
 * return a valid CSS string representation of the color
 * @return {[type]} [description]
 */
Color.prototype.toString = function () {
  return this._c.toString();
};

/**
 * just the rgb component as a hex string.
 * Useful for removing the alpha component
 * @return {String}
 */
Color.prototype.toCSSHex = function () {
  return this._c.toCSSHex();
};

/**
 * clone a color
 * @return {Color} [description]
 */
Color.prototype.clone = function () {
  return new Color(this.toString());
};

module.exports = Color;
