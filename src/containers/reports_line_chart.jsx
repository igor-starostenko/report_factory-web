import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { LineChart } from '../components';
import { getReports } from '../actions/reports_actions';
import { lastDays, lastMonths, formatDates, reportsPerDay, reportsPerMonth,
  reportsCreatedDates } from '../helpers/chart_helpers';

const parseDate = report => _.get(report, 'attributes.date.created_at');

const dataForDays = (reports, dates) => {
  const reportsDates = reportsCreatedDates(reports, parseDate);
  return reportsPerDay(dates, reportsDates);
};

const dataForMonths = (reports, dates) => {
  const reportsDates = reportsCreatedDates(reports, parseDate);
  return reportsPerMonth(dates, reportsDates);
};

const getChartData = (reports, activeFilter) => {
  let units;
  let labels;
  let data;
  switch (activeFilter) {
    case 'Week':
      units = lastDays(8);
      labels = formatDates(units);
      data = dataForDays(reports, units);
      break;
    case 'Month':
      units = lastDays(32);
      labels = formatDates(units);
      data = dataForDays(reports, units);
      break;
    case 'Year':
      units = lastMonths(12);
      labels = formatDates(units, { month: 'short' });
      data = dataForMonths(reports, units);
      break;
    default: throw new Error(`Filter ${activeFilter} not supported`);
  }

  return {
    labels,
    datasets: [
      {
        fillColor: 'rgba(255,212,91,0.4)',
        strokeColor: 'rgba(255,165,91,0.8)',
        pointColor: 'rgba(255,165,91,0.9)',
        pointStrokeColor: '#fff',
        pointHighlightFill: 'rgba(255,165,91,1)',
        data,
      },
    ],
  };
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  tooltipFillColor: 'rgba(255,165,91,0.8)',
  tooltipTemplate: '<%= value %> report(s)',
};

class ReportsLineChart extends Component {
  componentDidMount() {
    const { reports } = this.props;
    if (!reports || _.isEmpty(reports)) {
      const { projectName, xApiKey } = this.props;
      this.props.getReports(projectName, xApiKey);
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
  reports: state.reports[ownProps.projectName],
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, { getReports })(ReportsLineChart);
