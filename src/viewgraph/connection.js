
var U = require('./utils');
var C = require('./viewgraph_consts');
var G = require('./geometry');
var C = require('./viewgraph_consts');
var _ = require('underscore');


/**
 * a new connection between src/dst nodes at the given coeffecients of their width/height
 * @param {Node} src
 * @param {G.Vector2D} srcPosition
 * @param {Node} dst
 * @param {G.Vector2D} dstPosition
 */
var Connection = function(src, srcPosition, dst, dstPosition) {

  U.ASSERT(src && srcPosition && dst && dstPosition, "Bad parameters");

  this.source = src;
  this.sourcePosition = srcPosition;

  this.destination = dst;
  this.destinationPosition = dstPosition;

  // add to respective edge lists for destination
  this.destination.edgesIn.push(this);

};

/**
 * return a serializable version of the connection where the destination
 * node is stored as a uuid. Connections are stored in a collection associated
 * with their source node so we don't need a represenation for the source node.
 * @return {[type]} [description]
 */
Connection.prototype.toObject = function() {

  return {
    src: this.source.uuid,
    srcPosition: this.sourcePosition.toObject(),
    dst: this.destination.uuid,
    dstPosition: this.destinationPosition.toObject(),
  }
};

/**
 * to revive this object we need the viewGraph since we only have UUID's for nodes
 * and need to revive those to actual nodes
 * @param  {G.ViewGraph} viewGraph
 * @return {Connection}
 */
Connection.fromObject = function(o, viewGraph) {

  return new Connection(
    viewGraph.findNodeByUUID(o.src),
    G.Vector2D.fromObject(o.srcPosition),
    viewGraph.findNodeByUUID(o.dst),
    G.Vector2D.fromObject(o.dstPosition)
  );

};

/**
 * calculate the 4 potentional lines of connection in order of preference.
 * The 4 lines, in order of preference are:
 * 1. the egress from the node, quantized to 90 degree intervals
 * 2. another line with the same direction as the egree route.
 * 3. a line segment at 90% to the egree route
 * 4. a line opposite to 3.
 * e.g.
 * ----------       ^
 * |        |       |
 * |        |       3
 * |        |       |
 * |        |       |
 * |  NODE  | ----- 1 ----><----- 2 ---------------->
 * |        |       |
 * |        |       |
 * |        |       4
 * |        |       |
 * |        |       |
 * ----------
 * @return {[type]} [description]
 */
Connection.prototype.getConnectionLines = function() {

  // get the lines that egresses from the node. We also need the direction
  // code for this line since its direction affects the direction of the other three lines

  var egress = this.getEgressRoute();

  // 'with' for simpler code
  var l = egress.line;

  // add the egress line as the first line
  var lines = [l];

  // form other three lines based on the egress code
  switch (egress.egressCode) {

    case Connection.Egress.right:

      // line 2 ( see above, same direction as egress, starting from end of egress)
      lines.push(new G.LineSegment(l.end, new G.Vector2D(l.end.x + Connection.kSEGMENT, l.end.y)));

      // line 3, up
      lines.push(new G.LineSegment(l.end, new G.Vector2D(l.end.x, l.end.y - Connection.kSEGMENT)));

      // line 4, down
      lines.push(new G.LineSegment(l.end, new G.Vector2D(l.end.x, l.end.y + Connection.kSEGMENT)));

      break;

    case Connection.Egress.bottom:

      // line 2 down
      lines.push(new G.LineSegment(l.end, new G.Vector2D(l.end.x, l.end.y + Connection.kSEGMENT)));

      // line 3, left
      lines.push(new G.LineSegment(l.end, new G.Vector2D(l.end.x - Connection.kSEGMENT, l.end.y)));

      // line 4, right
      lines.push(new G.LineSegment(l.end, new G.Vector2D(l.end.x + Connection.kSEGMENT, l.end.y)));

      break;

    case Connection.Egress.left:

      // line 2 ( see above, same direction as egress, starting from end of egress)
      lines.push(new G.LineSegment(l.end, new G.Vector2D(l.end.x - Connection.kSEGMENT, l.end.y)));

      // line 3, up
      lines.push(new G.LineSegment(l.end, new G.Vector2D(l.end.x, l.end.y - Connection.kSEGMENT)));

      // line 4, down
      lines.push(new G.LineSegment(l.end, new G.Vector2D(l.end.x, l.end.y + Connection.kSEGMENT)));

      break;

    case Connection.Egress.top:

      // line 2 up
      lines.push(new G.LineSegment(l.end, new G.Vector2D(l.end.x, l.end.y - Connection.kSEGMENT)));

      // line 3, left
      lines.push(new G.LineSegment(l.end, new G.Vector2D(l.end.x - Connection.kSEGMENT, l.end.y)));

      // line 4, right
      lines.push(new G.LineSegment(l.end, new G.Vector2D(l.end.x + Connection.kSEGMENT, l.end.y)));

      break;


  }

  return lines;
};

