import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, ProjectScenarios, ReportsLineChart } from '../components';
import _ from 'lodash';
import { queryProject } from '../actions/projects_actions';
import { queryScenario } from '../actions/scenarios_actions';
import { formatTotalString } from '../helpers/format_helpers';
import styles from './styles/Details.css';

class Project extends Component {
  componentDidMount() {
    const { xApiKey, projectName } = this.props;
    if (!this.props.projects[projectName]) {
      this.props.queryProject(projectName, xApiKey);
    }
  }

  render() {
    const { projects, projectName } = this.props;
    const project = projects[projectName];

    if (!project) {
      return (<div className="loading">Loading...</div>);
    }

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
          <div className={styles.detailsTotal}>{formatTotalString(project.reports)}</div>
          <div className={styles.detailsContent}>
            <ReportsLineChart reports={project.reports} />
          </div>
          <div className={styles.detailsExtraContent}>
            <ProjectScenarios
              scenariosList={project.scenarios}
              scenariosDetails={this.props.scenariosDetails}
              xApiKey={this.props.xApiKey}
              queryScenario={this.props.queryScenario}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  queryProject,
  queryScenario,
};

const mapStateToProps = (state, ownProps) => ({
  projectName: ownProps.match.params.name,
  projects: state.projects.list.data,
  scenariosDetails: state.scenarios.details.data,
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, mapDispatchToProps)(Project);
