import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import _ from 'lodash';

class Navbar extends Component {
  renderAccount() {
    const userId = _.get(this.props.currentUser, 'data.id');
    let linkUrl = `/users/${userId}`;
    let linkText = 'Profile';
    if (_.isEmpty(this.props.xApiKey)) {
      if (_.isEmpty(Cookies.get('X-API-KEY'))) {
        linkUrl = '/login';
        linkText = 'Login';
      }
    }
    return (
      <li><Link to={linkUrl} className="btn btn-round btn-default">{linkText}</Link></li>
    );
  }

  render() {
    /* eslint-disable jsx-a11y/no-redundant-roles */
    return (
      <div id="navbar-full">
        <div id="navbar">
          <nav className="navbar navbar-ct-yellow navbar-fixed-top" role="navigation">
            <div className="container">
              <div className="navbar-header">
                <button
                  type="button"
                  className="navbar-toggle"
                  data-toggle="collapse"
                  data-target="#bs-example-navbar-collapse-1"
                >
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar" />
                  <span className="icon-bar" />
                  <span className="icon-bar" />
                </button>
                <Link to="/" className="navbar-brand">Report Factory</Link>
              </div>
              <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul className="nav navbar-nav">
                  <div className="line-separator" />
                  <li className="active navbar-link">
                    <Link to="/projects">Projects</Link>
                  </li>
                  <div className="line-separator" />
                  <li className="active navbar-link">
                    <Link to="/reports">Reports</Link>
                  </li>
                  <div className="line-separator" />
                  <li className="active navbar-link">
                    <Link to="/users">Users</Link>
                  </li>
                  <div className="line-separator" />
                </ul>
                <ul className="nav navbar-nav navbar-right">
                  {this.renderAccount()}
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    );
  }
  /* eslint-enable jsx-a11y/no-redundant-roles */
}

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, {})(Navbar);
