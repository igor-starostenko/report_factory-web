import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, ScenariosList } from '../components';
import _ from 'lodash';
import ReportsLineChart from './reports_line_chart';
import { getProject, resetProject } from '../actions/projects_actions';
import { getProjectScenarios } from '../actions/project_scenarios_actions';
import { formatDate } from '../helpers/format_helpers';
import styles from './styles/Details.css';

class Project extends Component {
  componentDidMount() {
    const { xApiKey, projectName, project, scenarios } = this.props;
    if (!project.data) {
      this.props.getProject(projectName, xApiKey);
    }
    if (!scenarios || _.isEmpty(scenarios)) {
      this.props.getProjectScenarios(projectName, xApiKey);
    }
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
            <ReportsLineChart projectName={projectName} />
          </div>
          <div className={styles.detailsExtraContent}>
            <div className={styles.detailsSubHeader}>Scenarios:</div>
            <ScenariosList scenarios={this.props.scenarios} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  projectName: ownProps.match.params.name,
  project: state.projects.activeProject,
  scenarios: state.projectScenarios.scenariosList.data[ownProps.match.params.name],
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, { getProject, getProjectScenarios, resetProject })(Project);
