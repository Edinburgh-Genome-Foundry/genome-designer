import BlockDefinition from '../src/schemas/Block';
import ProjectDefinition from '../src/schemas/Project';
import PartDefinition from '../src/schemas/Part';

var path = require('path');
var express = require('express');
var uuid = require('uuid');
var execSync = require('sync-exec');
var router = express.Router();

//TODO: timeout on all requests

/**
Updates an entry in the database
@param {uuid v4} id
@param {String} data
@param {Function} validate (optional)
**/
function update(id, data, validate) {
  try {
    var cmd = 'redis-cli set ' + id + ' \'' + data + '\'';

    console.log(cmd);
    if (validate) {
      if (validate(JSON.parse( decodeURI(data) ))) {
        execSync(cmd);
      }
    } else {
      execSync(cmd);
    }
  } catch (e) {
    result.error = e.message;
    console.log(e);
  } 
}

/**
Fetch an entry from the database
@param {uuid v4} id
**/
function get(id) {
  var result = {};
  if (id) {
    var cmd = 'redis-cli get ' + id;
    console.log(cmd);
    var output = execSync(cmd).stdout;
    if (output.length > 0) {
        try {
            result = JSON.parse(output);
            result.id = id;
            console.log(result);
        } catch (e) {
            result.error = e.message;
            console.log(e.message + " in " + output);
        }
    }
  }
  return result;
}

/**
Fetch multiple entries from the database.
If the entry is a Block, all subcomponents will be
fetched recursively into the results object
@param {Array} id
@param {Object} result
**/
function getBlocks(ids, result) {
  if (!result) {
    result = {};
  }

  if (ids)
    ids.forEach(
      function(id) {
        var obj = get(id);
        result[id] = obj;

        //recursively get all nested blocks
        if (BlockDefinition.validate(obj)) {  
          result = getBlocks(obj.components, result);
        }
        
      });
  return result;
}


/*
Store the parent-child info 
in the database
@param {uuid} child id
@param {uuid} parent id
*/
function recordHistory(newid, oldid) {
  var hist = get(oldid+"-history");

  if (!hist.history) {
    hist = { history: [oldid] };
  } else {
    hist.history.unshift(oldid);
  }

  update(newid+"-history", JSON.stringify(hist));

  
  var children = get(oldid+"-children");

  if (!children.children) {
    children = { children: [newid] };
  } else {
    children.children.push(newid);
  }

  update(oldid+"-children", JSON.stringify(children));
}

/*********************************
GET
Fetch an entry and all sub-entries
**********************************/

/**
GET handler for fetching Projects
All blocks and their subcomponents will be
fetched recursively into the results object
**/
router.get('/project', function (req, resp) {
  var result = {};
  if (req.query.id) {
    var proj = get(req.query.id);
    if (ProjectDefinition.validate(proj)) {
      result.project = proj;
      result.instances = getBlocks(proj.components);
    }
  }
  resp.json(result);
});

/**
GET handler for fetching Blocks
All blocks and their subcomponents will be
fetched recursively into the results object
**/
router.get('/block', function (req, resp) {
  var result;
  if (req.query.id) {
    var block = get(req.query.id);
    if (BlockDefinition.validate(block)) {
      result = {};
      result.block = block;
      result.instances = getBlocks(block.components);
    }
  }

  if (!result) {
    result = {error: "Not a valid Block ID"};
  }
  resp.json(result);
});

/*
GET handler for children
*/
router.get('/children', function (req, resp) {
  var result = {};
  if (req.query.id) {
    result = get(req.query.id+"-children");
    result.id = req.query.id;
  }
  resp.json(result);
});

/*
GET handler for parents
*/
router.get('/history', function (req, resp) {
  var result = {};
  if (req.query.id) {
    result = get(req.query.id+"-history");
    result.id = req.query.id;
  }
  resp.json(result);
});

/*********************************
PUT
Create an entry for the first time
Server generates the new UUID
**********************************/


/**
PUT handler for creating Projects
**/
router.put('/project', function (req, resp) {
  var result = {};
  req.on('data', function (chunk) {
    var id = uuid.v4();
    var json = JSON.parse(decodeURI(chunk));
    json.id = id;
    if (ProjectDefinition.validate(json)) {
      update(id, chunk);
      result.id = id;
    } else {
      result.error = "Not a valid Project JSON";
      console.log(result.error);
    }
    resp.json(result);
  });
});

/**
PUT handler for creating Blocks
**/
router.put('/block', function (req, resp) {
  var result = {};
  req.on('data', function (chunk) {
    var id = uuid.v4();
    var json = JSON.parse(decodeURI(chunk));
    json.id = id;
    if (BlockDefinition.validate(json)) {
      update(id, chunk);
      result.id = id;
    } else {
      result.error = "Not a valid Block JSON";
      console.log(result.error);
    }
    resp.json(result);
  });
});

/*********************************
POST
Modify an existing entry
**********************************/

router.post('/project', function (req, resp) {
  var result = {};
  if (req.query.id) {
    var id = req.query.id;
    var output = get(id);
    if (output.id) {
        req.on('data', function (chunk) {
          var json = JSON.parse(decodeURI(chunk));
          if (ProjectDefinition.validate(json)) {
            update(id, chunk);
            result.id = id;
          } else {
            result.error = "Not valid Project JSON";
            console.log(result.error);
          }
          resp.json(result);
        });
    } else {
        result.error = "ID does not exist";
        console.log(result.error);
    }
  } else {
    result.error = "No ID provided in input";
    console.log(result.error);
    resp.json(result);
  }
});


router.post('/block', function (req, resp) {
  var result = {};
  if (req.query.id) {
    var id = req.query.id;
    var output = get(id);
    if (output.id) {
        req.on('data', function (chunk) {
          var json = JSON.parse(decodeURI(chunk));
          if (BlockDefinition.validate(json)) {
            update(id, chunk);
            result.id = id;
          } else {
            result.error = "Not a valid Block JSON";
            console.log(result.error);
          }
          resp.json(result);
        });
    } else {
        result.error = "ID does not exist";
        console.log(result.error);
        resp.json(result);
    }
  } else {
    result.error = "No ID provided in input";
    console.log(result.error);
    resp.json(result);
  }
});

/*
Create a child
*/
router.post('/clone', function (req, resp) {
  var result = {};
  if (req.query.id) {
    var oldid = req.query.id;
    var output = get(oldid);
    if (output.id) {
        var newid = uuid.v4();
        result = output;
        result.parent = oldid;
        result.id = newid;
        recordHistory(newid, oldid);
        update(newid, JSON.stringify(result));        
    } else {
        result.error = "ID does not exist";
        console.log(result.error);
    }
  }
  resp.json(result);
});


module.exports = router;
