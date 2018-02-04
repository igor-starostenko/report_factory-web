import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { LineChart } from './line_chart';
import { getReports } from '../actions/reports_actions';
import { lastDays, lastMonths, formatDates, reportsPerDay, reportsPerMonth,
         reportsCreatedDates } from '../helpers/chart_helpers';

const parseDate = report => {
  return _.get(report, 'attributes.date.created_at');
}

const dataForDays = (reports, dates) => {
  const reportsDates = reportsCreatedDates(reports, parseDate);
  return reportsPerDay(dates, reportsDates);
}

const dataForMonths = (reports, dates) => {
  const reportsDates = reportsCreatedDates(reports, parseDate);
  return reportsPerMonth(dates, reportsDates);
}


const getChartData = (reports, activeFilter) => {
  let units, data, dates;
  switch (activeFilter) {
    case 'Week':
      units = lastDays(8);
      dates = formatDates(units);
      data = dataForDays(reports, units);
      break;
    case 'Month':
      units = lastDays(32);
      dates = formatDates(units);
      data = dataForDays(reports, units);
      break;
    case 'Year':
      units = lastMonths(12);
      dates = formatDates(units, { month: 'short' });
      data = dataForMonths(reports, units);
      break;
  }

  return {
  	labels: dates,
  	datasets: [
  		{
  			fillColor: "rgba(255,212,91,0.4)",
  			strokeColor: "rgba(255,165,91,0.8)",
  			pointColor: "rgba(255,165,91,0.9)",
  			pointStrokeColor: "#fff",
  			pointHighlightFill: "rgba(255,165,91,1)",
  			data: data
  		}
  	]
  };
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  tooltipFillColor: "rgba(255,165,91,0.8)",
  tooltipTemplate: "<%= value %> report(s)",
}

class ReportsLineChart extends Component {
  componentDidMount() {
    const { reports } = this.props;
    if (!reports || _.isEmpty(reports)) {
      const { projectName, xApiKey } = this.props;
      this.props.getReports(projectName, xApiKey);
    }
  }

  render() {
    return (<LineChart getChartData={getChartData} options={chartOptions}
                       reports={this.props.reports} />);
  }
}

const mapStateToProps = (state, ownProps) => ({
  reports: state.reports[ownProps.projectName],
  xApiKey: state.xApiKey,
});

export default connect(mapStateToProps, { getReports })(ReportsLineChart);
