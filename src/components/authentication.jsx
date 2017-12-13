import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { connect } from 'react-redux';
import { getApiKey } from '../actions';

export default (ComposedComponent) => {
  class Authentication extends Component {
    componentWillMount() {
      this.ensureApiKeyAvailable();
    }

    componentWillUpdate() {
      this.ensureApiKeyAvailable();
    }

    ensureApiKeyAvailable() {
      const { currentUser } = this.props;
      if (!this.props.getApiKey(currentUser).xApiKey) {
        this.props.history.push('/login');
      }
    }

    waitForApiKey(callback, times = 10) {
      const xApiKey = Cookies.get('X-API-KEY');
      if (!xApiKey) {
        const remaining = times - 1;
        if (times === 0) {
          this.props.history.push('/login');
          throw new Error('X-API-KEY undefined');
        }
        setTimeout(() => {
          this.waitForApiKey(callback, remaining);
        }, 150);
      } else {
        callback(xApiKey);
      }
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    currentUser: state.currentUser,
    xApiKey: state.xApiKey,
  });

  return connect(mapStateToProps, { getApiKey })(Authentication);
};
