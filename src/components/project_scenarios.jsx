import React, { Fragment, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import ScenariosList from './scenarios_list';
import { PerPageFilter, Pagination, SearchScenarios } from '.';
import styles from './styles/ProjectScenarios.css';

function ProjectScenarios(props) {
  useEffect(() => {
    props.setScenarios();
  }, []);

  const { page, perPage, scenariosList, search, total } = props;

  if (isEmpty(scenariosList)) {
    return <Fragment />;
  }

  return (
    <div className={styles.projectScenarios}>
      <div className={styles.projectScenariosHeader}>Scenarios</div>
      <div className={styles.projectScenariosDescription}>
        Scenarios reported: {total}
      </div>
      <div className={styles.projectScenariosSearch}>
        <SearchScenarios search={search} setSearch={props.setSearch} />
      </div>
      <div className={styles.projectScenariosList}>
        {props.renderScenarios({ withProjectName: false })}
      </div>
      <div className={styles.projectScenariosButtons}>
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
  );
}

ProjectScenarios.propTypes = {
  page: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  scenariosList: PropTypes.arrayOf(PropTypes.object),
  total: PropTypes.number.isRequired,
  search: PropTypes.arrayOf(PropTypes.string),
  setSearch: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  setPerPage: PropTypes.func.isRequired,
  setScenarios: PropTypes.func.isRequired,
  renderScenarios: PropTypes.func.isRequired,
};

ProjectScenarios.defaultProps = {
  scenariosList: [],
  search: [],
};

export default ScenariosList(ProjectScenarios);
