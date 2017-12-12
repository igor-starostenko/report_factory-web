import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { getProjects } from '../actions';

class Projects extends Component {
  componentWillMount() {
    if (!this.getApiKey()) {
      this.props.history.push('/login');
    }
  }

  componentDidMount() {
    const xApiKey = this.getApiKey();
    this.props.getProjects(xApiKey);
  }

  componentWillUpdate() {
    if (!this.getApiKey()) {
      this.props.history.push('/login');
    }
  }

  getApiKey() {
    let xApiKey = Cookies.get('X-API-KEY');
    if (!xApiKey) {
      const { data } = this.props.currentUser;
      if (!data) {
        return this.props.history.push('/login');
      }
      xApiKey = data.attributes.api_key;
    }
    return xApiKey;
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
