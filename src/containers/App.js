import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { projectCreate } from '../actions';
import GlobalNav from './GlobalNav';

import styles from '../styles/App.css';
import withStyles from '../decorators/withStyles';

@withStyles(styles)
class App extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    children: PropTypes.node, // Injected by React Router
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let nextValue = this.refs.projectID.value.trim();
  }

  render() {
    const { children } = this.props;
    return (
      <div>

        <div className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand" href='/'>Home</a>
            </div>
            <div className="nav navbar-form navbar-right">
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <input type="text" ref="projectID" className="form-control" placeholder="Enter Project ID"></input>
                </div>
                <button type="submit" className="btn btn-primary app-submit">Submit</button>
              </form>
            </div>
          </div>
        </div>

        <GlobalNav />

        <div className="App-pageContent">
          {children}
        </div>

        <nav className="navbar navbar-default navbar-fixed-bottom">
          <div className="container-fluid">

              <div className="row">
                <div className="col-sm-3"></div>
                <div className="col-sm-3">One</div>
                <div className="col-sm-3">Two</div>
                <div className="col-sm-3">Three</div>
              </div>

              <div className="row">
                <div className="col-sm-3"></div>
                <div className="col-sm-3">Four</div>
                <div className="col-sm-3">Five</div>
                <div className="col-sm-3">Six</div>
              </div>
          </div>
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
