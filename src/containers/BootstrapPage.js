import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import styles from '../styles/BootstrapPage.css';
import withStyles from '../decorators/withStyles';

@withStyles(styles)
class BootstrapPage extends Component {

  render() {
    return (
      <div className="container">
        <div className="well">
          <h1>Custom Bootstrap Test Page</h1>
          <ul>
            <a href="https://www.npmjs.com/package/bootstrap-webpack"><li>Integrated with Bootstrap-Webpack</li></a>
            <a href="http://bootstrap-live-customizer.com/"><li>Customized with Bootstrap Customizer</li></a>
          </ul>

          <div className="btn-toolbar">
            <button className="btn btn-default">Default</button>
            <button className="btn btn-primary">Primary</button>
            <button className="btn btn-success">Success</button>
            <button className="btn btn-info">Info</button>
            <button className="btn btn-warning">Warning</button>
            <button className="btn btn-danger">Danger</button>
          </div>
          <br></br>
          <div className="btn-toolbar">
            <button className="btn btn-xs btn-default">Default</button>
            <button className="btn btn-xs btn-primary">Primary</button>
            <button className="btn btn-xs btn-success">Success</button>
            <button className="btn btn-xs btn-info">Info</button>
            <button className="btn btn-xs btn-warning">Warning</button>
            <button className="btn btn-xs btn-danger">Danger</button>
          </div>
        </div>
        <form className="form-horizontal form-example">
          <div className="form-group">
            <label for="inputEmail3" className="col-sm-2 control-label">Email</label>
            <div className="col-sm-10">
              <input type="email" className="form-control" id="inputEmail3" placeholder="Email"></input>
            </div>
          </div>
          <div className="form-group">
            <label for="inputPassword3" className="col-sm-2 control-label">Password</label>
            <div className="col-sm-10">
              <input type="password" className="form-control" id="inputPassword3" placeholder="Password"></input>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <div className="checkbox">
                <label>
                  <input type="checkbox"> Remember me</input>
                </label>
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-default">Sign in</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(BootstrapPage);
