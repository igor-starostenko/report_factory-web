import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { CollapsibleItem } from '../components';
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
  renderScenarios() {
    let childKey = 0;
    return _.map(this.props.scenarios.examples, (scenario) => {
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
        </div>
      </div>
    );
  }
}
