import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ReduxRouter } from 'redux-router';
import store from './store';
// This is the entry point webpack loads when we
// are not testing. Normally all your app code would
// initialize here. This is however just a test to load
// [bootstrap](http://getbootstrap.com/) using
// [bootstrap-webpack](https://github.com/bline/bootstrap-webpack)
require('bootstrap-webpack!../bootstrap.config.js');
var $ = require('jquery');

render(
  <Provider store={store}>
    <ReduxRouter />
  </Provider>,
  document.getElementById('root')
);

if (process.env.NODE_ENV !== 'production') {
  // Use require because imports can't be conditional.
  // In production, you should ensure process.env.NODE_ENV
  // is envified so that Uglify can eliminate this
  // module and its dependencies as dead code.
  require('./createDevToolsWindow')(store);
}
