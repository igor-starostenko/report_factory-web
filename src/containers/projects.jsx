import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { ProjectSelection } from '../components';
import { queryProjects } from '../actions/projects_actions';
import styles from './styles/Projects.css';

class Projects extends Component {
  componentDidMount() {
    this.props.queryProjects(this.props.xApiKey);
  }

  renderProjects() {
    const { data: projects } = this.props.projectsList;

    return Object.keys(projects).map((projectName) => {
      const projectPath = `/projects/${projectName}`;
      return (
        <ProjectSelection
          key={projectName}
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
    if (!this.props.projectsList.loaded) {
      return (<div className="loading">Loading...</div>);
    }

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
  projectsList: state.projects.projectsList,
  isAdmin: _.get(state.users.currentUser, 'data.attributes.type') === 'Admin',
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, { queryProjects })(Projects);
