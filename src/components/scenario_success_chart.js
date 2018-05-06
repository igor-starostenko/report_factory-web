import React, { Component } from 'react';
import _ from 'lodash';
import { Pie } from 'react-chartjs-2';
import { getColors, setOpacity } from '../helpers/chart_helpers';

const formatTooltip = ({ datasetIndex, index }, { datasets, labels }) => {
  const label = labels[index];
  const value = datasets[datasetIndex].data[index];
  return ` ${label}: ${_.round(value * 100, 1)}%`;
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

const getChartData = (scenario) => {
  const passed = scenario.total_passed / scenario.total_runs;
  const failed = scenario.total_failed / scenario.total_runs;
  const data = [passed, 1 - passed - failed, failed];
  const backgroundColor = [colors.green, colors.yellow, colors.red];
  const hoverBackgroundColor = [setOpacity(colors.green, 0.8),
                                setOpacity(colors.yellow, 0.8),
                                setOpacity(colors.red, 0.8)];
  const labels = ['Passed', 'Pending', 'Failed'];
  return { datasets: [{ data, backgroundColor, hoverBackgroundColor }], labels };
};

export default class ScenarioSuccessChart extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.scenario !== nextProps.scenario;
  }

  render() {
    if (_.isEmpty(this.props.scenario)) {
      return (<div />);
    }

    return (
      <Pie
        data={getChartData(this.props.scenario)}
        options={options}
        redraw
      />
    );
  }
}
