import React, { Component, PropTypes } from 'react';

import styles from '../styles/ProjectSelect.css';
import withStyles from '../decorators/withStyles';

@withStyles(styles)
export default class ProjectSelect extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setInputValue(nextProps.value);
    }
  }

  getInputValue() {
    return this.refs.input.value;
  }

  setInputValue(val) {
    // Generally mutating DOM is a bad idea in React components,
    // but doing this for a single uncontrolled field is less fuss
    // than making it controlled and maintaining a state for it.
    this.refs.input.value = val;
  }

  handleKeyUp = (event) => {
    if (event.keyCode === 13) {
      this.handleGoClick();
    }
  }

  handleGoClick = (event) => {
    this.props.onChange(this.getInputValue());
  }

  render() {
    return (
      <div className="ProjectSelect">
        <input size="30"
               ref="input"
               className="ProjectSelect-input"
               placeholder="Enter Project ID (dev)"
               defaultValue={this.props.value}
               onKeyUp={this.handleKeyUp}/>
        {/* <button onClick={this.handleGoClick}>
         Go!
         </button> *//* <button onClick={this.handleGoClick}>
         Go!
         </button> */}
      </div>
    );
  }
}
