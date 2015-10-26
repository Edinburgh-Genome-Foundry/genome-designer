var C = {};

/**
 * minimum height of lines ( so that their bounds are still selected with the mouse )
 * @type {Number}
 */
C.MIN_LINEHEIGHT = 40;

/**
 * maximum stroke width for canvas/svg glyphs. This controls various
 * aspects of the UI and glyph rendering.
 * @type {Number}
 */
C.SW = 50;

// diameter / width / height of grab handles
C.HANDLE_SIZE = 10;

/**
 * limits of view scaling
 * @type {Number}
 */
C.MIN_SCALE = 0.25;
C.MAX_SCALE = 5;

/**
 * minimum width / height of nodes
 * @type {number}
 */
C.NODE_MIN = 20;

/**
 * MS debounce for viewer resizing / browser resizing
 * @type {Number}
 */
C.RESIZE_BOUNCE = 50;

/**
 * length of rounded corners on connectors ( maximum )
 * @type {Number}
 */
C.CURVE_INSET = C.SW * 1.5;

/**
 * line segment proximity for hit detection on connectors
 * @type {[type]}
 */
C.CONNECTOR_HIT = C.SW / 2;

/**
 * length of exit connectors from nodes
 * @type {Number}
 */
C.EXIT = 40;

/**
 * threshold for angular snapping in degrees ( this amount each side of the cardinal angles )
 * @type {Number}
 */
C.ANGLE_SNAP = 8;


// max number of items in the undo stack
C.UNDO_MAX = 20;

// metrics / constants for icons
C.ICON_STROKEWIDTH = 1;
C.ICON_STROKE = 'black';
C.ICON_FILL = 'white';
C.ICON_INSET = 4.5;

// shape palette icon sizes
C.SHAPE_PALETTE_ICON_W = 32;
C.SHAPE_PALETTE_ICON_H = 32;

// default max size of bitmaps when added to the graph
C.DEFAULT_BITMAP_W = 200;
C.DEFAULT_BITMAP_H = 200;
C.DEFAULT_BITMAP_OFFSET = 100;
// angle/slope of the ends of parallelograms ( in degrees )
C.PARI = 22;

/**
 * available styles for end markers ( applies to lines and connectors )
 * @type {Object}
 */
C.markerStyles = {
  'none': -1,
  'circle': 0,
  'square': 1,
  'arrow': 2,
};

/**
 * default width / height of presentations
 * @type {Number}
 */
C.DEFAULT_WIDTH = 1200;
C.DEFAULT_HEIGHT = 1200;

// maximum length of title
C.MAX_TITLE_LEN = 200;

// delay between user changes and an autosave occuring, unless another change is made
C.AUTOSAVE_DELAY = 5000;

// debounce interval for deferred updating of graph cards after an undo event
C.GRAPHCARD_DEFER = 2000;

module.exports = C;
