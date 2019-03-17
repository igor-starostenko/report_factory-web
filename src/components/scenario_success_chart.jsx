import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import round from 'lodash/round';
import { Pie } from 'react-chartjs-2';
import { getColors, setOpacity } from '../helpers/chart_helpers';

const formatTooltip = ({ datasetIndex, index }, { datasets, labels }) => {
  const label = labels[index];
  const value = datasets[datasetIndex].data[index];
  return ` ${label}: ${round(value * 100, 1)}%`;
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  tooltips: {
    callbacks: { label: formatTooltip },
    bodyFontSize: 14,
    backgroundColor: 'rgba(255,165,91,0.8)',
  },
  legend: {
    display: false,
    position: 'bottom',
  },
};

const colors = getColors(0.7);

const getChartData = scenario => {
  const passed = scenario.totalPassed / scenario.totalRuns;
  const failed = scenario.totalFailed / scenario.totalRuns;
  const data = [passed, 1 - passed - failed, failed];
  const backgroundColor = [colors.green, colors.yellow, colors.red];
  const hoverBackgroundColor = [
    setOpacity(colors.green, 0.8),
    setOpacity(colors.yellow, 0.8),
    setOpacity(colors.red, 0.8),
  ];
  const labels = ['Passed', 'Pending', 'Failed'];
  return {
    datasets: [{ data, backgroundColor, hoverBackgroundColor }],
    labels,
  };
};

function ScenarioSuccessChart(props) {
  const { scenario } = props;

  if (isEmpty(scenario)) {
    return <Fragment />;
  }

  return <Pie data={getChartData(scenario)} options={options} redraw />;
}

ScenarioSuccessChart.propTypes = {
  scenario: PropTypes.shape({
    totalPassed: PropTypes.number,
    totalFailed: PropTypes.number,
  }).isRequired,
};

export default React.memo(ScenarioSuccessChart);
