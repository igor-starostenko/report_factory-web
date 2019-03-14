import React, { Fragment, useEffect } from 'react';
import { PropTypes } from 'prop-types';
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

const nonRestrictedPath = ['/', '/login'];

function App(props) {
  const { xApiKey: storeApiKey, history, userId, loading, children } = props;
  const xApiKey = storeApiKey || Cookies.get('X-API-KEY');

  useEffect(() => {
    if (!xApiKey) {
      if (!nonRestrictedPath.includes(history.location.pathname)) {
        props.authFailure({ errors: [{ detail: 'Not authorized' }] });
      }
    } else if (!storeApiKey) {
      props.setApiKey(xApiKey);
    } else if (!userId && !loading) {
      props.authUser(xApiKey).then(({ payload }) => {
        if (payload.status >= 400) {
          props.authFailure(payload);
        } else {
          props.authSuccess(payload);
        }
      });
    }
  });

  return (
    <Fragment>
      <Navbar userId={userId} />
      <Container className={styles.main}>{children}</Container>
    </Fragment>
  );
}

App.propTypes = {
  xApiKey: PropTypes.string,
  userId: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  children: PropTypes.element.isRequired,
  authUser: PropTypes.func.isRequired,
  authFailure: PropTypes.func.isRequired,
  authSuccess: PropTypes.func.isRequired,
  setApiKey: PropTypes.func.isRequired,
};

App.defaultProps = {
  xApiKey: '',
  userId: '',
};

const mapStateToProps = state => ({
  userId: getValue(state.users.currentUser, 'data.id'),
  loading: state.users.currentUser.loading,
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
