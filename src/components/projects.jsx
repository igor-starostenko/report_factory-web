import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
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
        <Link to={projectPath} className={styles.project} key={project.id}>
          <div className={styles.projectBody}>
            <div className={styles.projectTitle}>{projectName}</div>
            <p className={styles.projectText}>{projectDescription}</p>
          </div>
        </Link>
      );
    });
  }

  render() {
    return (
      <div>
        <br />
        <h1>Projects</h1>
        <div className={styles.projectsContainer}>
          {this.renderProjects()}
          <Link to="/project/new" className={`${styles.project} ${styles.newProject}`}>
            <div className={styles.projectBody}>
              <div className={styles.newProjectTitle}>Create a project</div>
            </div>
          </Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  projects: state.projects.projectsList.data,
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, { getProjects })(Projects);
