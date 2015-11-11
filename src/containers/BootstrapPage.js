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
      loginVisible: false
    }
  }

  onCloseLogin = (e) => {
    this.setState({loginVisible: false});
  }

  showLogin = () => {
    this.setState({loginVisible: true});
  }

  onMenuItem = () => {
    console.log("Menu Clicked");
  }

  /*
   * build some fake data to test SVG rendering
   */
  fakeStore = () => {

    let f = []
  }

  render () {

    let login = this.state.loginVisible
      ? <PopupWindow onClose={this.onCloseLogin} title="Test Login Window" client={<Login onClose={this.onCloseLogin}></Login>}></PopupWindow>
      : null;

    // test color-js
    let c1 = new ColorJS('dodgerblue');
    let c2 = c1.darkenByRatio(0.5);

    let store = [
      {
        text: 'Root A',
        color: 'dodgerblue',
        x: 0,
        y: 0,
        children: [
          {
            text: 'L0-A',
            color: 'firebrick',
            children: [
              {
                text: 'L0-B',
                color: 'yellow',
                children: [
                  {
                    text: 'L0-C',
                    color: 'purple',
                    children: [
                      {
                        text: 'PChild-1',
                        color: 'cyan'
                      },
                      {
                        text: 'Pchild-2',
                        color: 'green'
                      }
                    ]
                  }
                ]
              }, {
                text: 'L1-B',
                color: 'orange',
                children: [
                  {
                    text: 'L2-C',
                    color: 'orchid'
                  }, {
                    text: 'ABC',
                    color: 'lightgreen'
                  }, {
                    text: 'XYZ',
                    color: 'goldenrod'
                  }
                ]
              }, {
                text: 'L2-B',
                color: 'peru',
                children: [
                  {
                    text: 'peru-c1',
                    color: 'darkseagreen',
                    children: [
                      {
                        text: 'peru-c2',
                        color: 'orange'
                      },
                      {
                        text: 'peru-c3',
                        color: 'chocolate'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        text: 'Root B',
        color: 'dodgerblue',
        x: 0,
        y: 0,
        children: [
          {
            text: 'L0-A',
            color: 'firebrick',
            children: [
              {
                text: 'L0-B',
                color: 'yellow',
                children: [
                  {
                    text: 'L0-C',
                    color: 'purple',
                    children: [
                      {
                        text: 'PChild-1',
                        color: 'cyan'
                      },
                      {
                        text: 'Pchild-2',
                        color: 'green'
                      }
                    ]
                  }
                ]
              }, {
                text: 'L1-B',
                color: 'orange',
                children: [
                  {
                    text: 'L2-C',
                    color: 'orchid'
                  }, {
                    text: 'ABC',
                    color: 'lightgreen'
                  }, {
                    text: 'XYZ',
                    color: 'goldenrod'
                  }
                ]
              }, {
                text: 'L2-B',
                color: 'peru',
                children: [
                  {
                    text: 'peru-c1',
                    color: 'darkseagreen'
                  }
                ]
              }
            ]
          }
        ]
      }
    ];

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
                <MenuItem text="One" onClick={this.onMenuItem}></MenuItem>,
                <MenuItem text="Two" onClick={this.onMenuItem}></MenuItem>,
                <MenuItem text="Three" onClick={this.onMenuItem}></MenuItem>
                ]}></SubMenu>

             </MenuItem>, < MenuItem checked={true} text = "Developer" onClick = {
                this.onMenuItem
              } > </MenuItem>
            ]
          } > </Menu>
        ]}></MenuBar>
        <br></br>
        <SVGSurface store={store} ref="svgSurface" width={1000} height={600}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(BootstrapPage);
