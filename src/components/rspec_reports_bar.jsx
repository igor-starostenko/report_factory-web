import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import constant from 'lodash/constant';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import reverse from 'lodash/reverse';
import takeRight from 'lodash/takeRight';
import times from 'lodash/times';
import { Bar } from 'react-chartjs-2';
import { formatDurationString } from '../helpers/format_helpers';
import {
  getColors,
  setOpacity,
  validateInteger,
} from '../helpers/chart_helpers';

const lastReports = (reports, number) => {
  return reverse(takeRight(reports, number));
};

const colors = getColors();

const getDuration = (reports, number = 10) => {
  if (isEmpty(reports)) {
    return times(number, constant(0));
  }
  return reports.map(report => report.summary.duration);
};

const getStatus = (reports, number = 10) => {
  if (isEmpty(reports)) {
    return times(number, constant(colors.grey));
  }
  return reports.map(report => {
    const { failureCount } = report.summary;
    if (failureCount > 0) {
      return colors.red;
    }
    return colors.green;
  });
};

const setAllOpacity = (barColors, opacity = 1) => {
  return map(barColors, c => setOpacity(c, opacity));
};

const getChartData = (reports, displayedNumber) => {
  if (typeof displayedNumber !== 'number') {
    throw new Error(`Filter ${displayedNumber} is not supported`);
  }
  const last = lastReports(reports, displayedNumber);
  const data = getDuration(last, displayedNumber);
  const barColors = getStatus(last, displayedNumber);

  return {
    labels: times(displayedNumber, constant('')),
    datasets: [
      {
        backgroundColor: setAllOpacity(barColors, 0.4),
        borderColor: setAllOpacity(barColors, 0.7),
        borderWidth: 2,
        hoverBackgroundColor: setAllOpacity(barColors, 0.6),
        hoverBorderColor: setAllOpacity(barColors, 1),
        data,
      },
    ],
  };
};

const formatTooltip = ({ datasetIndex, index }, { datasets }) => {
  const value = datasets[datasetIndex].data[index];
  return ` ${formatDurationString(value)}`;
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    xAxes: [
      {
        gridLines: {
          display: false,
        },
      },
    ],
    yAxes: [
      {
        display: true,
        ticks: {
          beginAtZero: true,
          callback: validateInteger,
        },
      },
    ],
  },
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

function RspecReportsBar(props) {
  const { edges, displayCount } = props;
  // map edges inside the component to prevent rerender;
  const reports = edges.map(edge => edge.node);

  if (isEmpty(reports)) {
    return <Fragment />;
  }

  return (
    <Bar
      data={getChartData(reports, displayCount)}
      options={options}
      height={350}
      redraw
    />
  );
}

RspecReportsBar.propTypes = {
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
  displayCount: PropTypes.number.isRequired,
};

export default React.memo(RspecReportsBar);
