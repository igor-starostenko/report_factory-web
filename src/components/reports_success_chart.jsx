import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import filter from 'lodash/filter';
import round from 'lodash/round';
import keys from 'lodash/keys';
import isEmpty from 'lodash/isEmpty';
import { Pie } from 'react-chartjs-2';
import { getColors, setOpacity } from '../helpers/chart_helpers';
// import styles from './styles/RspecReportPieChart.css';

const formatTooltip = ({ datasetIndex, index }, { datasets, labels }) => {
  const value = datasets[datasetIndex].data[index];
  return ` ${labels[index]}: ${round(value * 100, 1)}%`;
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
  return filter(reports, report => report.summary.failureCount > 0);
};

const getChartData = reports => {
  const failed = getFailedCount(reports).length / keys(reports).length;
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

function ReportsSuccessChart(props) {
  const { edges } = props;
  const reports = edges.map(edge => edge.node);

  if (isEmpty(reports)) {
    return <Fragment />;
  }

  return (
    <Pie data={getChartData(reports)} options={options} height={320} redraw />
  );
}

ReportsSuccessChart.propTypes = {
  edges: PropTypes.arrayOf(
    PropTypes.shape({
      node: PropTypes.shape({
        id: PropTypes.number.isRequired,
        report: PropTypes.shape({
          createdAt: PropTypes.string.isRequired,
          projectName: PropTypes.string.isRequired,
          reportableType: PropTypes.string.isRequired,
        }).isRequired,
        summary: PropTypes.shape({
          duration: PropTypes.number.isRequired,
          exampleCount: PropTypes.number.isRequired,
          failureCount: PropTypes.number.isRequired,
          pendingCount: PropTypes.number.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
  ).isRequired,
};

export default React.memo(ReportsSuccessChart);
