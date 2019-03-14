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

function App(props) {
  const { xApiKey: storeApiKey, userId, loading, children } = props;
  const xApiKey = storeApiKey || Cookies.get('X-API-KEY');

  useEffect(() => {
    if (xApiKey) {
      if (!storeApiKey) {
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
    }
  }, [storeApiKey, userId]);

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
  children: PropTypes.element.isRequired,
  authUser: PropTypes.func.isRequired,
  authFailure: PropTypes.func.isRequired,
  authSuccess: PropTypes.func.isRequired,
  setApiKey: PropTypes.func.isRequired,
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
