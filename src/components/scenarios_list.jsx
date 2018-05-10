import React, { Component } from 'react';
import _ from 'lodash';
import { CollapsibleItem, Details, PerPageFilter, Pagination,
  ScenarioSuccessChart, SearchScenarios } from '../components';
import { filterScenarios, firstScenarioColumn, secondScenarioColumn,
  slicePageScenarios, statusName } from '../helpers/scenarios_helpers';
import styles from './styles/ScenariosList.css';

export default class ScenariosList extends Component {
  static renderScenarioDetails(scenario) {
    return (
      <div className={styles.scenariosListExtendedDetails}>
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
    this.state = { scenarios: [], page: 1, perPage: 10, total: 0, search: [] };
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

  componentDidUpdate() {
    const examples = _.get(this.props.scenarios, 'examples');
    const filteredScenarios = filterScenarios(examples, this.state.search);
    this.setState({ scenarios: filteredScenarios, total: filteredScenarios.length });
  }

  setPage({ page }) {
    this.setState({ page });
  }

  setPerPage({ perPage }) {
    const totalPages = _.ceil(this.state.total / perPage);
    if (totalPages < this.state.page) {
      return this.setState({ page: totalPages, perPage });
    }
    this.setState({ perPage });
  }

  setSearch({ search }) {
    const examples = _.get(this.props.scenarios, 'examples');
    const filteredScenarios = filterScenarios(examples, search);
    this.setState({
      scenarios: filteredScenarios,
      total: filteredScenarios.length,
      search,
    });
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

    // console.log(this.state);

    // const filteredScenarios = filterScenarios(this.props.scenarios, this.state.search);
    // this.setTotal(filteredScenarios);

    return (
      <div className={styles.scenariosList}>
        <div className={styles.scenariosListHeader}>Scenarios</div>
        <div className={styles.scenariosDescription}>
          {`Total Scenarios: ${this.state.total}`}
        </div>
        <div className={styles.scenariosSearch}>
          <SearchScenarios
            search={this.state.search}
            action={this.setSearch}
          />
        </div>
        <div className={styles.projectScenarios}>
          {this.renderScenarios()}
        </div>
        <div className={styles.scenarioListButtons}>
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
