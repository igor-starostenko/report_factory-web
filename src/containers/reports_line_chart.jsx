import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { LineChart } from '../components';
import { getProjectReports } from '../actions/project_reports_actions';
import { getColors, lastDays, lastMonths, formatDates, reportsPerDay,
  reportsPerMonth, reportsCreatedDates, setOpacity, validateInteger } from '../helpers/chart_helpers';

const parseDate = report => _.get(report, 'attributes.date.created_at');

const dataForDays = (reports, dates) => {
  const reportsDates = reportsCreatedDates(reports, parseDate);
  return reportsPerDay(dates, reportsDates);
};

const dataForMonths = (reports, dates) => {
  const reportsDates = reportsCreatedDates(reports, parseDate);
  return reportsPerMonth(dates, reportsDates);
};

const filterByStatus = (reports, status) => {
  return _.filter(reports, (report) => {
    return _.get(report, 'attributes.status') === status;
  });
};

const colors = getColors();

const getChartData = (reports, activeFilter) => {
  let units;
  let labels;
  let totalData;
  let failedReports;
  let failedData;
  switch (activeFilter) {
    case 'Week':
      units = lastDays(8);
      labels = formatDates(units);
      totalData = dataForDays(reports, units);
      failedReports = filterByStatus(reports, 'failed');
      failedData = dataForDays(failedReports, units);
      break;
    case 'Month':
      units = lastDays(32);
      labels = formatDates(units);
      totalData = dataForDays(reports, units);
      failedReports = filterByStatus(reports, 'failed');
      failedData = dataForDays(failedReports, units);
      break;
    case 'Year':
      units = lastMonths(12);
      labels = formatDates(units, { month: 'short' });
      totalData = dataForMonths(reports, units);
      failedReports = filterByStatus(reports, 'failed');
      failedData = dataForMonths(failedReports, units);
      break;
    default: throw new Error(`Filter ${activeFilter} not supported`);
  }

  return {
    labels,
    datasets: [
      {
        label: 'Failed',
        fill: 'origin',
        backgroundColor: setOpacity(colors.red, 0.4),
        borderColor: setOpacity(colors.red, 0.8),
        pointBackgroundColor: setOpacity(colors.red, 0.9),
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: colors.red,
        data: failedData,
      },
      {
        label: 'Passed',
        fill: '-1',
        backgroundColor: setOpacity(colors.green, 0.4),
        borderColor: setOpacity(colors.green, 0.8),
        pointBackgroundColor: setOpacity(colors.green, 0.9),
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: colors.green,
        data: totalData,
      },
    ],
  };
};

const formatTooltip = ({ datasetIndex, index }, { datasets }) => {
  const dataset = datasets[datasetIndex];
  const number = dataset.data[index];
  const label = dataset.label;
  if (number !== 1) {
    return ` ${number} ${label} reports`;
  }
  return ` 1 ${label} report`;
};

const ensureNotFailed = ({ dataasetIndex, index }, { datasets }) => {
  const dataset = datasets[datasetIndex];
  const number = dataset.data[index];
  const label = dataset.label;
  console.log(label);
  if (number === 0 && label === 'Failed') {
    return false;
  }
  return true;
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    yAxes: [{
      stacked: true,
      ticks: {
         beginAtZero: true,
         callback: validateInteger,
       },
    }],
  },
  tooltips: {
    callbacks: {
      enabled: ensureNotFailed,
      label: formatTooltip,
    },
    mode: 'point',
    bodyFontSize: 14,
    backgroundColor: 'rgba(255,165,91,0.8)',
  },
  legend: {
    reverse: true,
  }
};

class ReportsLineChart extends Component {
  componentDidMount() {
    const { reports } = this.props;
    if (!reports || _.isEmpty(reports)) {
      const { projectName, xApiKey } = this.props;
      this.props.getProjectReports(projectName, xApiKey);
    }
  }

  render() {
    return (
      <LineChart
        getChartData={getChartData}
        options={chartOptions}
        reports={this.props.reports}
      />);
  }
}

const mapStateToProps = (state, ownProps) => ({
  reports: state.projectReports.reportsList[ownProps.projectName],
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, { getProjectReports })(ReportsLineChart);
