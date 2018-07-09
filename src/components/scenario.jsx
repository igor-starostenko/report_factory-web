import React, { Component } from 'react';
import { CollapsibleItem, Details } from '../components';
import styles from './styles/Scenario.css';

export default class Scenario extends Component {
  constructor(props) {
    super(props);
    this.renderDetails = this.renderDetails.bind(this);
  }

  statusName() {
    if (this.props.status === 'failed') {
      return 'failedScenario';
    } else if (this.props.status === 'passed') {
      return 'passedScenario';
    }
    return 'pendingScenario';
  };

  renderDetails() {
    return (
      <div className={styles.scenarioExtendedDetails}>
        <Details rows={{ 'Project': this.props.project }} />
      </div>
    );
    // <div className={styles.scenarioSuccessChart}>
    //   <ScenarioSuccessChart scenario={scenario} />
    // </div>
    // <div className={styles.scenarioPrimaryDetails}>
    //   <Details rows={firstScenarioColumn(scenario)} />
    // </div>
    // <div className={styles.scenarioSecondaryDetails}>
    //   <Details rows={secondScenarioColumn(scenario)} />
    // </div>
  }

  render() {
    return (
      <CollapsibleItem
        className={`${styles.scenario} ${styles[this.statusName()]}`}
        renderDetails={this.renderDetails}
        { ...this.props }
      />
    );
  }
}
