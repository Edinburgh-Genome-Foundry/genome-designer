var SceneGraph = function(el) {

  this.el = el;
  this.index = 0;
  setInterval(function() {
    this.index = (this.index + 1) % Colors.length;
    this.el.style['background-color'] = Colors[this.index];
  }.bind(this), 2000);
};

var Colors = ['red', 'green', 'blue'];

module.exports = SceneGraph;
