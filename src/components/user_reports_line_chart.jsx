import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { LineChart } from './line_chart'
import { getUserReports } from '../actions/users_actions';
import { lastDays, lastMonths, formatDates, reportsPerDay, reportsPerMonth, reportsCreatedDates,
         groupReportsByProjects, getColors, setOpacity  } from '../helpers/chart_helpers';

const parseDate = report => {
  return _.get(report, 'attributes.report.date.created_at');
}

const parseProjectName = report => {
  return _.get(report, 'attributes.report.project_name');
}

const projectReportsDatasets = (reports, dates, reportsPerDate) => {
  let datasets = [];
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
			pointStrokeColor: "#fff",
			pointHighlightFill: setOpacity(color, 1),
			pointHighlightStroke: "rgba(220,220,220,1)",
			data: reportsPerDate(dates, reportsDates)
		});
    colorIndex === colorNames.length - 1 ? colorIndex = 0 : colorIndex++;
  });
  return datasets;
}

const getChartData = (reports, activeFilter) => {
  let units, dates, datasets;
  switch (activeFilter) {
    case 'Week':
      units = lastDays(8);
      dates = formatDates(units);
      datasets = projectReportsDatasets(reports, units, reportsPerDay);
      break;
    case 'Month':
      units = lastDays(32);
      dates = formatDates(units);
      datasets = projectReportsDatasets(reports, units, reportsPerDay);
      break;
    case 'Year':
      units = lastMonths(12);
      dates = formatDates(units, { month: 'short' });
      datasets = projectReportsDatasets(reports, units, reportsPerMonth);
      break;
  }

  return {
  	labels: dates,
  	datasets: datasets,
  };
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
}

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
    return (<LineChart getChartData={getChartData} options={chartOptions}
                       reports={reports} />);
  }
}

const mapStateToProps = state  => ({
  userReports: state.users.userReports.data,
  userId: _.get(state.users.currentUser, 'data.id'),
  error: state.users.userReports.error,
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, { getUserReports })(UserReportsLineChart);
