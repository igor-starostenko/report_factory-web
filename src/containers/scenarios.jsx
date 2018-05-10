import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { CollapsibleItem, Details, PerPageFilter, Pagination,
  ScenarioSuccessChart, SearchScenarios } from '../components';
import { filterScenarios, firstScenarioColumn, secondScenarioColumn,
  slicePageScenarios, statusName } from '../helpers/scenarios_helpers';
import { getAllScenarios } from '../actions/project_scenarios_actions';
import styles from './styles/Scenarios.css';

class Scenarios extends Component {
  static renderScenarioDetails(scenario) {
    return (
      <div className={styles.scenarioExtendedDetails}>
        <Details rows={{ 'Project': scenario.project }} />
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
    const { xApiKey, scenarios } = this.props;
    this.props.getAllScenarios(xApiKey);
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
    if (_.isEmpty((_.get(this.props.scenarios, 'examples')))) {
      return (<div className="loading">Loading...</div>);
    }

    if (_.isEmpty(this.props.scenarios)) {
      return (<div className="loading">Have not submitted any scenarios yet.</div>);
    }

    return (
      <div>
        <br />
        <div className={styles.scenarios}>
          <div className={styles.scenariosHeader}>
            <div className={styles.scenariosTitle}>Scenarios</div>
          </div>
          <div className={styles.allScenariosSearch}>
            <SearchScenarios
              search={this.state.search}
              action={this.setSearch}
            />
          </div>
          <div className={styles.scenariosTotal}>
            Total Scenarios: {this.state.total}
          </div>
          <div className={styles.allScenarios}>
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
      </div>
    );
  }
}

const mergeScenarios = (projectScenarios) => {
  const scenarios = _.map(projectScenarios, (data, project) => {
    return _.map(data.examples, example => _.set(example, 'project', project));
  });
  const examples = _.flattenDeep(scenarios);
  return { total_count: examples.length, examples };
}

const mapStateToProps = (state) => ({
  projects: _.keys(state.projectScenarios.scenariosList.data),
  scenarios: mergeScenarios(state.projectScenarios.scenariosList.data),
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, { getAllScenarios })(Scenarios);
