import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import each from 'lodash/each';
import isEmpty from 'lodash/isEmpty';
import { Pie } from 'react-chartjs-2';
import { getColors } from '../helpers/chart_helpers';
import styles from './styles/RspecReportPieChart.css';

const formatTooltip = ({ index }, { labels }) => labels[index];

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
const dataColors = {
  passed: colors.green,
  failed: colors.red,
  pending: colors.orange,
};

const getChartData = examples => {
  const data = [];
  const backgroundColor = [];
  const labels = [];
  each(examples, example => {
    data.push(example.run_time);
    backgroundColor.push(dataColors[example.status] || dataColors.pending);
    labels.push(example.description);
  });
  return { datasets: [{ data, backgroundColor }], labels };
};

export default function RspecReportPieChart(props) {
  const { examples } = props;

  if (isEmpty(examples)) {
    return <Fragment />;
  }

  return (
    <div className={styles.chart}>
      <h4 className={styles.chartTitle}>Examples</h4>
      <Pie
        data={getChartData(examples)}
        options={options}
        height={350}
        redraw
      />
    </div>
  );
}

RspecReportPieChart.propTypes = {
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
