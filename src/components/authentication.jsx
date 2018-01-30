import React, { Component } from 'react';
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
