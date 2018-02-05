import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getApiKey } from '../actions/users_actions';

export default (ComposedComponent) => {
  class Authentication extends Component {
    componentWillMount() {
      this.ensureApiKeyAvailable();
    }

    componentWillUpdate() {
      this.ensureApiKeyAvailable();
    }

    /* eslint-disable consistent-return */
    ensureApiKeyAvailable() {
      if (!this.props.xApiKey) {
        const { currentUser } = this.props;
        if (!this.props.getApiKey(currentUser).payload) {
          return this.props.history.push('/login');
        }
      }
    }
    /* eslint-enable consistent-return */

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    currentUser: state.users.currentUser,
    xApiKey: state.users.currentUser.xApiKey,
  });

  return connect(mapStateToProps, { getApiKey })(Authentication);
};
