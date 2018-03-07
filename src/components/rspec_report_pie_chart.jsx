import React, { Component } from 'react';
import _ from 'lodash';
import { Pie } from 'react-chartjs-2';
import { getColors } from '../helpers/chart_helpers';
import styles from './styles/RspecReportPieChart.css';

const formatTooltip = ({ index }, { labels }) => (labels[index]);

const options = {
  responsive: true,
  maintainAspectRatio: true,
  cutoutPercentage: 60,
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

const colors = getColors();

const getDataColor = (status) => {
  if (status === 'passed') {
    return colors.green;
  } else if (status === 'pending') {
    return colors.orange;
  }
  return colors.red;
};

const getChartData = (examples) => {
  const data = [];
  const backgroundColor = [];
  const labels = [];
  _.each((examples), (example) => {
    data.push(example.run_time);
    backgroundColor.push(getDataColor(example.status));
    labels.push(example.description);
  });
  return { datasets: [{ data, backgroundColor }], labels };
};

export default class RspecReportPieChart extends Component {
  render() {
    if (_.isEmpty(this.props.examples)) {
      return (<div />);
    }

    return (
      <div className={styles.chart}>
        <h4 className={styles.chartTitle}>Examples</h4>
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
