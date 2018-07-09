import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import ScenariosList from '../components/scenarios_list';
import { Details, PerPageFilter, Pagination, ScenarioSuccessChart,
   SearchScenarios } from '../components';
import { firstScenarioColumn, secondScenarioColumn } from '../helpers/scenarios_helpers';
import { queryScenarios } from '../actions/scenarios_actions';
import styles from './styles/Scenarios.css';

class Scenarios extends Component {
  static renderScenarioDetails(scenario) {
    return (
      <div className={styles.scenarioExtendedDetails}>
        <Details rows={{ 'Project': scenario.project_name }} />
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

  componentDidMount() {
    const { xApiKey, scenarios } = this.props;
    this.props.queryScenarios(xApiKey);
    this.props.setScenarios();
  }

  render() {
    if (_.get(this.props.scenariosList, 'loading')) {
      return (<div className="loading">Loading...</div>);
    }

    if (_.isEmpty(this.props.scenariosList.data)) {
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
              search={this.props.search}
              action={this.props.setSearch}
            />
          </div>
          <div className={styles.scenariosTotal}>
            Total Scenarios: {this.props.total}
          </div>
          <div className={styles.allScenarios}>
            {this.props.renderScenarios(this.constructor.renderScenarioDetails)}
          </div>
          <div className={styles.scenarioListButtons}>
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
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  scenariosList: state.scenarios.list,
  xApiKey: state.users.currentUser.xApiKey,
});

const composedComponent = ScenariosList(Scenarios);
export default connect(mapStateToProps, { queryScenarios })(composedComponent);
