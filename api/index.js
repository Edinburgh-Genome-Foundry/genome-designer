import BlockDefinition from '../src/schemas/Block';
import ProjectDefinition from '../src/schemas/Project';
import PartDefinition from '../src/schemas/Part';

var path = require('path');
var express = require('express');
var uuid = require('uuid');
var execSync = require('sync-exec');
var router = express.Router();

function update(id, string, validate) {
  try {
    if (validate) {
      if (validate(JSON.parse( decodeURI(string) ))) {
        execSync('redis-cli set ' + id + ' \'' + string + '\'');
      }
    } else {
      execSync('redis-cli set ' + id + ' \'' + string + '\'');
    }
  } catch (e) {
    result.error = e.message;
    console.log(e);
  } 
}

function get(id) {
  var result = {};
  if (id) {
    console.log('redis-cli get ' + id);
    var output = execSync('redis-cli get ' + id).stdout;
    if (output.length > 0) {
        try {
            console.log(output);
            result = JSON.parse(output);
            result.id = id;
        } catch (e) {
            result.error = e.message;
            console.log(e.message + " in " + output);
        }
    }
  }
  return result;
}

function getMulti(ids, result) {
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
          result = getMulti(obj.components, result);
        }
        
      });
  return result;
}

router.get('/project', function (req, resp) {
  var result = {};
  if (req.query.id) {
    console.log(req.query);

    var proj = get(req.query.id);
    if (ProjectDefinition.validate(proj)) {
      result.project = proj;
      result.instances = getMulti(proj.components);
    }
  }
  resp.json(result);
});

router.get('/block', function (req, resp) {
  var result;
  if (req.query.id) {
    console.log(req.query);

    var block = get(req.query.id);
    if (BlockDefinition.validate(block)) {
      result = {};
      result.block = block;
      result.instances = getMulti(block.components);
    }
  }

  if (!result) {
    result = {error: "Not a valid Block ID"};
  }
  resp.json(result);
});


router.put('/project', function (req, resp) {
  var result = {};
  console.log(req.query);
  req.on('data', function (chunk) {
    var id = uuid.v4();
    var json = JSON.parse(decodeURI(chunk));
    json.id = id;
    console.log(json);
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

router.put('/block', function (req, resp) {
  var result = {};
  req.on('data', function (chunk) {
    var id = uuid.v4();
    var json = JSON.parse(decodeURI(chunk));
    json.id = id;
    console.log(json);
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

router.post('/project', function (req, resp) {
  var result = {};
  console.log(req.query);
  if (req.query.id) {
    var id = req.query.id;
    var output = get(id);
    if (output) {
        req.on('data', function (chunk) {
          var json = JSON.parse(decodeURI(chunk));
          console.log(json);
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
  }
});


router.post('/block', function (req, resp) {
  var result = {};
  console.log(req.query);
  if (req.query.id) {
    var id = req.query.id;
    var output = get(id);
    if (output) {
        req.on('data', function (chunk) {
          var json = JSON.parse(decodeURI(chunk));
          console.log(json);
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
    }
  }
});

module.exports = router;
