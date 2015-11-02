import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import App from './containers/App';
import DashboardPage from './containers/DashboardPage';
import ProjectPage from './containers/ProjectPage';
import ConstructPage from './containers/ConstructPage';

import AboutPage from './components/AboutPage';
import SupportPage from './components/SupportPage';
import BootstrapPage from './containers/BootstrapPage';

//Routes are specified as a separate component so they can hotloaded
//see: https://github.com/rackt/redux-router/issues/44#issuecomment-140198502

export default (
  <Route path="/" component={App}>

    {/* todo - signout page w/ dynamic routing */}

    <IndexRoute component={DashboardPage}/>

    <Route path="/about"
           component={AboutPage}/>
    <Route path="/support"
           component={SupportPage}/>
    <Route path="/bootstrap"
           component={BootstrapPage}/>
    <Route path="/project/:projectId"
           component={ProjectPage}>
      <Route path="/project/:projectId/:constructId"
             component={ConstructPage}/>
    </Route>

    <Redirect from="/project" to="/" />
  </Route>
);
