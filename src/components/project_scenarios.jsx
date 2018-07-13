import React, { Component } from 'react';
import _ from 'lodash';
import ScenariosList from '../components/scenarios_list';
import { PerPageFilter, Pagination, ScenarioSuccessChart,
   SearchScenarios } from '../components';
import { firstScenarioColumn, secondScenarioColumn } from '../helpers/scenarios_helpers';
import styles from './styles/ProjectScenarios.css';

class ProjectScenarios extends Component {
  componentDidMount() {
    this.props.setScenarios();
  }

  render() {
    if (_.isEmpty(this.props.scenariosList)) {
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
          {this.props.renderScenarios({ withProjectName: false })}
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
