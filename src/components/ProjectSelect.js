import React, { Component, PropTypes } from 'react';
import styles from '../styles/ProjectSelect.css';
import withStyles from '../decorators/withStyles';

/**
 * use a decorator to pre-render our CSS styles into the DOM
 */
@withStyles(styles)
/**
 * ProjectSelect ctor
 * @constructor
 */
export default class ProjectSelect extends Component {

  /**
   * validation for property types
   * @type {Object}
   */
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  };

  /**
   * when our properties change
   * @param  {Object} nextProps  - change set
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.refs.input.value = nextProps.value;
    }
  }

  /**
   * The input box and button are part of form. Handle submission
   * by passing the new value to our change handler and preventing
   * actual submission of the form
   * @param  {SyntheticEvent} e
   */
  handleSubmit = (e) => {
    this.props.onChange(this.refs.input.value);
    e.preventDefault();
  }

  /**
   * render the project selector
   * @return {ReactElement}
   */
  render() {
    return (
      <div className="ProjectSelect">
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input size="30"
                   className="form-control"
                   ref="input"
                   placeholder="Enter Project ID (dev)"
                   defaultValue={this.props.value}/>
          </div>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

    );
  }
}
