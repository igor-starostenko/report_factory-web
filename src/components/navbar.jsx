import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';

class Navbar extends Component {
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
                <ul class="nav navbar-nav navbar-right">
                  <li><Link to="/account" className="btn btn-round btn-default">Account</Link></li>
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
  xApiKey: state.xApiKey,
});

export default connect(mapStateToProps, {})(Navbar);