/**
 * when a smart connector has no end point we have node. But we can still produce 4 lines
 * to be used to create the route. For a point the lines just move N/E/S/W from the point.
 * NOTE: This is a class method since unconnected ends of smart connectors won't have a connection
 * object.
 * @param  {[type]} p [description]
 * @return {[type]}   [description]
 */
Connection.getConnectionLinesForPoint = function(p) {

  var a = [
    // North
    new G.LineSegment(p, new G.Vector2D(p.x, p.y - Connection.kSEGMENT)),
    // East
    new G.LineSegment(p, new G.Vector2D(p.x + Connection.kSEGMENT, p.y)),
    // South
    new G.LineSegment(p, new G.Vector2D(p.x, p.y + Connection.kSEGMENT)),
    // West
    new G.LineSegment(p, new G.Vector2D(p.x - Connection.kSEGMENT, p.y)),
  ];

  // lines originating from a point are tagged to indicate
  // there is no egress route and therefore any intersection with them
  // can go straight to the origin
  a.pointOrigin = true;

  return a;
};

/**
 * build a directed route from the two sets of 4 lines ( constructed by getConnectionLines or
 * getConnectionLineForPoint ).
 * The algorithm starts by interating the lines of a looking for intersections with the lines
 * from b. If an intersection is found the path is build from the start of a up to the intersection
 * and then back trackes along the points of b to the start of the path.
 * @param  {[G.LineSegment]} a - four lines for a
 * @param  {[G.LineSegment]} b - four lines for b
 * @return {[G.Vector2D} path from a -> b
 */
Connection.buildRoute = function(a, b) {

  // console.log("Route Lines A:");
  // _.each(a, function(l) {
  // 	console.log(l.toString());
  // });

  // console.log("Route Lines B:");
  // _.each(b, function(l) {
  // 	console.log(l.toString());
  // });

  for (var i = 0; i < a.length; i += 1) {
    for (var j = 0; j < b.length; j += 1) {

      var intersection = a[i].intersectWithLine(b[j]);

      if (intersection.status === "Intersection") {
        // build path from start of a up to intersection, include the intersetion, then
        // backtrack along b to the start of b.

        // path always includes start of a,
        var path = [a[0].start];
        // if intersection we not on the egress line then we need to add
        // the end of the egress line, then the intersection ( unless these lines egress from a point )
        if (i > 0 && !a.pointOrigin) {
          path.push(a[0].end);
        }
        path.push(intersection.point)

        // now work backwards through b. If intersection was not in
        // the egress line then we need to add it.
        if (j > 0 && !b.pointOrigin) {
          path.push(b[j].start);
        }
        path.push(b[0].start);

        // path is complete, return it
        return path;
      }
    }
  }
  // if no intersections occurs ( because the egress points are facing away from each other)
  // then we construct a simple Z connection between the points with a line
  // either vertically or horizontal along the dividing line between the points.
  // The direction of the Z is determined by the direction of one of
  // the egress points i.e. make the start of the z 90 degress to the direction
  // of the egress

  var cx = (a[0].start.x + b[0].start.x) / 2;
  var cy = (a[0].start.y + b[0].start.y) / 2;

  if (a[0].start.y == a[0].end.y) {

    return [
      a[0].start,
      a[0].end,
      new G.Vector2D(a[0].end.x, cy),
      new G.Vector2D(b[0].end.x, cy),
      b[0].end,
      b[0].start
    ];
  }

  return [
    a[0].start,
    a[0].end,
    new G.Vector2D(cx, a[0].end.y),
    new G.Vector2D(cx, b[0].end.y),
    b[0].end,
    b[0].start
  ];
};

