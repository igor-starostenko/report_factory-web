import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { ProjectSelection } from '../components';
import { getProjects } from '../actions/projects_actions';
import styles from './styles/Projects.css';

class Projects extends Component {
  componentDidMount() {
    this.props.getProjects(this.props.xApiKey);
  }

  renderProjects() {
    return _.map(this.props.projects, (project) => {
      const projectName = project.attributes.project_name;
      const projectDescription = project.attributes.project_description;
      const projectPath = `/projects/${projectName}`;
      return (
        <ProjectSelection
          description={projectDescription}
          key={project.id}
          path={projectPath}
          title={projectName}
        />
      );
    });
  }

  renderNewProject() {
    if (this.props.isAdmin) {
      return (
        <ProjectSelection
          newProject={true}
          path="/project/new"
          title="Create a project"
        />
      );
    }
    return (<div />);
  }

  render() {
    return (
      <div>
        <br />
        <h1>Projects</h1>
        <div className={styles.projectsContainer}>
          {this.renderProjects()}
          {this.renderNewProject()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  projects: state.projects.projectsList.data,
  isAdmin: _.get(state.users.currentUser, 'data.attributes.type') === 'Admin',
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, { getProjects })(Projects);
