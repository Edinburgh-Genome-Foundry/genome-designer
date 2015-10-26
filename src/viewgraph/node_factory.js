var Node = require('./node');
var HTMLNode = require('./htmlnode');
var Line = require('./line');
var Group = require('./group');
var SmartConnector = require('./smartconnector');
var Events = require('./events');

// for now, the node factory has to be decoupled from the Node class to avoid
// circular dependencies.

var NodeFactory = function() {

  Events.I().subscribe(Events.CREATE_NODE, function(event, typeName, viewgraph, obj) {

    switch (typeName) {

      case 'Node':
        obj.node = new Node(viewgraph); break;
      case 'Group':
        obj.node = new Group(viewgraph); break;
      case 'Line':
        obj.node = new Line(viewgraph); break;
      case 'SmartConnector':
        obj.node = new SmartConnector(viewgraph); break;
      case 'HTMLNode':
        obj.node = new HTMLNode(viewgraph); break;
      default:
        {
          throw new Error('Bad Node Type Name');
        }
    }
  });
};

module.exports = new NodeFactory();
