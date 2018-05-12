import React, { Component } from 'react';
import _ from 'lodash';
import { CollapsibleItem } from '../components';
import { filterScenarios, slicePageScenarios } from '../helpers/scenarios_helpers';
import styles from './styles/ScenariosList.css';

const statusName = (status) => {
  if (status === 'failed') {
    return 'failedScenario';
  } else if (status === 'passed') {
    return 'passedScenario';
  }
  return 'pendingScenario';
};

export default (ComposedComponent) => {
  class ScenariosList extends Component {
    constructor(state) {
      super(state);
      this.state = { scenarios: [], page: 1, perPage: 10, total: 1, search: [] };
      this.setPage = this.setPage.bind(this);
      this.setPerPage = this.setPerPage.bind(this);
      this.setSearch = this.setSearch.bind(this);
      this.setScenarios = this.setScenarios.bind(this);
      this.renderScenarios = this.renderScenarios.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
      return (
        (!_.isEqual(nextProps, this.props)) ||
        (!_.isEqual(nextState, this.state))
      );
    }

    componentDidUpdate() {
      this.setScenarios();
    }

    setScenarios() {
      const examples = _.get(this.props.scenariosList, 'examples');
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

    renderScenarios(renderDetails) {
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
            details={renderDetails(scenario)}
            key={childKey}
          />
        );
      });
    }

    render () {
      return <ComposedComponent
        setScenarios={this.setScenarios}
        setPage={this.setPage}
        setPerPage={this.setPerPage}
        setSearch={this.setSearch}
        renderScenarios={this.renderScenarios}
        { ...this.props }
        { ...this.state }
      />;
    }
  }

  return ScenariosList;
}
