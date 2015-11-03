import BlockDefinition from '../../src/schemas/Block';
import ProjectDefinition from '../../src/schemas/Project';
import PartDefinition from '../../src/schemas/Part';

var path = require('path');
var express = require('express');
var uuid = require('uuid');
var execSync = require('exec-sync');
var router = express.Router();

router.get('/project', function (req, res) {
  var result = {};
  console.log(req.query);
  if (req.query.id) {
    var output = execSync('redis-cli get ' + req.query.id);
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
  if (req.query) {
    var id = uuid.v4();
    try {
        execSync('redis-cli set ' + id + ' ' + JSON.stringify(req.query));
        result.id = id;    
    } catch (e) {
        result.error = e.message;
        console.log(e);
    }
  }
  res.json(result);
});

router.post('/project', function (req, res) {
  var result = {};
  console.log(req.query);
  if (req.query.id) {
    var id = req.query.id;
    var output = execSync('redis-cli get ' + req.query.id);
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
