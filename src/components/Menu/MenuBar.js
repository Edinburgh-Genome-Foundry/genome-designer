import React, { Component, PropTypes, cloneElement } from 'react';
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
export default class MenuBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openMenu: null
    }
  }

  static propTypes = {

  }

  /**
   * called from a menu that is about to open. Will closing any currently open menu first
   * @param  {<Menu>} menu - menu that is about to open
   */
  menuOpening(menu) {
    if (this.state.openMenu) {
      this.state.openMenu.close();
    }
    this.setState({
      openMenu: menu
    });
  }
  /**
   * called from a menu that is closing
   * @param  {<Menu>} menu - menu that is about to open
   */
  menuClosing(menu) {
    this.setState({
      openMenu: null
    });
  }

  /**
   * mouse over a menu. If acts like the menu was clicked IF a menu
   * is already open
   * @param  {<Menu>} menu
   */
  mouseOverMenu(menu) {
    if (this.state.openMenu) {
      menu.open();
    }
  }

  render() {
    return (
      <div className="menu-bar">
        {this.props.menus.map( (menu) => {
          return cloneElement(menu, {parentMenuBar: this});
        })}
      </div>
    );
  }
}
