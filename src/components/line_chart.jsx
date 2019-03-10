import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { Line } from 'react-chartjs-2';
import { ButtonGroup } from 'reactstrap';
import { FilterButton } from '.';

export default function LineChart(props) {
  const {
    activeFilter,
    filterMapping,
    filterAction,
    options,
    getChartData,
  } = props;

  function setFilter(filterName) {
    const newFilters = { ...filterMapping[filterName], filterName };
    return filterAction(newFilters);
  }

  return (
    <Fragment>
      <Line data={getChartData()} options={options} />
      <ButtonGroup className="filters">
        {Object.keys(filterMapping).map(name => {
          return (
            <FilterButton
              active={activeFilter === name}
              key={name}
              onClick={setFilter}
              value={name}
            >
              {name}
            </FilterButton>
          );
        })}
      </ButtonGroup>
    </Fragment>
  );
}

LineChart.propTypes = {
  activeFilter: PropTypes.string.isRequired,
  filterMapping: PropTypes.shape({
    Month: PropTypes.object.isRequired,
    Week: PropTypes.object.isRequired,
    Year: PropTypes.object.isRequired,
  }).isRequired,
  filterAction: PropTypes.func.isRequired,
  options: PropTypes.shape({
    responsive: PropTypes.bool.isRequired,
  }).isRequired,
  getChartData: PropTypes.func.isRequired,
};
