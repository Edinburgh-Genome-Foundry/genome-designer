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
export default class Menu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    }
  }

  static propTypes = {
    title         : PropTypes.string.isRequired,
    menuItems     : PropTypes.array.isRequired,
    parentMenuBar : PropTypes.object.isRequired
  }

  /**
   * change state to open and tell our parent menu bar that we are open
   */
  open = () => {
    this.props.parentMenuBar.menuOpening(this);
    this.setState({
      isOpen: true
    });
  }

  /**
   * change state to closed
   */
  close = () => {
    this.props.parentMenuBar.menuClosing(this);
    this.setState({
      isOpen: false
    });
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
   * mouse over the drop down shows the menu IF there is already a menu open.
   * Only our parent menu bar can perform this functionality
   */
  mouseOver = () => {
    this.props.parentMenuBar.mouseOverMenu(this);
  }

  /**
   * render menu
   * @return {<Menu>}
   */
  render() {

    // container and associated child menu items is only rendered when open
    let container = this.state.isOpen ?
    <div className="menu-dropdown-container">
      {this.props.menuItems}
    </div> : null;

    // prepare class to reflect open / closed state
    var klassName = this.state.isOpen ? "menu-header menu-header-open" : "menu-header";

    // render the menu drop down and header and optionally the child items
    return (
      <div className="menu-dropdown" onClick={this.toggle} onMouseOver={this.mouseOver}>
        <div className={klassName} onClick={this.toggle}>{this.props.title}</div>
        {container}
      </div>
    );
  }
}
