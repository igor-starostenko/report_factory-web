import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Line as LineChart } from 'react-chartjs';
import { getUserReports } from '../actions/users_actions';
import { lastDays, formatDays, reportsPerDay, reportsCreatedDates,
         groupReportsByProjects, getColors, setOpacity  } from '../helpers/chart_helpers';

const parseDate = report => {
  return _.get(report, 'attributes.report.date.created_at');
}

const parseProjectName = report => {
  return _.get(report, 'attributes.report.project_name');
}

const projectReportsDatasets = (reports, dates) => {
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
			data: reportsPerDay(dates, reportsDates)
		});
    colorIndex === colorNames.length - 1 ? colorIndex = 0 : colorIndex++;
  });
  return datasets;
}

class UserReportsLineChart extends Component {
  componentDidMount() {
    const { reports } = this.props;
    if (!reports || _.isEmpty(reports)) {
      const { userId, xApiKey } = this.props;
      this.props.getUserReports(userId, xApiKey);
    }
  }

  render() {
    const dates = lastDays(10);
    const days = formatDays(dates);
    const reports = groupReportsByProjects(this.props.reports, parseProjectName);

    if (_.isEmpty(reports)) {
      return (<div className="loading">Loading</div>);
    }

    const chartData = {
    	labels: days,
    	datasets: projectReportsDatasets(reports, dates),
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
    }

    return (
      <div>
        <LineChart data={chartData} options={options} height="320" />
      </div>
    );
  }
}

const mapStateToProps = state  => ({
  reports: state.users.userReports.data,
  xApiKey: state.xApiKey,
});

export default connect(mapStateToProps, { getUserReports })(UserReportsLineChart);
