var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');
var DEFAULT_PORT = 3000;
var port = parseInt(process.argv[2]) || process.env.PORT ||  DEFAULT_PORT;
var hostname = '0.0.0.0';
var apiRouter = require('./server/api');

var app = express();
var compiler = webpack(config);


// Register Hotloading Middleware
// ----------------------------------------------------

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));


// Register API middleware
// ----------------------------------------------------

app.use('/api', apiRouter);


// Register Client Requests, delegate routing to client
// ----------------------------------------------------

//so that any routing is delegated to the client
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'src/index.html'));
});

app.listen(port, hostname, function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Building, will serve at http://' + hostname + ':' + port);
});

module.exports = app;