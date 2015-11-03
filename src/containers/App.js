import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { Link } from 'react-router';
import { projectCreate } from '../actions';
import GlobalNav from './GlobalNav';
import styles from '../styles/App.css';
import withStyles from '../decorators/withStyles';

/**
 * use a decorator to pre-render our CSS styles into the DOM
 */
@withStyles(styles)
/**
 * @constructor
 */
class App extends Component {

  /**
   * validation for property types
   * @type {Object}
   */
  static propTypes = {
    children: PropTypes.node, // Injected by React Router
  }

  /**
   * renders the header / footer and page content.
   * @return {ReactElement}
   */
  render() {
    const { children } = this.props;
    return (
      <div>

        <div className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <Link className="navbar-brand" to="/">Home</Link>
            </div>
            <div className="nav navbar-form navbar-right">
              <GlobalNav />
            </div>
          </div>
        </div>

        <div className="App-pageContent">
          {children}
        </div>

        <nav className="navbar navbar-default navbar-fixed-bottom">
          <p className="text-center">Genome Designer</p>
        </nav>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {
})(App);
