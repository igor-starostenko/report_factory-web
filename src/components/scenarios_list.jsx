import React, { Component } from 'react';
import _ from 'lodash';
import { Scenario } from '../components';
import { filterScenarios, slicePageScenarios } from '../helpers/scenarios_helpers';

export default (ComposedComponent) => {
  class ScenariosList extends Component {
    constructor(state) {
      super(state);
      this.state = { scenarios: [], page: 1, perPage: 10, total: 0, search: [] };
      this.setPage = this.setPage.bind(this);
      this.setPerPage = this.setPerPage.bind(this);
      this.setSearch = this.setSearch.bind(this);
      this.setScenarios = this.setScenarios.bind(this);
      this.renderScenarios = this.renderScenarios.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
      return (
        (!_.isEqual(nextState, this.state)) ||
        (!_.isEqual(nextProps, this.props))
      );
    }

    componentDidUpdate() {
      this.setScenarios();
    }

    setScenarios() {
      const scenarios = this.props.scenariosList;
      const filteredScenarios = filterScenarios(scenarios, this.state.search);
      const totalPages = _.ceil(this.state.total / this.state.perPage);
      const newState = {
        scenarios: filteredScenarios,
        total: filteredScenarios.length,
      }
      if (totalPages > 0 && totalPages < this.state.page) {
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
        const path = `${scenario.project_name}.${scenario.full_description}`;
        const scenarioDetails = _.get(this.props.scenariosDetails, path);
        return (
          <Scenario
            title={scenario.full_description}
            projectName={scenario.project_name}
            status={scenario.status}
            scenarioDetails={scenarioDetails}
            queryScenario={this.props.queryScenario}
            xApiKey={this.props.xApiKey}
            key={childKey}
          />
        );
      });
    }

    render () {
      return (<ComposedComponent
        setScenarios={this.setScenarios}
        setPage={this.setPage}
        setPerPage={this.setPerPage}
        setSearch={this.setSearch}
        renderScenarios={this.renderScenarios}
        { ...this.props }
        { ...this.state }
      />);
    }
  }

  return ScenariosList;
}
