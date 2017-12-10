import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { getProjects } from '../actions';

class Projects extends Component {
  componentDidMount() {
    this.waitForProjects();
  }

  getApiKey() {
    return this.props.cookies.get('X-API-KEY');
  }

  waitForProjects(times = 10) {
    const xApiKey = this.getApiKey();
    if (!xApiKey) {
      const remaining = times - 1;
      if (times === 0) {
        throw new Error('X-API-KEY undefined');
      }
      setTimeout(() => { this.waitForProjects(remaining); }, 100);
    } else {
      this.props.getProjects(xApiKey);
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

export default connect(mapStateToProps, { getProjects })(withCookies(Projects));
