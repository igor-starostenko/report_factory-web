import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import LineChart from './line_chart';
import { getUserReports } from '../actions/users_actions';
import { lastDays, lastMonths, formatDates, reportsPerDay, reportsPerMonth, reportsCreatedDates,
  groupReportsByProjects, getColors, setOpacity } from '../helpers/chart_helpers';

const parseDate = report => _.get(report, 'attributes.report.date.created_at');
const parseProjectName = report => _.get(report, 'attributes.report.project_name');

const projectReportsDatasets = (reports, dates, reportsPerDate) => {
  const datasets = [];
  let colorIndex = 0;
  const colors = getColors();
  const colorNames = Object.keys(colors);
  _.forIn(reports, (projectReports, projectName) => {
    const reportsDates = reportsCreatedDates(projectReports, parseDate);
    const color = _.get(colors, `${colorNames[colorIndex]}`);
    datasets.push({
      label: projectName,
      fillColor: setOpacity(color, 0.4),
      strokeColor: setOpacity(color, 0.8),
      pointColor: setOpacity(color, 0.9),
      pointStrokeColor: '#fff',
      pointHighlightFill: setOpacity(color, 1),
      pointHighlightStroke: 'rgba(220,220,220,1)',
      data: reportsPerDate(dates, reportsDates),
    });
    /* eslint-disable no-unused-expressions */
    colorIndex === colorNames.length - 1 ? colorIndex = 0 : colorIndex += 1;
    /* eslint-enable no-unused-expressions */
  });
  return datasets;
};

const getChartData = (reports, activeFilter) => {
  let units;
  let labels;
  let datasets;
  switch (activeFilter) {
    case 'Week':
      units = lastDays(8);
      labels = formatDates(units);
      datasets = projectReportsDatasets(reports, units, reportsPerDay);
      break;
    case 'Month':
      units = lastDays(32);
      labels = formatDates(units);
      datasets = projectReportsDatasets(reports, units, reportsPerDay);
      break;
    case 'Year':
      units = lastMonths(12);
      labels = formatDates(units, { month: 'short' });
      datasets = projectReportsDatasets(reports, units, reportsPerMonth);
      break;
    default: throw new Error(`Filter ${activeFilter} not supported`);
  }

  return { labels, datasets };
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

class UserReportsLineChart extends Component {
  componentDidMount() {
    const { userReports, userId } = this.props;
    if (!_.get(userReports, userId)) {
      this.props.getUserReports(userId, this.props.xApiKey);
    }
  }

  render() {
    if (!this.props.userReports) {
      return (<div className="loading">Loading...</div>);
    }

    if (this.props.error) {
      return (<div className="loading">No reports submitted by this user yet</div>);
    }

    let reports = this.props.userReports[this.props.userId];
    reports = groupReportsByProjects(reports, parseProjectName);

    return (
      <LineChart
        getChartData={getChartData}
        options={chartOptions}
        reports={reports}
      />
    );
  }
}

const mapStateToProps = state => ({
  userReports: state.users.userReports.data,
  error: state.users.userReports.error,
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, { getUserReports })(UserReportsLineChart);
