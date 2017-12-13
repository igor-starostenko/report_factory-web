import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { getProjects } from '../actions';

class Projects extends Component {
  componentDidMount() {
    this.props.getProjects(this.props.xApiKey);
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
  const { projects, xApiKey } = state;
  return { projects, xApiKey };
}

export default connect(mapStateToProps, { getProjects })(Projects);
