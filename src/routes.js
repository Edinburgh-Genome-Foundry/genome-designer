import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';
import App from './containers/App';
import AboutPage from './containers/AboutPage';
import SceneGraphPage from './containers/SceneGraphPage';
import SupportPage from './containers/SupportPage';
import DashboardPage from './containers/DashboardPage';
import ProjectPage from './containers/ProjectPage';
import ConstructPage from './containers/ConstructPage';

//Routes are specified as a separate component so they can hotloaded
//see: https://github.com/rackt/redux-router/issues/44#issuecomment-140198502

export default (
  <Route path="/" component={App}>

    {/* todo - signout page w/ dynamic routing */}

    <IndexRoute component={DashboardPage}/>

    <Route path="/about" component={AboutPage}/>

    <Route path="/scenegraph" component={SceneGraphPage}/>

    <Route path="/support" component={SupportPage}/>

    <Route path="/project/:projectId" omponent={ProjectPage}>
      <Route path="/project/:projectId/:constructId" component={ConstructPage}/>
    </Route>

    <Redirect from="/project" to="/" />
  </Route>
);
