import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { getProjects } from '../actions';

class Projects extends Component {
  // componentWillMount() {
  //   if (!this.props.currentUser.type) {
  //     this.props.history.push('/login');
  //   }
  // }

  componentDidMount() {
    this.waitForApiKey(this.props.getProjects);
  }

  // componentWillUpdate() {
  //   if (!this.props.currentUser.type) {
  //     this.props.history.push('/login');
  //   }
  // }

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

  renderProjects() {
    return _.map(this.props.projects, (project) => {
      const projectPath = `/projects/${project.id}`;
      const projectName = project.attributes.project_name;
      return (
        <button className="list-group-item" key={project.id}>
          <Link to={projectPath}>{projectName}</Link>
        </button>
      );
    });
  }

  render() {
    return (
      <div>
        <h1>Projects</h1>
        <div>
          <ul className="list-group">
            {this.renderProjects()}
          </ul>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { currentUser: state.currentUser, projects: state.projects };
}

export default connect(mapStateToProps, { getProjects })(Projects);
