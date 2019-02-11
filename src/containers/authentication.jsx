import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import _ from 'lodash';
import {
  authUser,
  authSuccess,
  authFailure,
  setApiKey,
} from '../actions/users_actions';

export default ComposedComponent => {
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
        return this.props.authUser(xApiKey).then(({ payload }) => {
          if (payload.status >= 400) {
            this.props.authFailure(payload);
            return this.props.history.push('/login');
          }
          return this.props.authSuccess(payload);
        });
      }
    }
    /* eslint-enable consistent-return */

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  const mapDispatchToProps = dispatch => ({
    authUser: (...args) => dispatch(authUser(...args)),
    authSuccess: (...args) => dispatch(authSuccess(...args)),
    authFailure: (...args) => dispatch(authFailure(...args)),
    setApiKey: (...args) => dispatch(setApiKey(...args)),
  });

  const mapStateToProps = state => ({
    user: state.users.currentUser,
    xApiKey: state.users.currentUser.xApiKey,
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Authentication);
};
