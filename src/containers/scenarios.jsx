import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import ScenariosList from '../components/scenarios_list';
import { PerPageFilter, Pagination, SearchScenarios } from '../components';
import { queryScenarios, queryScenario } from '../actions/scenarios_actions';
import styles from './styles/Scenarios.css';

class Scenarios extends Component {
  componentDidMount() {
    const { xApiKey, scenarios } = this.props;
    this.props.queryScenarios(xApiKey);
    this.props.setScenarios();
  }

  render() {
    if (this.props.loading) {
      return (<div className="loading">Loading...</div>);
    }

    if (_.isEmpty(this.props.scenariosList)) {
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
            Scenarios reported: {this.props.total}
          </div>
          <div className={styles.allScenarios}>
            {this.props.renderScenarios({ withProjectName: true })}
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
  loading: state.scenarios.list.loading,
  scenariosList: state.scenarios.list.data,
  scenariosDetails: state.scenarios.details.data,
  xApiKey: state.users.currentUser.xApiKey,
});

const composedComponent = ScenariosList(Scenarios);
export default connect(mapStateToProps, { queryScenarios, queryScenario })(composedComponent);
