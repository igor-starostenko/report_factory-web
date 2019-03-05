import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';
import Cookies from 'js-cookie';
import getValue from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import Navbar from '../components/navigation';

class App extends Component {
  isLoggedIn() {
    const xApiKey = this.props.xApiKey || Cookies.get('X-API-KEY');
    return !isEmpty(xApiKey);
  }

  render() {
    const userId = getValue(this.props.currentUser, 'data.id');

    return (
      <Fragment>
        <Navbar isLoggedIn={this.isLoggedIn()} userId={userId} />
        <Container>{this.props.children}</Container>
      </Fragment>
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
