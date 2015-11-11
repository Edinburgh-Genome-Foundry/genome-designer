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
export default class SubMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: true
    }
  }

  static propTypes = {
    menuItems     : PropTypes.array.isRequired
  }

  /**
   * change state to open and tell our parent menu bar that we are open
   */
  open = () => {
    this.setState({
      isOpen: true
    });
    document.addEventListener('click', this.documentClick);
  }

  /**
   * change state to closed
   */
  close = () => {
    this.setState({
      isOpen: false
    });
    document.removeEventListener('click', this.documentClick);
  }

  /**
   * we monitor document clicks when open so we can close ourselves if
   * a click outside the element occurs
   * @return {[type]} [description]
   */
  documentClick = () => {
    this.close();
  }

  /**
   * toggle open state
   */
  toggle = () => {
    if (this.state.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * render menu
   * @return {<Menu>}
   */
  render() {

    let container = this.state.isOpen ?
    <div className="menu-submenu-dropdown-container">
      {this.props.menuItems}
    </div> : null;

    // render the menu drop down and header and optionally the child items
    return (
      <div className="submenu-position">
        {container}
      </div>
    );
  }
}
