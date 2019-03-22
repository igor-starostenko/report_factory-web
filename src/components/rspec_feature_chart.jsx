import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import forEach from 'lodash/forEach';
import groupBy from 'lodash/groupBy';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import split from 'lodash/split';
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

const groupByFeatures = examples => {
  return groupBy(examples, example => {
    return split(example.full_description, ' ', 1)[0];
  });
};

const countFeatureLength = examples => {
  const runTimes = map(examples, example => example.run_time);
  return reduce(runTimes, (sum, n) => sum + n, 0);
};

const getChartData = examples => {
  const data = [];
  const backgroundColor = [];
  const labels = [];
  forEach(groupByFeatures(examples), (featureExamples, feature) => {
    data.push(countFeatureLength(featureExamples));
    backgroundColor.push(randomColor(0.8));
    labels.push(feature);
  });
  return { datasets: [{ data, backgroundColor }], labels };
};

export default function ReportsFeatureChart(props) {
  const { examples } = props;

  if (isEmpty(examples)) {
    return <Fragment />;
  }

  return (
    <div className={styles.chart}>
      <h4 className={styles.chartTitle}>Features</h4>
      <Pie
        data={getChartData(examples)}
        options={options}
        height={350}
        redraw
      />
    </div>
  );
}

ReportsFeatureChart.propTypes = {
  examples: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string.isRequired,
      file_path: PropTypes.string.isRequired,
      full_description: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      line_number: PropTypes.number.isRequired,
      pending_message: PropTypes.string,
      run_time: PropTypes.number.isRequired,
      spec_id: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};
