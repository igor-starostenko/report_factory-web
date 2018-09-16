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
    const { projects, projectName } = this.props;
    if (!projects[projectName]) {
      this.queryProject(this.getFilters())
    }
  }

  getFilters() {
    const { filters, projectName } = this.props;
    if (!filters[projectName]) {
      return { filterName: 'Week', lastDays: 8 }
    }
    return filters[projectName];
  }

  queryProject({ filterName, lastDays, lastMonths }) {
    const { xApiKey, projectName } = this.props;
    this.props.setProjectFilters(projectName, { filterName, lastDays, lastMonths });
    this.props.queryProject(xApiKey, { projectName, lastDays, lastMonths });
  }

  render() {
    const { projects, filters, projectName } = this.props;
    const project = projects[projectName];

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
  projects: state.projects.list.data,
  filters: state.projects.filters,
  scenariosDetails: state.scenarios.details.data,
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, mapDispatchToProps)(Project);
