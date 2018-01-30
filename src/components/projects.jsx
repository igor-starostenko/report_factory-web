import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { getProjects } from '../actions/projects_actions';

class Projects extends Component {
  componentDidMount() {
    const { xApiKey } = this.props;
    if (xApiKey) {
      this.props.getProjects(xApiKey);
    }
  }

  renderProjects() {
    const { projectsList } = this.props.projects;

    if (!projectsList) {
      return (<div>Loading</div>);
    }

    return _.map(projectsList.data, project => {
      const projectName = project.attributes.project_name;
      const projectDescription = project.attributes.project_description;
      const projectPath = `/projects/${projectName}`;
      return (
        <Link to={projectPath} className="project" key={project.id}>
          <div className="project-body">
            <div className="project-title">{projectName}</div>
            <p className="project-text">{projectDescription}</p>
          </div>
        </Link>
      );
    });
  }

  render() {
    return (
      <div>
        <h1>Projects</h1>
        <div className="projects-container">
          {this.renderProjects()}
          <Link to="/project/new" className="new-project project">
            <div className="project-body">
              <div className="new-project-title">Create a project</div>
            </div>
          </Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  projects: state.projects,
  xApiKey: state.xApiKey,
});

export default connect(mapStateToProps, { getProjects })(Projects);
