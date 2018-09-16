import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, ProjectScenarios, ReportsLineChart } from '../components';
import { queryProject, setProjectFilters } from '../actions/projects_actions';
import { queryScenario } from '../actions/scenarios_actions';
import { formatTotalReports } from '../helpers/format_helpers';
import styles from './styles/Details.css';

class Project extends Component {
  constructor(props) {
    super(props);
    this.queryProject = this.queryProject.bind(this);
  }

  componentDidMount() {
    if (!this.props.project) {
      this.queryProject(this.getFilters())
    }
  }

  getFilters() {
    const { filters } = this.props;
    if (!this.props.filters) {
      return { filterName: 'Week', lastDays: 8 }
    }
    return this.props.filters;
  }

  queryProject({ filterName, lastDays, lastMonths }) {
    const { xApiKey, projectName } = this.props;
    this.props.setProjectFilters(projectName, { filterName, lastDays, lastMonths });
    this.props.queryProject(xApiKey, { projectName, lastDays, lastMonths });
  }

  render() {
    const { project, filters, projectName } = this.props;

    if (!project) {
      return (<div className="loading">Loading...</div>);
    }

    const rspecUrl = `${this.props.match.url}/rspec`;
    const editUrl = `${this.props.match.url}/edit`;
    const totalCountText = formatTotalReports(project.reportsCount);

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
          <div className={styles.detailsTotal}>{totalCountText}</div>
          <div className={styles.detailsContent}>
            <ReportsLineChart
              filterAction={this.queryProject}
              filters={this.getFilters()}
              reports={project.reports}
              totalCount={project.reportsCount}
            />
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
  setProjectFilters,
  queryScenario,
};

const mapStateToProps = (state, ownProps) => ({
  projectName: ownProps.match.params.name,
  project: state.projects.details.data[ownProps.match.params.name],
  filters: state.projects.details.filters[ownProps.match.params.name],
  scenariosDetails: state.scenarios.details.data,
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, mapDispatchToProps)(Project);
