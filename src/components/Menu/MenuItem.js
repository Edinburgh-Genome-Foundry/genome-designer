import React, { Component, PropTypes } from 'react';

import styles from '../../styles/Menu.css';
import withStyles from '../../decorators/withStyles';


@withStyles(styles)
/**
 * Popup window class. Accepts any component as it client.
 * Required properties:
 *
 * {String} title - title bar text for window
 * {Function} onClose - function to call when the window is closed
 * {ReactElement} client - element to place in the client area
 */
export default class MenuItem extends Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    text      : PropTypes.string.isRequired,
    onClick   : PropTypes.func.isRequired
  }

  render() {
    return (
      <div className="menu-item" onClick={this.props.onClick}>{this.props.text}</div>
    );
  }
}
