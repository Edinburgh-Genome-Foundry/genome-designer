var Node = require('./node');
var G = require('./geometry');
var U = require('./utils');
var C = require('./viewgraph_consts');
var Connection = require('./connection');
var _ = require('underscore');

/**
 * smart connector, elbow, curve etc
 * @param {G.ViewGraph} viewGraph - graph we belong to
 */
var SmartConnector = function (viewGraph) {

  Node.call(this, viewGraph);
  this.typeName = "SmartConnector";

  // connectors defaults to auto rotated text and a white background
  this.autoRotateText = true;

  // end/start marker styles for lines / connectors
  this.endMarkerStyle = C.markerStyles.arrow;
  this.startMarkerStyle = C.markerStyles.arrow;

  // flag as connector
  this.addFlags(Node.Flags.Connector);

};

U.extends(Node, SmartConnector);


/**
 * add our line object to the serializable version of the node
 * @param {Object} o - object that carries our serializable properties
 */
SmartConnector.prototype.addPropertiesToObject = function (o) {

  // base class
  Node.prototype.addPropertiesToObject.call(this, o);

  // add start / end points
  o.start = this.start.toObject();
  o.end = this.end.toObject();

  // add our start and end connection, if we have them
  if (this.startConnection) {
    o.startConnection = this.startConnection.toObject();
  }
  if (this.endConnection) {
    o.endConnection = this.endConnection.toObject();
  }

};

/**
 * inherit so we can have our line object set
 */
SmartConnector.prototype.set = function (obj) {

  _.each(obj, function(value, key) {

    switch (key) {
      case "start":
        this.start = G.Vector2D.fromObject(value);
        delete obj['start'];
        break;

      case "end":
        this.end = G.Vector2D.fromObject(value);
        delete obj['end'];
        break;

      case "geometry":
        this.start = value.topLeft;
        this.end = value.bottomRight;
        delete obj['geometry'];
        break;
    }
  }, this);

  Node.prototype.set.call(this, obj);
};

/**
 * if we current have a connection via the given handle break it.
 * @param  {[type]} handleName [description]
 * @return {[type]}            [description]
 */
SmartConnector.prototype.breakConnection = function (handleName) {

  if (handleName === 'start' && this.startConnection) {
    this.startConnection.breakConnection();
    this.startConnection = null;
  }
  if (handleName === 'end' && this.endConnection) {
    this.endConnection.breakConnection();
    this.endConnection = null;
  }

};

/**
 * break all connections, for a connector we have to break out outbound edges
 * @param  {[type]} handleName [description]
 * @return {[type]}            [description]
 */
SmartConnector.prototype.breakAllConnections = function (handleName) {

  this.breakConnection('start');
  this.breakConnection('end');

};

/**
 * set the appropriate connection based on the handle name
 * @param {String} handleName
 * @param {Connection} connection
 */
SmartConnector.prototype.setConnection = function (handleName, connection) {

  this[handleName === "start" ? "startConnection" : "endConnection"] = connection;
};


/**
 * calculate the path and bounds of the connector and then render
 */
SmartConnector.prototype.update = function () {

  if (!this.startConnection && !this.endConnection) {

    // simple z connector between end points when neither end is attached to a node
    this.route = Connection.buildRouteZ(this.start, this.end);

  } else {

    // get lines egressing from start / end node
    var startLines = this.startConnection ? this.startConnection.getConnectionLines() : Connection.getConnectionLinesForPoint(this.start);
    var endLines = this.endConnection ? this.endConnection.getConnectionLines() : Connection.getConnectionLinesForPoint(this.end);

    // get routes that is a combination of these lines are there intersection
    this.route = Connection.buildRoute(startLines, endLines);
  }

  // remove any duplicate points that might sneak in etc
  this.simplifyRoute();

  // update bounds / transform / start end while route is still in global space
  this.updateGeometry();

  // now we have an updated transform move the route into local space
  this.route = this.globalToLocal(this.route);

  // base class updates display properties
  Node.prototype.update.call(this);

};

/**
 * Hit detection is custom. First a gross bounds check then a point/line proximity test
 * @param {G.Vector2D} p
 * @returns boolean
 */
SmartConnector.prototype.containsGlobalPointWithStroke = function (p) {

  // use base class for a gross bounds test
  if (!Node.prototype.containsGlobalPoint.call(this, p)) {
    return false;
  }

  // if point is close to any line segment in the route then we are hit

  if (this.route) {

    U.ASSERT(this.route.length > 1, "Expect two or more points in route");

    // convert to local coordinates and test against each segment of the line
    var pt = this.globalToLocal(p);

    // test against each segment of our route
    for (var i = 0; i < this.route.length - 1; i += 1) {
      var segment = new G.LineSegment(this.route[i], this.route[i + 1]);
      if (segment.distanceToSegment(pt) < C.CONNECTOR_HIT) {
        return true;
      }
    }
  }

  // no route, no hit
  return false;

};

