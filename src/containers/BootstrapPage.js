import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import styles from '../styles/BootstrapPage.css';
import withStyles from '../decorators/withStyles';
import PopupWindow from '../components/PopupWindow/PopupWindow';
import Login from '../components/Login';

/**
 * just for testing bootstrap, hence the lack of comments
 */
@withStyles(styles)
class BootstrapPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loginVisible: false
    }
  }

  onCloseLogin = (e) => {
    this.setState({
      loginVisible: false
    });
  }

  showLogin = () => {
    this.setState({
      loginVisible: true
    });
  }

  render() {

    var login = this.state.loginVisible ? <PopupWindow
              onClose={this.onCloseLogin}
              title="Test Login Window"
              client={<Login onClose={this.onCloseLogin}></Login>}>
            </PopupWindow>: null;

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
        <div className="login-container">
          <button className="btn btn-success" onClick={this.showLogin}>Show Login</button>
          {login}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(BootstrapPage);
