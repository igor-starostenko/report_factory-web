import React, { Component } from 'react';
import _ from 'lodash';
import { Pie } from 'react-chartjs-2';
import { randomColor } from '../helpers/chart_helpers';
import { formatDuration } from '../helpers/format_helpers';
import styles from './styles/RspecReportPieChart.css';

const formatTooltip = ({ datasetIndex, index }, { datasets, labels }) => {
  const label = labels[index];
  const value = datasets[datasetIndex].data[index];
  return `${label}: ${formatDuration(value)}`;
};

const options = {
  responsive: true,
  maintainAspectRatio: true,
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

/* eslint-disable arrow-body-style */
const groupByFeatures = (examples) => {
  return _.groupBy(examples, (example) => {
    return _.split(example.full_description, ' ', 1)[0];
  });
};

const countFeatureLength = (examples) => {
  const runTimes = _.map(examples, example => (example.run_time));
  return _.reduce(runTimes, (sum, n) => (sum + n), 0);
};

const getChartData = (examples) => {
  const data = [];
  const backgroundColor = [];
  const labels = [];
  _.forEach(groupByFeatures(examples), (featureExamples, feature) => {
    data.push(countFeatureLength(featureExamples));
    backgroundColor.push(randomColor(0.8));
    labels.push(feature);
  });
  return { datasets: [{ data, backgroundColor }], labels };
};

export default class ReportsFeatureChart extends Component {
  render() {
    if (_.isEmpty(this.props.examples)) {
      return (<div />);
    }

    return (
      <div className={styles.chart}>
        <h4 className={styles.chartTitle}>Features</h4>
        <Pie
          data={getChartData(this.props.examples)}
          options={options}
          height={350}
          redraw
        />
      </div>
    );
  }
}
