import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { CollapsibleItem, PerPageFilter, Pagination, ScenarioSuccessChart } from '../components';
import { formatDuration, formatDateAgo } from '../helpers/format_helpers';
import styles from './styles/ScenariosList.css';

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

export default class ScenariosList extends Component {
  static renderScenarioTexDetails(details) {
    return _.map(details, (value, key) => (
      <div className={styles.scenarioDetailsRow} key={key}>
        <div className={styles.scenarioDetailsParam}>{key}:</div>
        <div className={styles.scenarioDetailsValue}>{value}</div>
      </div>
    ));
  }

  static renderScenarioDetails(scenario) {
    const details = {
      'Total Runs': scenario.total_runs,
      'Last Run': dateAgoString(scenario.last_run),
      'Last Passed': dateAgoString(scenario.last_passed),
      'Last Failed': dateAgoString(scenario.last_failed),
    };
    return (
      <div className={styles.scenarioExtendedDetails}>
        <div className={styles.scenarioTextDetails}>
          {this.renderScenarioTexDetails(details)}
        </div>
        <div className={styles.scenarioSuccessChart}>
          <ScenarioSuccessChart scenario={scenario} />
        </div>
      </div>
    );
  }

  constructor(state) {
    super(state);
    this.state = { page: 1, perPage: 10 };
    this.setPage = this.setPage.bind(this);
    this.setPerPage = this.setPerPage.bind(this);
  }

  setPage({ page }) {
    this.setState({ page });
  }

  setPerPage({ perPage }) {
    let newState;
    const totalPages = _.ceil(this.fetchTotalCount() / perPage);
    if (totalPages < this.state.page) {
      return this.setState({ page: totalPages, perPage });
    }
    this.setState({ perPage });
  }

  slicePageScenarios() {
    const startIndex = this.state.page * this.state.perPage - this.state.perPage;
    const endIndex = startIndex + this.state.perPage;
    const { examples } = this.props.scenarios;
    return examples.slice(startIndex, endIndex);
  }

  fetchTotalCount() {
    return this.props.scenarios.total_count;
  }

  renderScenarios() {
    let childKey = 0;
    return _.map(this.slicePageScenarios(), (scenario) => {
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

    const totalCount = this.fetchTotalCount();

    return (
      <div>
        <div className={styles.scenariosDescription}>{`Total: ${totalCount}`}</div>
        <br />
        <div className={styles.scenariosList}>
          <div className={styles.listGroup}>
            {this.renderScenarios()}
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
              items={this.props.scenarios}
              totalCount={totalCount}
              buttons={[30,10]}
              perPage={this.state.perPage}
              action={this.setPerPage}
            />
          </div>
        </div>
      </div>
    );
  }
}
