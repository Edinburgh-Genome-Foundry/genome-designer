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
      menuShown: false
    }
  }

  static propTypes = {
    title      : PropTypes.string.isRequired,
    menuItems  : PropTypes.array.isRequired
  }

  toggleMenu = (e) => {
    this.setState({
      menuShow: !this.state.menuShow
    });
  }

  render() {

    let container = this.state.menuShow ?
    <div className="menu-dropdown-container">
      {this.props.menuItems}
    </div> : null;
    return (
      <div className="menu-dropdown" onClick={this.toggleMenu}>
        <button className="btn btn-default" onClick={this.toggleMenu}>{this.props.title}</button>
        {container}
      </div>
    );
  }
}
