import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import { getProjects } from '../actions';

class Projects extends Component {
  componentDidMount() {
    this.waitForApiKey(this.props.getProjects);
  }

  waitForApiKey(callback, times = 10) {
    const xApiKey = Cookies.get('X-API-KEY');
    if (!xApiKey) {
      const remaining = times - 1;
      if (times === 0) {
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
    if (this.props.error) {
      return this.props.history.push('/login');
    }

    return (
      <div>
        <h1>Projects</h1>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { projects: state.projects };
}

export default connect(mapStateToProps, { getProjects })(Projects);
