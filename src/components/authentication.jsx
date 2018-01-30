import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import { getApiKey } from '../actions/users_actions';
import _ from 'lodash';

export default (ComposedComponent) => {
  class Authentication extends Component {
    componentWillMount() {
      this.ensureApiKeyAvailable();
    }

    componentWillUpdate() {
      this.ensureApiKeyAvailable();
    }

    ensureApiKeyAvailable() {
      if (!this.props.xApiKey) {
        const { currentUser, getApiKey } = this.props;
        if (getApiKey(currentUser).xApiKey) {
          return this.props.history.push('/login');
        }

      // if (!this.props.xApiKey) {
      //   this.props.dispatch(getApiKey(xApiKey))
      //     .then(response => {
      //       if(!response.payload.data) {
      //         return this.props.history.push('/login');
      //       }
      //     });
      }
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    currentUser: state.users.currentUser,
    xApiKey: state.xApiKey,
  });

  return connect(mapStateToProps, { getApiKey })(Authentication);
};
