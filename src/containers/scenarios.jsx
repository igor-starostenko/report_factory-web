import React, { Fragment, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import ScenariosList from '../components/scenarios_list';
import {
  Loading,
  PerPageFilter,
  Pagination,
  SearchScenarios,
} from '../components';
import { queryScenarios, queryScenario } from '../actions/scenarios_actions';
import styles from './styles/Scenarios.css';

function Scenarios(props) {
  const {
    xApiKey,
    scenarios,
    scenariosList,
    loading,
    page,
    perPage,
    total,
  } = props;

  useEffect(() => {
    if (isEmpty(scenarios)) {
      props.queryScenarios(xApiKey);
      props.setScenarios();
    }
  }, []);

  if (loading) {
    return <Loading page />;
  }

  if (isEmpty(scenariosList)) {
    return (
      <div className="loading pageLoading">
        Have not submitted any scenarios yet.
      </div>
    );
  }

  return (
    <Fragment>
      <br />
      <div className={styles.scenarios}>
        <div className={styles.scenariosHeader}>
          <h1 className={styles.scenariosTitle}>Scenarios</h1>
        </div>
        <div className={styles.allScenariosSearch}>
          <SearchScenarios search={props.search} setSearch={props.setSearch} />
        </div>
        <div className={styles.scenariosTotal}>Scenarios reported: {total}</div>
        <div className={styles.allScenarios}>
          {props.renderScenarios({ withProjectName: true })}
        </div>
        <div className={styles.scenarioListButtons}>
          <Pagination
            className={styles.scenarioPagination}
            page={page}
            perPage={perPage}
            total={total}
            setPage={props.setPage}
          />
          <PerPageFilter
            totalCount={total}
            buttons={[30, 10]}
            perPage={perPage}
            setPerPage={props.setPerPage}
          />
        </div>
      </div>
    </Fragment>
  );
}

Scenarios.propTypes = {
  xApiKey: PropTypes.string.isRequired,
  scenarios: PropTypes.arrayOf(PropTypes.object),
  scenariosList: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  search: PropTypes.arrayOf(PropTypes.string),
  setSearch: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  setPerPage: PropTypes.func.isRequired,
  renderScenarios: PropTypes.func.isRequired,
  queryScenarios: PropTypes.func.isRequired,
  setScenarios: PropTypes.func.isRequired,
};

Scenarios.defaultProps = {
  scenarios: [],
  scenariosList: [],
  search: [],
};

const mapStateToProps = state => ({
  loading: state.scenarios.list.loading,
  scenariosList: state.scenarios.list.data,
  scenariosDetails: state.scenarios.details.data,
  xApiKey: state.users.currentUser.xApiKey,
});

const composedComponent = ScenariosList(Scenarios);
export default connect(
  mapStateToProps,
  { queryScenarios, queryScenario },
)(composedComponent);
