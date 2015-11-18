import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import SequenceEditor from '../plugins/onion2/SequenceEditor'

class Onion2TestPage extends Component {
  render() {
    console.log("!!!!");
    return (
      <div>
      <SequenceEditor/>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {})(Onion2TestPage);
