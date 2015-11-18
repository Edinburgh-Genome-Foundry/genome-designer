import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import App from './containers/App';
import DashboardPage from './containers/DashboardPage';
import ProjectPage from './containers/ProjectPage';
import ConstructPage from './containers/ConstructPage';

import AboutPage from './components/AboutPage';
import SupportPage from './components/SupportPage';
import SequenceEditor from './plugins/onion2/SequenceEditor'
import Onion2TestPage from './containers/Onion2TestPage';
//Routes are specified as a separate component so they can hotloaded
//see: https://github.com/rackt/redux-router/issues/44#issuecomment-140198502

export default (
  <Route path="/" component={Onion2TestPage}>

    {/* todo - signout page w/ dynamic routing *//* todo - signout page w/ dynamic routing */}

    <IndexRoute component={DashboardPage}/>

    <Route path="/about"
           component={AboutPage}/>
    <Route path="/support"
           component={SupportPage}/>

    <Route path="/project/:projectId"
           component={ProjectPage}>
      <Route path="/project/:projectId/:constructId"
             component={ConstructPage}/>
    </Route>
    <Route path="/plugin_test/onion">
        component={Onion2TestPage}
    </Route>

    <Redirect from="/project" to="/" />
  </Route>
);
