import BlockDefinition from '../src/schemas/Block';
import ProjectDefinition from '../src/schemas/Project';
import PartDefinition from '../src/schemas/Part';

var path = require('path');
var express = require('express');
var uuid = require('uuid');
var execSync = require('sync-exec');
var router = express.Router();

/*
fetch('/api/project?id=5b4d7ebb-3b42-494c-8ed4-13c5726d5953',
   { 
      method:'get',
      type:'json'
    })
.then(function(resp) 
   { 
      return resp.json() 
   })
.then(function(resp) 
   { 
      console.log(resp); 
   })


fetch('/api/project',
   { 
      method:'put',
      body:JSON.stringify({name:"jack"})
    })
.then(function(resp) 
   { 
      return resp.json() 
   })
.then(function(resp) 
   { 
      console.log(resp); 
   })
*/

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
  var result;
  if (id) {
    var output = execSync('redis-cli get ' + id).stdout;
    if (output.length > 0) {
        try {
            console.log(output);
            result = JSON.parse(output);
            result.id = id;
        } catch (e) {
            result.error = e.message;
            console.log(e);
        }
    }
  }
  return result;
}

function getMulti(ids, result) {
  if (!result) {
    result = {};
  }

  ids.forEach(
    function(id) {
      var obj = get(id);
      result[id] = obj;

      //recursively get all nested blocks
      if (BlockDefinition.validate(obj)) {  
        result = getMulti(obj.subcomponents, result);
      }
      
    });
}

router.get('/project', function (req, resp) {
  var result = {};
  if (req.query.id) {
    console.log(req.query);

    var proj = get(req.query.id);
    if (ProjectDefinition.validate(proj)) {

      result.project = proj;
      result.blocks = getMulti(proj.constructs);
  }
  resp.json(result);
});

router.get('/block', function (req, resp) {
  var result = {};
  if (req.query.id) {
    console.log(req.query);

    var block = get(req.query.id);
    if (BlockDefinition.validate(block)) {

      result.block = block;
      result.blocks = getMulti(proj.subcomponents);
  }
  resp.json(result);
});


router.put('/project', function (req, resp) {
  var result = {};
  console.log(req.query);
  req.on('data', function (chunk) {
    var id = uuid.v4();
    var json = JSON.parse(decodeURI(chunk));
    console.log(json);
    if (ProjectDefinition.validate(json)) {
      update(id, chunk);
      result.id = id;
    }
    resp.json(result);
  });
});

router.put('/block', function (req, resp) {
  var result = {};
  console.log(req.query);
  req.on('data', function (chunk) {
    var id = uuid.v4();
    var json = JSON.parse(decodeURI(chunk));
    console.log(json);
    if (BlockDefinition.validate(json)) {
      update(id, chunk);
      result.id = id;
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
            var id = uuid.v4();
            try {
                execSync('redis-cli set ' + id + ' \'' + chunk + '\'');
                result.id = id;
                console.log(id);
            } catch (e) {
                result.error = e.message;
                console.log(e);
            }  
            resp.json(result);
          });
    } else {
        result.error = "ID does not exist";
        console.log("ID does not exist");
    }
  }
  resp.json(result);
});

module.exports = router;
