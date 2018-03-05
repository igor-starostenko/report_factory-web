import React, { Component } from 'react';
import _ from 'lodash';
import { Bar } from 'react-chartjs';
import { getColors, setOpacity } from '../helpers/chart_helpers';

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
  return _.map(reports, report => report.attributes.summary.duration);
};

const getStatus = (reports, number = 10) => {
  if (_.isEmpty(reports)) {
    return _.times(number, _.constant(colors.grey));
  }
  return _.map(reports, (report) => {
    const failureCount = report.attributes.summary.failure_count;
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
        fillColor: setAllOpacity(barColors, 0.4),
        strokeColor: setAllOpacity(barColors, 0.7),
        highlightFill: setAllOpacity(barColors, 0.6),
        highlightStroke: setAllOpacity(barColors, 1),
        data,
      },
    ],
  };
};

const options = {
  barStrokeWidth: 2,
  barValueSpacing: 3,
  scaleLineWidth: 3,
  scaleFontFamily: "'Helvetica Neue'",
  scaleFontSize: 15,
  scaleShowVerticalLines: false,
  responsive: true,
  maintainAspectRatio: false,
  tooltipFillColor: 'rgba(255,165,91,0.8)',
  tooltipTemplate: '<%= value %> seconds',
};

export default class RspecReportsBar extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.reports !== nextProps.reports;
  }

  render() {
    if (_.isEmpty(this.props.reports)) {
      return (<div />);
    }

    return (<Bar
      data={getChartData(this.props.reports, this.props.displayCount)}
      options={options}
      height="350"
      redraw
    />);
  }
}
