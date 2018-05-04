import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { CollapsibleItem, FilterButton, Pagination } from '../components';
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

export default class ScenariosList extends Component {
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
    const totalCount = this.props.scenarios.total_count;
    const totalPages = _.ceil(totalCount / perPage);
    if (totalPages < this.state.page) {
      return this.setState({ page: totalPages, perPage });
    }
    this.setState({ perPage });
  }

  activeFilter(number) {
    return this.state.perPage === number;
  }

  renderFilterButtons() {
    const totalCount = this.props.scenarios.total_count;
    if (!this.props.scenarios || totalCount <= 10) {
      return (<div />);
    }
    return (
      <div className="filters">
        <ul id="chart-pills" className="nav nav-pills ct-orange">
          <FilterButton
            name="30 Per Page"
            value={{ perPage: 30 }}
            active={this.activeFilter(30)}
            action={this.setPerPage}
          />
          <FilterButton
            name="10 Per Page"
            value={{ perPage: 10 }}
            active={this.activeFilter(10)}
            action={this.setPerPage}
          />
        </ul>
      </div>
    );
  }

  slicePageScenarios() {
    const startIndex = this.state.page * this.state.perPage - this.state.perPage;
    const endIndex = startIndex + this.state.perPage;
    const { examples } = this.props.scenarios;
    return examples.slice(startIndex, endIndex);
  }

  renderScenarios() {
    let childKey = 0;
    return _.map(this.slicePageScenarios(), (scenario) => {
      childKey += 1;
      const status = statusName(scenario.last_status);
      // details={this.constructor.renderExampleDetails(example)}
      return (
        <CollapsibleItem
          className={`${styles.scenario} ${styles[status]}`}
          title={scenario.name}
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

    const totalCount = this.props.scenarios.total_count;

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
            {this.renderFilterButtons()}
          </div>
        </div>
      </div>
    );
  }
}
