import { createStore, applyMiddleware, compose } from 'redux';
import { reduxReactRouter } from 'redux-router';
import { devTools } from 'redux-devtools';
import createHistory from 'history/lib/createBrowserHistory';
import routes from '../routes';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../reducers';

// note that the store loads the routes, which in turn load components
// Routes are provided to the store. ReduxRouter works with react-router. see routes.js - they are injected as middleware here so they can be provided to components, and route information can be accessed as application state.

const finalCreateStore = compose(

  // middleware like thunk (async, promises) should come first in the chain
  applyMiddleware(thunk),

  reduxReactRouter({
    routes,
    createHistory,
  }),

  applyMiddleware(createLogger()),
  devTools()
)(createStore);

export default function configureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
