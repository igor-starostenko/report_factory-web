import React from 'react';
import { PropTypes } from 'prop-types';
import { LineChart } from '.';
import {
  getColors,
  lastDays,
  lastMonths,
  formatDates,
  reportsPerDay,
  reportsPerMonth,
  reportsCreatedDates,
  setOpacity,
  validateInteger,
} from '../helpers/chart_helpers';

const filterMapping = {
  Year: {},
  Month: { lastDays: 32 },
  Week: { lastDays: 8 },
};

const parseDate = report => report.createdAt;

const dataForDays = (reports, dates) => {
  const reportsDates = reportsCreatedDates(reports, parseDate);
  return reportsPerDay(dates, reportsDates);
};

const dataForMonths = (reports, dates) => {
  const reportsDates = reportsCreatedDates(reports, parseDate);
  return reportsPerMonth(dates, reportsDates);
};

const filterByStatus = (reports, status) => {
  return reports.filter(report => {
    return report.status === status;
  });
};

const colors = getColors();

const chartData = {
  Week: () => {
    const units = lastDays(filterMapping.Week.lastDays);
    return {
      units,
      labels: formatDates(units),
      dataForDate: dataForDays,
    };
  },
  Month: () => {
    const units = lastDays(filterMapping.Month.lastDays);
    return {
      units,
      labels: formatDates(units),
      dataForDate: dataForDays,
    };
  },
  Year: () => {
    const units = lastMonths(filterMapping.Year.lastMonths || 12);
    return {
      units,
      labels: formatDates(units, { month: 'short' }),
      dataForDate: dataForMonths,
    };
  },
};

const fetchChartData = (reports, activeFilter) => {
  const { units, labels, dataForDate } = chartData[activeFilter]();
  const failedReports = filterByStatus(reports, 'failed');
  const passedReports = filterByStatus(reports, 'passed');
  const failedData = dataForDate(failedReports, units);
  const passedData = dataForDate(passedReports, units);

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
        data: passedData,
      },
    ],
  };
};

const formatTooltip = ({ datasetIndex, index }, { datasets }) => {
  const dataset = datasets[datasetIndex];
  const number = dataset.data[index];
  const { label } = dataset;
  if (number !== 1) {
    return ` ${number} ${label} reports`;
  }
  return ` 1 ${label} report`;
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    yAxes: [
      {
        stacked: true,
        ticks: {
          beginAtZero: true,
          callback: validateInteger,
        },
      },
    ],
  },
  tooltips: {
    callbacks: {
      label: formatTooltip,
    },
    itemSort: (a, b) => (a.datasetIndex > b.datasetIndex ? -1 : 1),
    mode: 'point',
    bodyFontSize: 14,
    backgroundColor: 'rgba(255,165,91,0.8)',
  },
  legend: {
    reverse: true,
  },
};

export default function ReportsLineChart(props) {
  const {
    reports,
    filters: { filterName },
    totalCount,
  } = props;

  function getChartData() {
    return fetchChartData(reports, filterName);
  }

  if (!totalCount || totalCount === 0) {
    return (
      <div className="loading">No reports submitted for this project yet.</div>
    );
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

ReportsLineChart.propTypes = {
  reports: PropTypes.arrayOf(PropTypes.object),
  filters: PropTypes.shape({
    filterName: PropTypes.string.isRequired,
  }).isRequired,
  filterAction: PropTypes.func.isRequired,
  totalCount: PropTypes.number,
};

ReportsLineChart.defaultProps = {
  reports: [],
  totalCount: 0,
};
