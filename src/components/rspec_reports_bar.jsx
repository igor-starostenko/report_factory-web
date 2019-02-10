import React, { Component } from 'react';
import _ from 'lodash';
import { Bar } from 'react-chartjs-2';
import { formatDurationString } from '../helpers/format_helpers';
import {
  getColors,
  setOpacity,
  validateInteger,
} from '../helpers/chart_helpers';

/* eslint-disable arrow-body-style */
const lastReports = (reports, number) => {
  return _.reverse(_.takeRight(reports, number));
};
/* eslint-enable arrow-body-style */

const colors = getColors();

const getDuration = (reports, number = 10) => {
  if (_.isEmpty(reports)) {
    return _.times(number, _.constant(0));
  }
  return reports.map(report => report.summary.duration);
};

const getStatus = (reports, number = 10) => {
  if (_.isEmpty(reports)) {
    return _.times(number, _.constant(colors.grey));
  }
  return reports.map(report => {
    const { failureCount } = report.summary;
    if (failureCount > 0) {
      return colors.red;
    }
    return colors.green;
  });
};

/* eslint-disable arrow-body-style */
const setAllOpacity = (barColors, opacity = 1) => {
  return _.map(barColors, c => setOpacity(c, opacity));
};
/* eslint-enable arrow-body-style */

const getChartData = (reports, displayedNumber) => {
  if (typeof displayedNumber !== 'number') {
    throw new Error(`Filter ${displayedNumber} is not supported`);
  }
  const last = lastReports(reports, displayedNumber);
  const data = getDuration(last, displayedNumber);
  const barColors = getStatus(last, displayedNumber);

  return {
    labels: _.times(displayedNumber, _.constant('')),
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

export default class RspecReportsBar extends Component {
  shouldComponentUpdate(nextProps) {
    return !_.isEqual(this.props.reports, nextProps.reports);
  }

  render() {
    if (_.isEmpty(this.props.reports)) {
      return <div />;
    }

    return (
      <Bar
        data={getChartData(this.props.reports, this.props.displayCount)}
        options={options}
        height={350}
        redraw
      />
    );
  }
}
