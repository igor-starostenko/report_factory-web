import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { CollapsibleItem, Pagination } from '../components';
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
  }

  setPage({ page }) {
    this.setState({ page });
  }

  renderScenarios() {
    let childKey = 0;
    const startIndex = this.state.page * this.state.perPage - 10;
    const endIndex = startIndex + this.state.perPage;
    const { examples } = this.props.scenarios;
    const pageScenarios = examples.slice(startIndex, endIndex);
    return _.map(pageScenarios, (scenario) => {
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
          <div>
            <Pagination
              className={styles.projectReportsPagination}
              page={this.state.page}
              perPage={this.state.perPage}
              total={totalCount}
              action={this.setPage}
            />
          </div>
        </div>
      </div>
    );
  }
}
