import React, { Component } from 'react';
import _ from 'lodash';
import { Pie } from 'react-chartjs';
import { getColors, setOpacity } from '../helpers/chart_helpers';
// import styles from './styles/RspecReportPieChart.css';

const options = {
  responsive: true,
  maintainAspectRatio: false,
  segmentStrokeWidth: 1,
  percentageInnerCutout: 15,
  animateRotate: false,
  tooltipFillColor: 'rgba(255,165,91,0.8)',
};

const colors = getColors();

const getFailedCount = reports => (_.filter(reports, r => r.attributes.summary.failure_count > 0));

const getChartData = (reports) => {
  const failed = getFailedCount(reports);
  return [
    {
      label: 'Passed',
      value: _.keys(reports).length - failed.length,
      color: setOpacity(colors.green, 0.7),
      highlight: setOpacity(colors.green, 0.8),
    },
    {
      label: 'Failed',
      value: failed.length,
      color: setOpacity(colors.red, 0.7),
      highlight: setOpacity(colors.red, 0.8),
    },
  ];
};

export default class ReportsSuccessChart extends Component {
  render() {
    return (
      <Pie
        data={getChartData(this.props.reports)}
        options={options}
        height="320"
        redraw
      />
    );
  }
}
