import React, { Component } from 'react';
import _ from 'lodash';
import { CollapsibleItem, Details, PerPageFilter, Pagination,
  ScenarioSuccessChart, SearchScenarios } from '../components';
import { filterScenarios, firstScenarioColumn, secondScenarioColumn,
  slicePageScenarios, statusName } from '../helpers/scenarios_helpers';
import styles from './styles/ProjectScenarios.css';

export default class ProjectScenarios extends Component {
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

  constructor(state) {
    super(state);
    this.state = { scenarios: [], page: 1, perPage: 10, total: 1, search: [] };
    this.setPage = this.setPage.bind(this);
    this.setPerPage = this.setPerPage.bind(this);
    this.setSearch = this.setSearch.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      (!_.isEqual(nextProps, this.props)) ||
      (!_.isEqual(nextState, this.state))
    );
  }

  componentDidMount() {
    this.setScenarios();
  }

  componentDidUpdate() {
    this.setScenarios();
  }

  setScenarios() {
    const examples = _.get(this.props.scenarios, 'examples');
    const filteredScenarios = filterScenarios(examples, this.state.search);
    const totalPages = _.ceil(this.state.total / this.state.perPage);
    const newState = {
      scenarios: filteredScenarios,
      total: filteredScenarios.length,
    }
    if (totalPages > 1 && totalPages < this.state.page) {
      return this.setState(_.merge(newState, { page: totalPages }));
    }
    this.setState(newState);
  }

  setPage({ page }) {
    this.setState({ page });
  }

  setPerPage({ perPage }) {
    this.setState({ perPage });
  }

  setSearch({ search }) {
    this.setState({ search });
  }

  renderScenarios() {
    const { scenarios, page, perPage } = this.state;
    if (_.isEmpty(scenarios)) {
      return (<div className="loading">No scenarios found</div>);
    }
    let childKey = 0;
    return _.map(slicePageScenarios(scenarios, page, perPage), (scenario) => {
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

    return (
      <div className={styles.projectScenarios}>
        <div className={styles.projectScenariosHeader}>Scenarios</div>
        <div className={styles.projectScenariosDescription}>
          Total Scenarios: {this.state.total}
        </div>
        <div className={styles.projectScenariosSearch}>
          <SearchScenarios
            search={this.state.search}
            action={this.setSearch}
          />
        </div>
        <div className={styles.projectScenariosList}>
          {this.renderScenarios()}
        </div>
        <div className={styles.projectScenariosButtons}>
          <Pagination
            className={styles.scenarioPagination}
            page={this.state.page}
            perPage={this.state.perPage}
            total={this.state.total}
            action={this.setPage}
          />
          <PerPageFilter
            totalCount={this.state.total}
            buttons={[30,10]}
            perPage={this.state.perPage}
            action={this.setPerPage}
          />
        </div>
      </div>
    );
  }
}
