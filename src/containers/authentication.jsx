import React, { Component, Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import getValue from 'lodash/get';
import { Loading } from '../components';

export default ComonentRequiresAuthentication => {
  class Authentication extends Component {
    componentDidMount() {
      this.validateAuth();
    }

    componentDidUpdate() {
      this.validateAuth();
    }

    validateAuth() {
      const { authError, history } = this.props;
      if (authError) {
        history.push('/login');
      }
    }

    render() {
      const { userId, xApiKey } = this.props;
      return (
        <Fragment>
          {!userId || !xApiKey ? (
            <Loading type="grow" color="info" />
          ) : (
            <ComonentRequiresAuthentication {...this.props} />
          )}
        </Fragment>
      );
    }
  }

  Authentication.propTypes = {
    userId: PropTypes.string,
    authError: PropTypes.arrayOf(
      PropTypes.shape({
        details: PropTypes.string.isRequired,
      }).isRequired,
    ),
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
    {},
  )(Authentication);
};
