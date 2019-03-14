import React, { Fragment, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import getValue from 'lodash/get';
import { Loading } from '../components';
import { authFailure } from '../actions/users_actions';

export default ComonentRequiresAuthentication => {
  function Authentication(props) {
    const { authError, history, userId, xApiKey } = props;

    useEffect(() => {
      if (!xApiKey || authError) {
        props.authFailure({ errors: [{ detail: 'Not authorized' }] });
        history.push('/login');
      }
    });

    return (
      <Fragment>
        {!userId || !xApiKey ? (
          <Loading type="grow" color="info" />
        ) : (
          <ComonentRequiresAuthentication {...props} />
        )}
      </Fragment>
    );
  }

  Authentication.propTypes = {
    authError: PropTypes.arrayOf(
      PropTypes.shape({
        details: PropTypes.string,
      }).isRequired,
    ),
    authFailure: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    userId: PropTypes.string,
    xApiKey: PropTypes.string,
  };

  Authentication.defaultProps = {
    userId: null,
    authError: null,
    xApiKey: null,
  };

  const mapStateToProps = state => ({
    userId: getValue(state.users.currentUser, 'data.id'),
    authError: state.users.currentUser.error,
    xApiKey: state.users.currentUser.xApiKey,
  });

  return connect(
    mapStateToProps,
    { authFailure },
  )(Authentication);
};