/**
 * update our bounds / transform and start end points after calculating our
 * route ( assumes the route is in global space )
 */
SmartConnector.prototype.updateGeometry = function () {

  // once the route is calculated we can update our dimensions and transform
  var b = G.Box.boxFromPoints(this.route);

  // inflate to accommodate strokes
  b = b.inflate(C.SW / 2, C.SW / 2);
  this.width = b.width;
  this.height = b.height;
  this.transform.translate = b.center;

  // update start / end properties
  this.start = this.route[0].clone();
  this.end = this.route[this.route.length - 1].clone();
};

/**
 * update line via new center point
 */
SmartConnector.prototype.moveTo = function (p) {

  // apply delta to line end points
  var delta = p.sub(this.transform.translate);
  this.start = this.start.add(delta);
  this.end = this.end.add(delta);

};

/**
 * update the connection defined by the Connection object we were passed.
 * @param  {Connection} connector
 */
SmartConnector.prototype.updateConnection = function (connector) {

  if (this.startConnection === connector) {
    this.start = connector.destinationPointToGlobal();
  } else {
    this.end = connector.destinationPointToGlobal();
  }

  this.update();

};

/**
 * remove consecutive duplicates ( within a certain threshold )
 */
SmartConnector.prototype.simplifyRoute = function () {
  if (this.route && this.route.length > 2) {
    var i = 1;
    while (i < this.route.length) {
      if (this.route[i].similar(this.route[i - 1])) {
        this.route.splice(i - 1, 1);
      } else {
        i += 1;
      }
    }
    // if we shrunk to a single point duplicate the last point
    if (this.route.length === 1) {
      this.route.push(this.route[0].clone());
    }
    U.ASSERT(this.route.length >= 2, "To simple");
  }
};


/**
 * return the center for the text glyph. The default is 50, 50
 * which centers the text in our bounds. Descendant classes can
 * override. This is called whenever the node is updated.
 * @return {G.Vector2D} percentage h/v of text center
 */
SmartConnector.prototype.getTextGlyphCenter = function () {

  // // if there are an even number of line segments in the route
  // // then use the intersection of the middle two segments. Otherwise
  // // use the center of the middle segment

  // var p;
  // if (this.route.length & 1) {
  //   // odd number of points means even number of line segments
  //   p = this.route[this.route.length >> 1];
  // } else {
  //   // even number of points means odd number of line segments, calculate
  //   // the mid point
  //   var a = this.route[this.route.length >> 1];
  //   var b = this.route[(this.route.length >> 1) - 1];
  //   p = new G.LineSegment(a, b).pointOnLine(0.5);
  // }

  // // return point as a percentage of width/height
  // return new G.Vector2D(p.x / this.width * 100, p.y / this.height * 100);

  // create 4 line segments N/E/S/W with their origin at center of the node.
  // intersect each in turn with the line segments in our route.
  // Use the point of intersection closests to the center as the location
  // for the text

  var c = new G.Vector2D(this.width >> 1, this.height >> 1);

  var L = 100000;
  var cardinalLines = [
    new G.LineSegment(c, new G.Vector2D(c.x, c.y - L)),
    new G.LineSegment(c, new G.Vector2D(c.x + L, c.y)),
    new G.LineSegment(c, new G.Vector2D(c.x, c.y + L)),
    new G.LineSegment(c, new G.Vector2D(c.x - L, c.y)),
  ];

  var shortest = Number.MAX_VALUE;
  var p = null;

  for (var i = 0; i < cardinalLines.length; i += 1) {
    for (var j = 0; j < this.route.length - 1; j += 1) {
      var routeLine = new G.LineSegment(this.route[j], this.route[j + 1]);
      var intersection = cardinalLines[i].intersectWithLine(routeLine);
      if (intersection.status === "Intersection") {
        var d = c.distance(intersection.point);
        if (d < shortest) {
          shortest = d;
          p = intersection.point;
        }
      }
    }
  }

  // occassionally we get no intersection, we should investigate why?
  if (!p) {
    // use the mid point of the first line of the route
    console.error("No intersection found in SmartConnector.prototype.getTextGlyphCenter");
    return new G.LineSegment(this.route[0], this.route[1]).pointOnLine(0.5);
  }

  // return p as a percentage of our dimensions
  return new G.Vector2D(p.x / this.width * 100, p.y / this.height * 100);

};

/**
 * return the required size of the end cap markers, derived from the
 * current strokeWidth of the node
 * @return {[type]} [description]
 */
SmartConnector.prototype.markerSize = function() {
  var s = Math.max(8, this.strokeWidth * 2);
  return new G.Vector2D(s, s);
};

module.exports = SmartConnector;
