import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import { authUser, setApiKey } from '../actions/users_actions';

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
        const xApiKey = Cookies.get('X-API-KEY');
        if (!xApiKey) {
          return this.props.history.push('/login');
        }
        this.props.setApiKey(xApiKey);
        return this.props.authUser(xApiKey);
      }
    }
    /* eslint-enable consistent-return */

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    xApiKey: state.users.currentUser.xApiKey,
  });

  return connect(mapStateToProps, { authUser, setApiKey })(Authentication);
};
