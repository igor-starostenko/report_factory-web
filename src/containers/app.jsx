import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';
import Cookies from 'js-cookie';
import getValue from 'lodash/get';
import Navbar from '../components/navigation';
import {
  authUser,
  authSuccess,
  authFailure,
  setApiKey,
} from '../actions/users_actions';
import styles from './styles/App.css';

class App extends Component {
  componentDidMount() {
    this.validateAuth();
  }

  componentDidUpdate() {
    this.validateAuth();
  }

  validateAuth() {
    const { xApiKey: storeApiKey, userId } = this.props;
    const xApiKey = storeApiKey || Cookies.get('X-API-KEY');
    if (!xApiKey) {
      this.props.authFailure({ errors: [{ detail: 'Not authorized' }] });
    } else {
      if (!storeApiKey) {
        this.props.setApiKey(xApiKey);
      }
      if (!userId) {
        this.props.authUser(xApiKey).then(({ payload }) => {
          if (payload.status >= 400) {
            this.props.authFailure(payload);
          }
          return this.props.authSuccess(payload);
        });
      }
    }
  }

  render() {
    const { userId, children } = this.props;
    return (
      <Fragment>
        <Navbar userId={userId} />
        <Container className={styles.fadeIn}>{children}</Container>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userId: getValue(state.users.currentUser, 'data.id'),
  xApiKey: state.users.currentUser.xApiKey,
});

const mapDispatchToProps = {
  authUser,
  authSuccess,
  authFailure,
  setApiKey,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
