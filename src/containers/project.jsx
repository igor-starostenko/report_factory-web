import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, ProjectScenarios, ReportsLineChart } from '../components';
import _ from 'lodash';
import { getProject, queryProject, resetProject } from '../actions/projects_actions';
import { getProjectReports, setProjectReportsName, getProjectReportsSuccess,
  getProjectReportsFailure } from '../actions/project_reports_actions';
import { getProjectScenarios } from '../actions/scenarios_actions';
import { formatTotalString } from '../helpers/format_helpers';
import styles from './styles/Details.css';

class Project extends Component {
  componentDidMount() {
    const { xApiKey, projectName } = this.props;
    if (!this.props.projects[projectName]) {
      this.props.queryProject(projectName, xApiKey);
    }
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

    const reportsData = _.get(this.props.reports, 'data');
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
          <div className={styles.detailsTotal}>{formatTotalString(reportsData)}</div>
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
  queryProject,
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
  projects: state.projects.list.data,
  reports: state.projectReports.reportsList[ownProps.match.params.name],
  scenarios: state.scenarios.byProject.data[ownProps.match.params.name],
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, mapDispatchToProps)(Project);
