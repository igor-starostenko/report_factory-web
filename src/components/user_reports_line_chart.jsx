import React from 'react';
import { PropTypes } from 'prop-types';
import { LineChart, Loading } from '.';
import {
  lastDays,
  lastMonths,
  formatDates,
  reportsPerDay,
  reportsPerMonth,
  reportsCreatedDates,
  groupReportsByProjects,
  getColors,
  setOpacity,
  validateInteger,
} from '../helpers/chart_helpers';

const parseDate = report => report.createdAt;
const parseProjectName = report => report.projectName;
const colors = getColors();

const filterMapping = {
  Year: {},
  Month: { lastDays: 32 },
  Week: { lastDays: 8 },
};

const projectReportsDatasets = (reports, dates, reportsPerDate) => {
  let colorIndex = 0;
  const colorNames = Object.keys(colors);
  return Object.keys(reports).map(projectName => {
    const projectReports = reports[projectName];
    const reportsDates = reportsCreatedDates(projectReports, parseDate);
    const color = colors[colorNames[colorIndex]];
    colorIndex = colorIndex === colorNames.length - 1 ? 0 : colorIndex + 1;
    return {
      label: projectName,
      backgroundColor: setOpacity(color, 0.4),
      borderColor: setOpacity(color, 0.8),
      pointBackgroundColor: setOpacity(color, 0.9),
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: setOpacity(color, 1),
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      data: reportsPerDate(dates, reportsDates),
    };
  });
};

const chartData = {
  Week: () => {
    const units = lastDays(filterMapping.Week.lastDays);
    return {
      units,
      labels: formatDates(units),
      dataForDate: reportsPerDay,
    };
  },
  Month: () => {
    const units = lastDays(filterMapping.Month.lastDays);
    return {
      units,
      labels: formatDates(units),
      dataForDate: reportsPerDay,
    };
  },
  Year: () => {
    const units = lastMonths(filterMapping.Year.lastMonths || 12);
    return {
      units,
      labels: formatDates(units, { month: 'short' }),
      dataForDate: reportsPerMonth,
    };
  },
};

const fetchChartData = (reports, activeFilter) => {
  const { units, labels, dataForDate } = chartData[activeFilter]();
  const datasets = projectReportsDatasets(reports, units, dataForDate);
  return { labels, datasets };
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  tooltips: {
    bodyFontSize: 14,
    backgroundColor: 'rgba(255,165,91,0.8)',
  },
  scales: {
    yAxes: [
      {
        display: true,
        ticks: {
          beginAtZero: true,
          callback: validateInteger,
        },
      },
    ],
  },
};

export default function UserReportsLineChart(props) {
  const {
    userReports,
    filters: { filterName },
    totalCount,
  } = props;

  function getChartData() {
    const reports = groupReportsByProjects(userReports, parseProjectName);
    return fetchChartData(reports, filterName);
  }

  if (!userReports) {
    return <Loading />;
  }

  if (!totalCount || totalCount === 0) {
    return <div className="loading">No reports submitted by this user yet</div>;
  }

  return (
    <LineChart
      activeFilter={filterName}
      filterAction={props.filterAction}
      filterMapping={filterMapping}
      getChartData={getChartData}
      options={chartOptions}
    />
  );
}

UserReportsLineChart.propTypes = {
  userReports: PropTypes.arrayOf(PropTypes.object),
  filters: PropTypes.shape({
    filterName: PropTypes.string.isRequired,
  }).isRequired,
  totalCount: PropTypes.number,
  filterAction: PropTypes.func.isRequired,
};

UserReportsLineChart.defaultProps = {
  totalCount: 0,
  userReports: null,
};
