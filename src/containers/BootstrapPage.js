import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

class BootstrapPage extends Component {

  render() {
    return (
      <div className="container">
        <div className="well">
          <h1>Jumbo Bootstrap H1</h1>
          <button className="btn btn-primary">Bootstrap</button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(BootstrapPage);
