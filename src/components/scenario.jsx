import React, { Component } from 'react';
import { CollapsibleItem, Details, ScenarioSuccessChart } from '../components';
import { firstScenarioColumn, secondScenarioColumn } from '../helpers/scenarios_helpers';
import styles from './styles/Scenario.css';

export default class Scenario extends Component {
  constructor(props) {
    super(props);
    this.renderDetails = this.renderDetails.bind(this);
    this.onExpand = this.onExpand.bind(this);
  }

  statusName() {
    if (this.props.status === 'failed') {
      return 'failedScenario';
    } else if (this.props.status === 'passed') {
      return 'passedScenario';
    }
    return 'pendingScenario';
  };

  renderProjectName() {
    if (this.props.projectName) {
      return (<Details rows={{ 'Project': this.props.projectName }} />);
    }
    return (<div />);
  }

  renderDetails() {
    if (!this.props.scenarioDetails) {
      const loadingStyle={ marginTop: '4%', marginBottom: '4%' };
      return (<div className="loading" style={loadingStyle}>Loading...</div>);
    }
    return (
      <div className={styles.scenarioExtendedDetails}>
        {this.renderProjectName()}
        <div className={styles.scenarioSuccessChart}>
          <ScenarioSuccessChart scenario={this.props.scenarioDetails} />
        </div>
        <div className={styles.scenarioPrimaryDetails}>
          <Details rows={firstScenarioColumn(this.props.scenarioDetails)} />
        </div>
        <div className={styles.scenarioSecondaryDetails}>
          <Details rows={secondScenarioColumn(this.props.scenarioDetails)} />
        </div>
      </div>
    );
  }

  onExpand() {
    const { projectName, title, xApiKey } = this.props;
    if (!this.props.scenarioDetails) {
      this.props.queryScenario(projectName, title, xApiKey);
    }
  }

  render() {
    return (
      <CollapsibleItem
        className={`${styles.scenario} ${styles[this.statusName()]}`}
        renderDetails={this.renderDetails}
        onExpand={this.onExpand}
        { ...this.props }
      />
    );
  }
}
