import React, { Component } from 'react';
import _ from 'lodash';
import { Pie } from 'react-chartjs-2';
import { getColors, setOpacity } from '../helpers/chart_helpers';
// import styles from './styles/RspecReportPieChart.css';

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
};

const colors = getColors(0.7);

const getFailedCount = reports => {
  return _.filter(reports, report => report.summary.failureCount > 0);
};

const getChartData = reports => {
  const failed = getFailedCount(reports).length / _.keys(reports).length;
  const data = [1 - failed, failed];
  const backgroundColor = [colors.green, colors.red];
  const hoverBackgroundColor = [
    setOpacity(colors.green, 0.8),
    setOpacity(colors.red, 0.8),
  ];
  const labels = ['Passed', 'Failed'];
  return {
    datasets: [{ data, backgroundColor, hoverBackgroundColor }],
    labels,
  };
};

export default class ReportsSuccessChart extends Component {
  shouldComponentUpdate(nextProps) {
    return !_.isEqual(this.props.reports, nextProps.reports);
  }

  render() {
    if (_.isEmpty(this.props.reports)) {
      return <div />;
    }

    return (
      <Pie
        data={getChartData(this.props.reports)}
        options={options}
        height={320}
        redraw
      />
    );
  }
}
