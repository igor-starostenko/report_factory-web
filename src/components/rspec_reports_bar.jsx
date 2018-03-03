import React, { Component } from 'react';
import _ from 'lodash';
import { Bar } from 'react-chartjs';
import { getColors, setOpacity } from '../helpers/chart_helpers';

const lastReports = (reports, number) => {
  const keys = _.takeRight(_.keys(reports), number);
  return _.map(keys, key => reports[key]);
};

const getDuration = (reports, number = 10) => {
  if (_.isEmpty(reports)) {
    return _.times(number, _.constant(0));
  }
  return _.map(reports, report => report.attributes.summary.duration);
};

const getStatus = (reports, number = 10) => {
  const colors = getColors();
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

const setAllOpacity = (colors, opacity = 1) => _.map(colors, c => setOpacity(c, opacity));

const getChartData = (reports, displayedNumber) => {
  if (typeof displayedNumber !== 'number') {
    throw new Error(`Filter ${displayedNumber} is not supported`);
  }
  const last = lastReports(reports, displayedNumber);
  const data = getDuration(last, displayedNumber);
  const colors = getStatus(last, displayedNumber);

  return {
    labels: _.times(displayedNumber, _.constant('')),
    datasets: [
      {
        fillColor: setAllOpacity(colors, 0.4),
        strokeColor: setAllOpacity(colors, 0.7),
        highlightFill: setAllOpacity(colors, 0.6),
        highlightStroke: setAllOpacity(colors, 1),
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
  render() {
    return (<Bar
      data={getChartData(this.props.reports, this.props.displayCount)}
      options={options}
      height="350"
      redraw
    />);
  }
}
