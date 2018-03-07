import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import _ from 'lodash';
import { authUser, authSuccess, signInFailure, setApiKey } from '../actions/users_actions';

export default (ComposedComponent) => {
  class Authentication extends Component {
    constructor(props) {
      super(props);
      this.ensureApiKeyAvailable();
    }

    componentDidUpdate() {
      this.ensureApiKeyAvailable();
    }

    /* eslint-disable consistent-return */
    ensureApiKeyAvailable() {
      if (!_.get(this.props.user, 'data.id')) {
        let { xApiKey } = this.props;
        if (!xApiKey) {
          xApiKey = Cookies.get('X-API-KEY');
          if (!xApiKey) {
            return this.props.history.push('/login');
          }
          return this.props.setApiKey(xApiKey);
        }
        return this.props.authUser(xApiKey)
          .then((response) => {
            if (response.status !== 200) {
              this.props.signInFailure(response.payload);
              return this.props.history.push('/login');
            }
            return this.props.authSuccess(response.payload);
          });
      }
    }
    /* eslint-enable consistent-return */

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  const mapDispatchToProps = ({
    authUser, setApiKey, authSuccess, signInFailure,
  });

  const mapStateToProps = state => ({
    user: state.users.currentUser,
    xApiKey: state.users.currentUser.xApiKey,
  });

  return connect(mapStateToProps, mapDispatchToProps)(Authentication);
};
