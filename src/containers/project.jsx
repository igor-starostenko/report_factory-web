import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, ProjectScenarios, ReportsLineChart } from '../components';
import _ from 'lodash';
import { getProject, resetProject } from '../actions/projects_actions';
import { getProjectReports, setProjectReportsName, getProjectReportsSuccess,
  getProjectReportsFailure } from '../actions/project_reports_actions';
import { getProjectScenarios } from '../actions/project_scenarios_actions';
import { formatDate } from '../helpers/format_helpers';
import styles from './styles/Details.css';

class Project extends Component {
  componentDidMount() {
    const { xApiKey, projectName } = this.props;
    if (!this.props.project.data) {
      this.props.getProject(projectName, xApiKey);
    }
    if (!this.props.reports || _.isEmpty(this.props.reports)) {
      this.fetchProjectReports();
    }
    if (!this.props.scenarios || _.isEmpty(this.props.scenarios)) {
      this.props.getProjectScenarios(projectName, xApiKey);
    }
  }

  fetchProjectReports() {
    const { xApiKey, projectName } = this.props;
    this.props.setProjectReportsName(projectName);
    getProjectReports(projectName, xApiKey)
      .then((response) => {
        if (response.status !== 200) {
          return this.props.getProjectReportsFailure(response);
        }
        return this.props.getProjectReportsSuccess(response);
      });
  }

  render() {
    const { project, projectName } = this.props;

    if (!project.data) {
      return (<div className="loading">Loading...</div>);
    }

    const { date } = project.data.attributes;
    const createdAt = new Date(date.created_at);

    const rspecUrl = `${this.props.match.url}/rspec`;
    const editUrl = `${this.props.match.url}/edit`;

    return (
      <div>
        <Link to="/projects">Back to projects</Link>
        <div className={styles.detailsContainer}>
          <div className={styles.detailsHeader}>
            <div className={styles.detailsName}>{projectName}</div>
          </div>
          <div className={styles.detailsButtons}>
            <Button to={rspecUrl} color="primary" fill="true" text="View Reports" />
            <Button to={editUrl} color="warning" fill="true" text="Edit Project" />
          </div>
          <div className={styles.detailsSince}>since {formatDate(createdAt)}</div>
          <div className={styles.detailsContent}>
            <ReportsLineChart reports={this.props.reports} />
          </div>
          <div className={styles.detailsExtraContent}>
            <ProjectScenarios scenariosList={this.props.scenarios} />
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  getProject,
  resetProject,
  setProjectReportsName,
  getProjectReportsSuccess,
  getProjectReportsFailure,
  getProjectScenarios,
};

const mapStateToProps = (state, ownProps) => ({
  projectName: ownProps.match.params.name,
  project: state.projects.activeProject,
  reports: state.projectReports.reportsList[ownProps.match.params.name],
  scenarios: state.projectScenarios.scenariosList.data[ownProps.match.params.name],
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, mapDispatchToProps)(Project);
