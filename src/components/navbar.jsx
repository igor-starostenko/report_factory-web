import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { getApiKey } from '../actions';

class Navbar extends Component {
  renderAccount() {
    const { currentUser, xApiKey, getApiKey } = this.props;
    let linkUrl = "/account";
    let linkText = "Account";
    if (_.isEmpty(xApiKey)) {
      if (!getApiKey(currentUser).xApiKey) {
        linkUrl = "/login";
        linkText = "Login";
      }
    }
    return (
      <li><Link to={linkUrl} className="btn btn-round btn-default">{linkText}</Link></li>
    )
  }

  render() {
    return(
      <div id="navbar-full">
        <div id="navbar">
          <nav className="navbar navbar-ct-yellow navbar-fixed-top" role="navigation">
            <div className="container">
              <div className="navbar-header">
                <Link to="/" className="navbar-brand">Report Factory</Link>
              </div>
              <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul className="nav navbar-nav">
                  <li className="active"><Link to="/projects">Projects</Link></li>
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
}

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  xApiKey: state.xApiKey,
});

export default connect(mapStateToProps, { getApiKey })(Navbar);
