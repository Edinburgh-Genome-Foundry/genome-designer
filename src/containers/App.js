import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import GlobalNav from './GlobalNav';

import styles from '../styles/App.css';
import withStyles from '../decorators/withStyles';

@withStyles(styles)
class App extends Component {
  static propTypes = {
    children: PropTypes.node, // Injected by React Router
  }

  render() {
    const { children } = this.props;
    return (
      <div className="App">
        <GlobalNav />
        <div className="App-pageContent">
          {children}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {})(App);
