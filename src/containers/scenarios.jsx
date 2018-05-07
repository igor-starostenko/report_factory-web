import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { CollapsibleItem, PerPageFilter, Pagination,
   ScenarioSuccessChart, SearchScenarios } from '../components';
import { capitalizeFirstLetter, formatDuration, formatDateAgo } from '../helpers/format_helpers';
import { getAllScenarios } from '../actions/project_scenarios_actions';
import styles from '../components/styles/ScenariosList.css';

const statusName = (status) => {
  if (status === 'failed') {
    return 'failedScenario';
  } else if (status === 'passed') {
    return 'passedScenario';
  }
  return 'pendingScenario';
};

const dateAgoString = (dateString) => {
  if (!dateString) {
    return 'Never';
  }
  return `${formatDateAgo(new Date(dateString))} ago`;
}

const numberOfExamples = (number) => {
  if (!number || number === 0) {
    return `No examples`;
  } else if (number === 1) {
    return '1 example';
  }
  return `${number} examples`;
}

class Scenarios extends Component {
  static renderScenarioTexDetails(details) {
    return _.map(details, (value, key) => (
      <div className={styles.scenarioDetailsRow} key={key}>
        <div className={styles.scenarioDetailsParam}>{key}:</div>
        <div className={styles.scenarioDetailsValue}>{value}</div>
      </div>
    ));
  }

  static renderScenarioDetails(scenario) {
    const firstColumnDetails = {
      'Total Runs': scenario.total_runs,
      'Passed': numberOfExamples(scenario.total_passed),
      'Failed': numberOfExamples(scenario.total_failed),
      'Pending': numberOfExamples(scenario.total_pending),
    };
    const secondColumnDetails = {
      'Status': capitalizeFirstLetter(scenario.last_status),
      'Last Run': dateAgoString(scenario.last_run),
      'Last Passed': dateAgoString(scenario.last_passed),
      'Last Failed': dateAgoString(scenario.last_failed),
    };
    return (
      <div className={styles.scenarioExtendedDetails}>
        <div className={styles.scenarioSuccessChart}>
          <ScenarioSuccessChart scenario={scenario} />
        </div>
        <div className={styles.scenarioPrimaryDetails}>
          {this.renderScenarioTexDetails(firstColumnDetails)}
        </div>
        <div className={styles.scenarioSecondaryDetails}>
          {this.renderScenarioTexDetails(secondColumnDetails)}
        </div>
      </div>
    );
  }

  constructor(state) {
    super(state);
    this.state = { page: 1, perPage: 10, search: [] };
    this.setPage = this.setPage.bind(this);
    this.setPerPage = this.setPerPage.bind(this);
    this.setSearch = this.setSearch.bind(this);
  }

  componentDidMount() {
    const { xApiKey, scenarios } = this.props;
    this.props.getAllScenarios(xApiKey);
  }

  setPage({ page }) {
    this.setState({ page });
  }

  setPerPage({ perPage }) {
    let newState;
    const totalPages = _.ceil(this.filterScenarios().length / perPage);
    if (totalPages < this.state.page) {
      return this.setState({ page: totalPages, perPage });
    }
    this.setState({ perPage });
  }

  setSearch({ search }) {
    this.setState({ search });
  }

  slicePageScenarios(scenarios) {
    const startIndex = this.state.page * this.state.perPage - this.state.perPage;
    const endIndex = startIndex + this.state.perPage;
    return scenarios.slice(startIndex, endIndex);
  }

  filterScenarios() {
    return _.filter(this.props.scenarios.examples, (scenario) => {
       return _.every(this.state.search, (word) => {
         const scenarioName = scenario.name.toLowerCase();
         return scenarioName.indexOf(word.toLowerCase()) !== -1;
       });
    });
  }

  fetchTotalCount() {
    return this.props.scenarios.total_count;
  }

  renderScenarios(scenarios) {
    if (_.isEmpty(scenarios)) {
      return (<div className="loading">No scenarios found</div>);
    }
    let childKey = 0;
    return _.map(this.slicePageScenarios(scenarios), (scenario) => {
      childKey += 1;
      const status = statusName(scenario.last_status);
      return (
        <CollapsibleItem
          className={`${styles.scenario} ${styles[status]}`}
          title={scenario.name}
          details={this.constructor.renderScenarioDetails(scenario)}
          key={childKey}
        />
      );
    });
  }

  render() {
    if (!this.props.scenarios) {
      return (<div className="loading">Loading...</div>);
    }

    if (_.isEmpty(this.props.scenarios)) {
      return (<div className="loading">Have not submitted any scenarios yet.</div>);
    }

    const filteredScenarios = this.filterScenarios();
    const totalCount = filteredScenarios.length;

    return (
      <div className={styles.scenariosList}>
        <div className={styles.scenariosListHeader}>Scenarios</div>
        <div className={styles.scenariosDescription}>{`Total: ${totalCount}`}</div>
        <div className={styles.scenariosSearch}>
          <SearchScenarios
            search={this.state.search}
            action={this.setSearch}
          />
        </div>
        <div className={styles.scenarios}>
          {this.renderScenarios(filteredScenarios)}
        </div>
        <div className={styles.scenarioListButtons}>
          <Pagination
            className={styles.scenarioPagination}
            page={this.state.page}
            perPage={this.state.perPage}
            total={totalCount}
            action={this.setPage}
          />
          <PerPageFilter
            items={filteredScenarios}
            totalCount={totalCount}
            buttons={[30,10]}
            perPage={this.state.perPage}
            action={this.setPerPage}
          />
        </div>
      </div>
    );
  }
}

const mergeScenarios = (projectScenarios) => {
  const scenarios = _.map(projectScenarios, project => project.examples);
  const examples = _.flattenDeep(scenarios);
  return { total_count: examples.length, examples };
}

const mapStateToProps = (state) => ({
  projects: _.keys(state.projectScenarios.scenariosList.data),
  scenarios: mergeScenarios(state.projectScenarios.scenariosList.data),
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, { getAllScenarios })(Scenarios);
