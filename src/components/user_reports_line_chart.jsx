import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Line as LineChart } from 'react-chartjs';
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

class UserReportsLineChart extends Component {
  constructor(state) {
    super(state)
    this.state = { activeFilter: 'Week' }
  }

  componentDidMount() {
    const { reports } = this.props;
    if (!reports || _.isEmpty(reports)) {
      const { userId, xApiKey } = this.props;
      this.props.getUserReports(userId, xApiKey);
    }
  }

  setFilter(name) {
    this.setState({ activeFilter: name });
  }

  renderFilterItem(name) {
    const className = this.state.activeFilter === name ? "active" : '';
    return (
      <li className={className} onClick={this.setFilter.bind(this, name)}>
        <a>{name}</a>
      </li>
    );
  }

  render() {
    const reports = groupReportsByProjects(this.props.reports, parseProjectName);

    if (_.isEmpty(reports)) {
      return (<div className="loading">Loading</div>);
    }

    let units, dates, datasets;
    switch (this.state.activeFilter) {
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

    const chartData = {
    	labels: dates,
    	datasets: datasets,
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
    }

    return (
      <div>
        <LineChart data={chartData} options={options} height="320" />
        <div className="filters">
          <ul id="chart-pills" className="nav nav-pills ct-orange">
            {this.renderFilterItem('Year')}
            {this.renderFilterItem('Month')}
            {this.renderFilterItem('Week')}
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state  => ({
  reports: state.users.userReports.data,
  xApiKey: state.xApiKey,
});

export default connect(mapStateToProps, { getUserReports })(UserReportsLineChart);