/**
 * return simple 4 vertex , 3 line z path between two points
 * @param {[type]} start [description]
 * @param {[type]} end   [description]
 */
Connection.buildRouteZ = function(start, end) {

  var cx = (start.x + end.x) / 2;
  var cy = (start.y + end.y) / 2;

  var width = Math.abs(start.x - end.x);
  var height = Math.abs(start.y - end.y);

  var path = [start];

  if (width > height) {
    path.push(new G.Vector2D(start.x, cy));
    path.push(new G.Vector2D(end.x, cy));
  } else {
    path.push(new G.Vector2D(cx, start.y));
    path.push(new G.Vector2D(cx, end.y));
  }

  path.push(end);
  return path;
};

/**
 * length of lines used in getConnectionLines. This is arbitrary but should be long
 * enough to ensure intersection of line segments from different nodes on a reasonably sized graph
 * @type {Number}
 */
Connection.kSEGMENT = 50000;

/**
 * return two world space points that orthagonally connect
 * the
 * @return {[type]} [description]
 */
Connection.prototype.getEgressRoute = function() {

  var p1 = this.destinationPointToGlobal();
  var p2 = p1.clone();
  // length of the egress route has a minimum value of C.EXIT but adjust
  // to the stroke width since markers on the ends of connectors will
  // expand with the stroke.
  var len = Math.max(C.EXIT, this.source.strokeWidth * 4);

  var egressCode = this.getEgressType()
  switch (egressCode) {
    case Connection.Egress.right:
      // position start to accommodate stroke width and end to accommodate length of exit route
      // ( since exit routes are orthgonal to the axis and in global space we can just add scalars to the appropriate axis )
      p1.x += this.destination.strokeWidth / 2;
      p2.x = p1.x + len;
      break;
    case Connection.Egress.bottom:
      p1.y += this.destination.strokeWidth / 2;
      p2.y = p1.y + len;
      break;
    case Connection.Egress.left:
      p1.x -= this.destination.strokeWidth / 2;
      p2.x = p1.x - len;
      break;
    case Connection.Egress.top:
      p1.y -= this.destination.strokeWidth / 2;
      p2.y = p1.y - len;
      break;
  }

  // return the line and the egress code
  return {
    line: new G.LineSegment(p1, p2),
    egressCode: egressCode
  }
};


/**
 * get the entry route to our destination, which is just the reverse of egress
 * @return {[type]} [description]
 */
Connection.prototype.getEntryRoute = function() {
  return this.getEgressRoute().reverse();
};

/**
 * calculate the angle between the center of the node we are connected
 * to and our point of connection in world space. Quantize into 4
 * values and return a flag that indicates the direction of egress
 * from the node i.e. from the right, bottom, left, top side
 * @return {[type]} [description]
 */
Connection.prototype.getEgressType = function() {

  var nodeCenter = this.destination.getCenterWorld();
  var point = this.destinationPointToGlobal();
  var a = nodeCenter.angleBetween(point);

  // egress from right
  if (a >= 315 || a < 45) return Connection.Egress.right;
  // egress from bottom
  if (a >= 45 && a < 135) return Connection.Egress.bottom;
  // egress from left
  if (a >= 135 && a < 225) return Connection.Egress.left;
  // egress from top
  return Connection.Egress.top;
};

Connection.Egress = {
  right: 0,
  bottom: 1,
  left: 2,
  top: 3
}

/**
 * remove this connection. Effectively a dispose
 * @return {[type]} [description]
 */
Connection.prototype.breakConnection = function() {

  this.destination.edgesIn = _.without(this.destination.edgesIn, this);
  if (this.source.startConnection === this) {
    this.source.startConnection = null;
  }
  if (this.source.endConnection === this) {
    this.source.endConnection = null;
  }
};


/**
 * get the current end point of the connector in world space.
 * @return {G.Vector2D}
 */
Connection.prototype.destinationPointToGlobal = function() {

  var v = new G.Vector2D(
    this.destinationPosition.x * this.destination.width,
    this.destinationPosition.y * this.destination.height
  );

  return this.destination.localToGlobal(v);
};

module.exports = Connection;
