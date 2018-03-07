import React, { Component } from 'react';
import _ from 'lodash';
import { LineChart } from '../components';
import { lastDays, lastMonths, formatDates, reportsPerDay, reportsPerMonth, reportsCreatedDates,
  groupReportsByProjects, getColors, setOpacity } from '../helpers/chart_helpers';

const parseDate = report => _.get(report, 'attributes.report.date.created_at');
const parseProjectName = report => _.get(report, 'attributes.report.project_name');
const colors = getColors();

const projectReportsDatasets = (reports, dates, reportsPerDate) => {
  const datasets = [];
  let colorIndex = 0;
  const colorNames = Object.keys(colors);
  _.forIn(reports, (projectReports, projectName) => {
    const reportsDates = reportsCreatedDates(projectReports, parseDate);
    const color = _.get(colors, `${colorNames[colorIndex]}`);
    datasets.push({
      label: projectName,
      backgroundColor: setOpacity(color, 0.4),
      borderColor: setOpacity(color, 0.8),
      pointBackgroundColor: setOpacity(color, 0.9),
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: setOpacity(color, 1),
      pointHoverBorderColor: 'rgba(220,220,220,1)',
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
  tooltips: {
    bodyFontSize: 14,
    backgroundColor: 'rgba(255,165,91,0.8)',
  },
};

export default class UserReportsLineChart extends Component {
  render() {
    if (this.props.error) {
      return (<div className="loading">No reports submitted by this user yet</div>);
    }

    if (!this.props.userReports) {
      return (<div className="loading">Loading...</div>);
    }

    const reports = groupReportsByProjects(this.props.userReports, parseProjectName);

    return (
      <LineChart
        getChartData={getChartData}
        options={chartOptions}
        reports={reports}
      />
    );
  }
}
