import React, { Component, PropTypes } from 'react';

import styles from '../../styles/PopupWindow.css';
import withStyles from '../../decorators/withStyles';
import PopupWindowTitleBar from './PopupTitleBar';
import Draggable from 'react-draggable';


@withStyles(styles)
/**
 * Popup window class. Accepts any component as it client.
 * Required properties:
 *
 * {String} title - title bar text for window
 * {Function} onClose - function to call when the window is closed
 * {ReactElement} client - element to place in the client area
 */
export default class PopupWindow extends Component {

  static propTypes = {
    title      : PropTypes.string.isRequired,
    client     : PropTypes.object.isRequired,
    onClose    : PropTypes.func.isRequired
  }

  // when closed via the title bar
  onClose = () => {
    this.props.onClose();
  }

  render() {
    return (
      <Draggable handle=".PopupWindowTitleBar">
        <div className="PopupWindow PopupWindowVisible">
          <PopupWindowTitleBar title={this.props.title} onClose={this.onClose}></PopupWindowTitleBar>
          {this.props.client}
        </div>
      </Draggable>
    );
  }
}
