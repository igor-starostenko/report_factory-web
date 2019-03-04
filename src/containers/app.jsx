import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import _ from 'lodash';
import Navbar from '../components/navigation';

class App extends Component {
  isLoggedIn() {
    const xApiKey = this.props.xApiKey || Cookies.get('X-API-KEY');
    return !_.isEmpty(xApiKey);
  }

  render() {
    const userId = _.get(this.props.currentUser, 'data.id');

    return (
      <div>
        <Navbar isLoggedIn={this.isLoggedIn()} userId={userId} />
        <div className="container">{this.props.children}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(
  mapStateToProps,
  {},
)(App);
