import React, { Component, PropTypes } from 'react';

import styles from '../../styles/PopupWindow.css';
import withStyles from '../../decorators/withStyles';

@withStyles(styles)
/**
 * title bar for popup windows, requires a title string and method to call when closed
 */
export default class PopupTitleBar extends Component {

  static propTypes = {
    title      : PropTypes.string.isRequired,
    onClose    : PropTypes.func.isRequired
  }

  onCloseClicked = () => {
    this.props.onClose();
  }

  render() {
    return (
      <div className="PopupWindowTitleBar">
        <span>{this.props.title}</span>
        <button className="btn btn-xs btn-default pull-right" onClick={this.onCloseClicked}>X</button>
      </div>
    );
  }
}
