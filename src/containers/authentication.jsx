import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import getValue from 'lodash/get';
import { Loading } from '../components';

export default ComonentRequiresAuthentication => {
  class Authentication extends Component {
    constructor(props) {
      super(props);
      this.validateUser();
    }

    componentDidUpdate() {
      this.validateUser();
    }

    validateUser() {
      const { error, history } = this.props;
      if (error) {
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
            <ComonentRequiresAuthentication userId={userId} xApiKey={xApiKey} />
          )}
        </Fragment>
      );
    }
  }

  const mapStateToProps = state => ({
    userId: getValue(state.users.currentUser, 'data.id'),
    error: state.users.currentUser.error,
    xApiKey: state.users.currentUser.xApiKey,
  });

  return connect(
    mapStateToProps,
    {},
  )(Authentication);
};
