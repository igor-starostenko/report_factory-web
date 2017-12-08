import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { getProjects } from '../actions';

class Projects extends Component {
  componentDidMount() {
    const { cookies } = this.props;
    const xApiKey = cookies.get('X-API-KEY');
    this.props.getProjects(xApiKey);
  }

  render() {
    console.log(this.props.projects);
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
