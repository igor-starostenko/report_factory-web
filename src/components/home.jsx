import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { getApiKey } from '../actions/users_actions';

class Home extends Component {
  renderLogin() {
    const { currentUser, xApiKey, getApiKey } = this.props;
    if (_.isEmpty(xApiKey)) {
      if (getApiKey(currentUser).xApiKey) {
        return (
          <Link to="/login" className="btn btn-lg btn-info btn-fill">Login</Link>
        )
      }
    }
  }

  render() {
    return (
      <div className="text-center">
        <h1>Welcome to ReportFactory</h1>
        <img src="/style/assets/img/rf-apple-icon.png" alt="Report Factory Gears" title="Report Factory Gears"></img>
        <p>
          See <a href="https://github.com/igor-starostenko/report_factory-web">github</a> for more info.
        </p>
        {this.renderLogin()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  xApiKey: state.xApiKey,
});

export default connect(mapStateToProps, { getApiKey })(Home);
