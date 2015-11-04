var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');
var port = 3000;
var apiRouter = require('./api');

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

app.listen(port, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Building, will serve at http://localhost:' + port);
});
