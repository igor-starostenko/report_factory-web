import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import ceil from 'lodash/ceil';
import getValue from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { Scenario } from '.';
import { removeSpecialCharacters } from '../helpers/format_helpers';
import {
  filterScenarios,
  slicePageScenarios,
} from '../helpers/scenarios_helpers';

export default ComposedComponent => {
  function ScenariosList(props) {
    const [scenarios, setScenarios] = useState([]);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState([]);

    const { scenariosDetails, scenariosList, xApiKey } = props;

    function setFilteredScenarios() {
      const filteredScenarios = filterScenarios(scenariosList, search);
      const totalPages = ceil(filteredScenarios.length / perPage);
      setScenarios(filteredScenarios);
      setTotal(filteredScenarios.length);
      if (totalPages > 0 && totalPages < page) {
        setPage(totalPages);
      }
    }

    useEffect(() => {
      setFilteredScenarios();
    }, [scenariosList, page, perPage, search]);

    function renderScenarios({ withProjectName }) {
      if (isEmpty(scenarios)) {
        return <div className="loading">No scenarios found.</div>;
      }
      let childKey = 0;
      return map(slicePageScenarios(scenarios, page, perPage), scenario => {
        childKey += 1;
        const formattedScenarioName = removeSpecialCharacters(
          scenario.fullDescription,
        );
        const path = `${scenario.projectName}.${formattedScenarioName}`;
        const scenarioDetails = getValue(scenariosDetails, path);
        return (
          <Scenario
            title={scenario.fullDescription}
            projectName={scenario.projectName}
            withProjectName={withProjectName}
            status={scenario.status}
            scenarioDetails={scenarioDetails}
            queryScenario={props.queryScenario}
            xApiKey={xApiKey}
            key={childKey}
          />
        );
      });
    }

    return (
      <ComposedComponent
        page={page}
        perPage={perPage}
        renderScenarios={renderScenarios}
        setScenarios={setFilteredScenarios}
        setPage={setPage}
        setPerPage={setPerPage}
        setSearch={setSearch}
        search={search}
        scenarios={scenarios}
        total={total}
        {...props}
      />
    );
  }

  ScenariosList.propTypes = {
    scenariosDetails: PropTypes.shape({
      [PropTypes.string]: PropTypes.object,
    }),
    scenariosList: PropTypes.arrayOf(PropTypes.object),
    xApiKey: PropTypes.string.isRequired,
    queryScenario: PropTypes.func.isRequired,
  };

  ScenariosList.defaultProps = {
    scenariosDetails: {},
    scenariosList: [],
  };

  return ScenariosList;
};
