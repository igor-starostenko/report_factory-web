import React, { Fragment, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import {
  Button,
  Loading,
  ProjectScenarios,
  ReportsLineChart,
} from '../components';
import { queryProject, setProjectFilters } from '../actions/projects_actions';
import { queryScenario } from '../actions/scenarios_actions';
import { formatTotalReports } from '../helpers/format_helpers';
import styles from './styles/Details.css';

function Project(props) {
  const { project, projectName, filters, xApiKey, scenariosDetails } = props;

  function filterProject({ filterName, lastDays, lastMonths }) {
    props.setProjectFilters(projectName, {
      filterName,
      lastDays,
      lastMonths,
    });
    props.queryProject(xApiKey, { projectName, lastDays, lastMonths });
  }

  useEffect(() => {
    filterProject(filters);
  }, projectName);

  if (isEmpty(project)) {
    return <Loading />;
  }

  const rspecUrl = `${props.match.url}/rspec`;
  const editUrl = `${props.match.url}/edit`;
  const totalCountText = formatTotalReports(project.reportsCount);

  return (
    <Fragment>
      <Link to="/projects">Back to projects</Link>
      <div className={styles.detailsContainer}>
        <div className={styles.detailsHeader}>
          <div className={styles.detailsName}>{projectName}</div>
        </div>
        <div className={styles.detailsButtons}>
          <Button to={rspecUrl} color="primary" fill="true">
            View Reports
          </Button>
          <Button to={editUrl} color="warning" fill="true">
            Edit Project
          </Button>
        </div>
        <div className={styles.detailsTotal}>{totalCountText}</div>
        <div className={styles.detailsContent}>
          <ReportsLineChart
            filterAction={filterProject}
            filters={filters}
            reports={project.reports}
            totalCount={project.reportsCount}
          />
        </div>
        <div className={styles.detailsExtraContent}>
          <ProjectScenarios
            scenariosList={project.scenarios}
            scenariosDetails={scenariosDetails}
            xApiKey={xApiKey}
            queryScenario={props.queryScenario}
          />
        </div>
      </div>
    </Fragment>
  );
}

Project.propTypes = {
  project: PropTypes.shape({
    reports: PropTypes.arrayOf(PropTypes.object),
    reportsCount: PropTypes.number,
    scenarios: PropTypes.arrayOf(PropTypes.object),
  }),
  scenariosDetails: PropTypes.shape({}).isRequired,
  projectName: PropTypes.string.isRequired,
  filters: PropTypes.shape({
    filterName: PropTypes.string.isRequired,
    lastDays: PropTypes.number,
    lastMonths: PropTypes.number,
  }),
  xApiKey: PropTypes.string.isRequired,
  setProjectFilters: PropTypes.func.isRequired,
  queryProject: PropTypes.func.isRequired,
  queryScenario: PropTypes.func.isRequired,
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
};

Project.defaultProps = {
  project: {},
  filters: { filterName: 'Week', lastDays: 8 },
};

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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Project);
