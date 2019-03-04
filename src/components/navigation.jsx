import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import { LinkButton } from '.';
import styles from './styles/Navigation.css';

class Navigation extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = { isOpen: false };
  }

  toggle() {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  render() {
    const { isLoggedIn, userId } = this.props;

    return (
      <div>
        <Navbar className={styles.navbarYellow} dark expand="md">
          <NavbarBrand tag="div">
            <Link to="/">Report Factory</Link>
          </NavbarBrand>
          <NavbarToggler
            className={styles.navbarToggle}
            onClick={this.toggle}
          />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink tag="div">
                  <Link to="/projects">Projects</Link>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag="div">
                  <Link to="/reports">Reports</Link>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag="div">
                  <Link to="/scenarios">Scenarios</Link>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag="div">
                  <Link to="/users">Users</Link>
                </NavLink>
              </NavItem>
            </Nav>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink tag="div">
                  {isLoggedIn && userId ? (
                    <LinkButton
                      className={styles.profileButton}
                      to={`/users/${userId}`}
                    >
                      Profile
                    </LinkButton>
                  ) : (
                    <LinkButton className={styles.profileButton} to="/login">
                      Login
                    </LinkButton>
                  )}
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default Navigation;
