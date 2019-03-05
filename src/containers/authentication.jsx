import React, { Component, Fragment } from 'react';
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
