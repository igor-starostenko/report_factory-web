import React, { Component, Fragment } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Link } from 'react-router-dom';
import {
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Row,
} from 'reactstrap';
import { LinkButton } from '.';
import styles from './styles/Navigation.css';

const NavbarLinks = () => {
  return (
    <Fragment>
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
    </Fragment>
  );
};

const ProfileButton = props => {
  const { userId, ...rest } = props;

  return (
    <NavItem>
      <NavLink tag="div">
        {userId ? (
          <LinkButton
            className={styles.profileButton}
            to={`/users/${userId}`}
            {...rest}
          >
            Profile
          </LinkButton>
        ) : (
          <LinkButton className={styles.profileButton} to="/login" {...rest}>
            Login
          </LinkButton>
        )}
      </NavLink>
    </NavItem>
  );
};

const SideNav = props => {
  const { userId, className, ...rest } = props;

  return (
    <Nav className={`${styles.sideNav} ${className}`} vertical {...rest}>
      <NavbarLinks />
      <div className={styles.lineSeparator} />
      <ProfileButton userId={userId} block />
    </Nav>
  );
};

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
    const { userId } = this.props;

    return (
      <Navbar className={styles.yellow} dark expand="md">
        <NavbarBrand tag="div">
          <Link to="/">Report Factory</Link>
        </NavbarBrand>
        <NavbarToggler className={styles.navbarToggle} onClick={this.toggle} />
        <Row className={styles.desktopOnly}>
          <Nav className="mr-auto" navbar>
            <NavbarLinks />
          </Nav>
          <Nav className="ml-auto" navbar>
            <ProfileButton userId={userId} />
          </Nav>
        </Row>
        <CSSTransition
          in={this.state.isOpen}
          timeout={500}
          classNames="overlay"
          unmountOnExit
        >
          <div className={styles.overlay} />
        </CSSTransition>
        <CSSTransition
          in={this.state.isOpen}
          timeout={500}
          classNames="sideNav"
          unmountOnExit
        >
          <SideNav className={styles.yellow} userId={userId} />
        </CSSTransition>
      </Navbar>
    );
  }
}

export default Navigation;
