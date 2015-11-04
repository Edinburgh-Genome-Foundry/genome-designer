import BlockDefinition from '../src/schemas/Block';
import ProjectDefinition from '../src/schemas/Project';
import PartDefinition from '../src/schemas/Part';

var path = require('path');
var express = require('express');
var uuid = require('uuid');
var execSync = require('sync-exec');
var router = express.Router();

/*
fetch('/api/project?id=f154171f-b158-48eb-a11f-6cddeaecea12',
   { 
      method:'get',
      type:'json'
    })
.then(function(res) 
   { 
      return res.json() 
   })
.then(function(res) 
   { 
      console.log(res); 
   })


fetch('/api/project',
   { 
      method:'put',
      body:'{name:"jack"}'
    })
.then(function(res) 
   { 
      return res.json() 
   })
.then(function(res) 
   { 
      console.log(res); 
   })
*/

router.get('/project', function (req, res) {
  var result = {};
  if (req.query.id) {
    console.log(req.query);
    result.id = req.query.id;
    var output = execSync('redis-cli get ' + req.query.id).stdout;
    if (output.length > 0) {
        try {
            console.log(output);
            result = JSON.parse(output);
        } catch (e) {
            result.error = e.message;
            console.log(e);
        }
    }
  }
  res.json(result);
});


router.put('/project', function (req, res) {
  var result = {};
  console.log(req.query);
  req.on('data', function (chunk) {
    console.log(decodeURI(chunk));
    var id = uuid.v4();
    try {
        execSync('redis-cli set ' + id + ' ' + chunk);
        result.id = id;
        console.log(id);
    } catch (e) {
        result.error = e.message;
        console.log(e);
    }  
    res.json(result);
  });
});

router.post('/project', function (req, res) {
  var result = {};
  console.log(req.query);
  req.on('data', function (chunk) {
    console.log(decodeURI(chunk));
  });
  if (req.query.id) {
    var id = req.query.id;
    var output = execSync('redis-cli get ' + req.query.id).stdout;
    if (output.length > 0) {
        try {
            console.log(req.query);
            execSync('redis-cli set ' + id + ' ' + JSON.stringify(req.query));
            result.id = id;    
        } catch (e) {
            result.error = e.message;
            console.log(e);
        }
    } else {
        result.error = "ID does not exist";
        console.log("ID does not exist");
    }
  }
  res.json(result);
});

module.exports = router;
