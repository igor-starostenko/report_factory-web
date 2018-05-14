import React, { Component } from 'react';
import _ from 'lodash';
import ScenariosList from '../components/scenarios_list';
import { Details, PerPageFilter, Pagination, ScenarioSuccessChart,
   SearchScenarios } from '../components';
import { firstScenarioColumn, secondScenarioColumn } from '../helpers/scenarios_helpers';
import styles from './styles/ProjectScenarios.css';

class ProjectScenarios extends Component {
  static renderScenarioDetails(scenario) {
    return (
      <div className={styles.projectScenariosExtendedDetails}>
        <div className={styles.scenarioSuccessChart}>
          <ScenarioSuccessChart scenario={scenario} />
        </div>
        <div className={styles.scenarioPrimaryDetails}>
          <Details rows={firstScenarioColumn(scenario)} />
        </div>
        <div className={styles.scenarioSecondaryDetails}>
          <Details rows={secondScenarioColumn(scenario)} />
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.props.setScenarios();
  }

  render() {
    if (_.get(this.props.scenariosList, 'examples') === undefined) {
      return (<div className="loading">Loading...</div>);
    }

    if (_.get(this.props.scenariosList, 'total_count') === 0) {
      return (<div />);
    }

    return (
      <div className={styles.projectScenarios}>
        <div className={styles.projectScenariosHeader}>Scenarios</div>
        <div className={styles.projectScenariosDescription}>
          Total Scenarios: {this.props.total}
        </div>
        <div className={styles.projectScenariosSearch}>
          <SearchScenarios
            search={this.props.search}
            action={this.props.setSearch}
          />
        </div>
        <div className={styles.projectScenariosList}>
          {this.props.renderScenarios(this.constructor.renderScenarioDetails)}
        </div>
        <div className={styles.projectScenariosButtons}>
          <Pagination
            className={styles.scenarioPagination}
            page={this.props.page}
            perPage={this.props.perPage}
            total={this.props.total}
            action={this.props.setPage}
          />
          <PerPageFilter
            totalCount={this.props.total}
            buttons={[30,10]}
            perPage={this.props.perPage}
            action={this.props.setPerPage}
          />
        </div>
      </div>
    );
  }
}

export default ScenariosList(ProjectScenarios);
