import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

class DashboardPage extends Component {
  static propTypes = {
    user: PropTypes.object,
  };

  render() {
    return (
      <div>
        <h1>Dashboard</h1>

        <p>Why don't you look at the Project <Link to="/project/test">Test</Link>?</p>
        <p><Link to="/plugin_test/onion">Onion Plugin test Page</Link></p>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(DashboardPage);
