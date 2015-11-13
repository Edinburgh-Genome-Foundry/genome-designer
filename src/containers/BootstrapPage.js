import React, {
  Component,
  PropTypes
} from 'react';
import {
  Link
} from 'react-router';
import {
  connect
} from 'react-redux';
import styles from '../styles/BootstrapPage.css';
import withStyles from '../decorators/withStyles';
import PopupWindow from '../components/PopupWindow/PopupWindow';
import MenuBar from '../components/Menu/MenuBar';
import Menu from '../components/Menu/Menu';
import SubMenu from '../components/Menu/SubMenu';
import MenuItem from '../components/Menu/MenuItem';
import MenuSeparator from '../components/Menu/MenuSeparator';
import Login from '../components/Login';
import SVGSurface from '../components/svg/svg';
import SVGTransform from '../components/svg/svgtransform';
import SVGRect from '../components/svg/svgrect';
import SVGBlock from '../components/svg/svgblock';
import ColorJS from 'color-js';

/**
 * just for testing bootstrap, hence the lack of comments
 */
@withStyles(styles)
class BootstrapPage extends Component {

  constructor (props) {
    super(props);
    this.state = {
      loginVisible: false,
      store: this.fakeStore()
    }
  }

  onCloseLogin = (e) => {
    this.setState({loginVisible: false});
  }

  showLogin = () => {
    this.setState({loginVisible: true});
  }

  onMenuItem = () => {
    this.setState({
      store: this.fakeStore()
    })
  }

  /*
   * build some fake data to test SVG rendering
   */
  fakeStore = () => {

    console.time('Generate Blocks');

    const kMC = 4;
    const kMD = 15;

    const colors = ['#DBE8C7','#8DA5D2','#FEE798','#E8D1E4','#FEE3BA'];

    let fakeit = (depth) => {
      if (depth >= kMD) {
        return;
      }

      let n = Math.floor(Math.random() * kMC);

      if (depth === 0) {
        n = Math.max(1, n);
      }

      const kids = [];

      for(let i = 0; i < n; i += 1) {

          let c = Math.min(colors.length-1, Math.round(Math.random() * colors.length));

          kids.push({
            text: depth,
            color: colors[c],
            children: fakeit(depth + 1),
          });
      }
      return kids;
    }
    const r = fakeit(0);
    console.timeEnd('Generate Blocks');
    return r;
  }

  render () {

    let login = this.state.loginVisible
      ? <PopupWindow onClose={this.onCloseLogin} title="Test Login Window" client={<Login onClose={this.onCloseLogin}></Login>}></PopupWindow>
      : null;

    // test color-js
    let c1 = new ColorJS('dodgerblue');
    let c2 = c1.darkenByRatio(0.5);

    return (
      <div className="container">
        <div className="well">
          <h1>Custom Bootstrap Test Page</h1>
          <ul>
            <a href="https://www.npmjs.com/package/bootstrap-webpack">
              <li>Integrated with Bootstrap-Webpack</li>
            </a>
            <a href="http://bootstrap-live-customizer.com/">
              <li>Customized with Bootstrap Customizer</li>
            </a>
          </ul>

          <div className="btn-toolbar">
            <button className="btn btn-default">Default</button>
            <button className="btn btn-primary">Primary</button>
            <button className="btn btn-success">Success</button>
            <button className="btn btn-info">Info</button>
            <button className="btn btn-warning">Warning</button>
            <button className="btn btn-danger">Danger</button>
          </div>

        </div>

        <div>
          <button className="btn btn-success" onClick={this.showLogin}>Show Login</button>
          {login}
        </div>
        <br></br>
        <MenuBar menus={[
          < Menu title = "File" menuItems = {
            [
              < MenuItem text = "Account" onClick = {
                this.onMenuItem
              } > </MenuItem>, < MenuItem text = "Profile" onClick = {
                this.onMenuItem
              } > </MenuItem>, < MenuSeparator > </MenuSeparator>, < MenuItem text = "Sign Out" onClick = {
                this.onMenuItem
              } > </MenuItem>
            ]
          } > </Menu>, < Menu title = "Edit" menuItems = {
            [
              < MenuItem text = "Cut" onClick = {
                this.onMenuItem
              } > </MenuItem>, < MenuItem text = "Copy" onClick = {
                this.onMenuItem
              } > </MenuItem>, < MenuItem text = "Paste" onClick = {
                this.onMenuItem
              } > </MenuItem>, < MenuSeparator > </MenuSeparator>, < MenuItem text = "Delete" onClick = {
                this.onMenuItem
              } > </MenuItem>, < MenuItem text = "Select All" onClick = {
                this.onMenuItem
              } > </MenuItem>
            ]
          } > </Menu>, < Menu title = "View" menuItems = {
            [
              < MenuItem text = "Always Show Bookmarks Bar" onClick = {
                this.onMenuItem
              } > </MenuItem>, < MenuSeparator > </MenuSeparator>, < MenuItem text = "Stop" onClick = {
                this.onMenuItem
              } > </MenuItem>, < MenuItem text = "Force Reload Page" onClick = {
                this.onMenuItem
              } > </MenuItem>, < MenuSeparator > </MenuSeparator>, < MenuItem text = "Enter Presentation Mode A Very Long Menu Item" onClick = {
                this.onMenuItem
              } > </MenuItem>, < MenuItem text = "Enter Full Screen" onClick = {
                this.onMenuItem
              } > </MenuItem>, < MenuItem text = "Zoom In" onClick = {
                this.onMenuItem
              } > </MenuItem>, < MenuItem text = "Zoom Out" onClick = {
                this.onMenuItem
              } > </MenuItem>, < MenuSeparator > </MenuSeparator>, < MenuItem text = "Encoding" onClick = {
                this.onMenuItem
              } > <SubMenu menuItems={[
                < MenuItem text = "One" onClick = {
                  this.onMenuItem
                } > </MenuItem>, < MenuItem text = "Two" onClick = {
                  this.onMenuItem
                } > </MenuItem>, < MenuItem text = "Three" onClick = {
                  this.onMenuItem
                } > </MenuItem>
              ]}></SubMenu> < /MenuItem>, < MenuItem checked={true} text = "Developer" onClick = { this.onMenuItem } > </MenuItem >
            ]
          } > </Menu>
        ]}></MenuBar>
        <br></br>
        <SVGSurface store={this.state.store} ref="svgSurface" width={1000} height={16000}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(BootstrapPage);
