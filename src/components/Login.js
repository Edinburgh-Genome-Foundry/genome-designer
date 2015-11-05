import React, { Component, PropTypes } from 'react';

import styles from '../styles/Login.css';
import withStyles from '../decorators/withStyles';


@withStyles(styles)
/**
 * just for testing, a fake login dialog
 */
export default class Login extends Component {

  onSubmit = (e) => {
    e.preventDefault();
    this.props.onClose();
  }

  render() {
    return (
      <div>
        <form className="form-horizontal login-client" onSubmit={this.onSubmit}>
          <div className="form-group">
            <label htmlFor="inputEmail3" className="col-sm-2 control-label">Email</label>
            <div className="col-sm-10">
              <input type="email" className="form-control" id="inputEmail3" placeholder="Email"/>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="inputPassword3" className="col-sm-2 control-label">Password</label>
            <div className="col-sm-10">
              <input type="password" className="form-control" id="inputPassword3" placeholder="Password"/>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <div className="checkbox">
                <label htmlFor="inputPassword3">
                  <input type="checkbox"/>
                Remember Me</label>
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-sm btn-default">Sign in</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
