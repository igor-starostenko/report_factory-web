import React, { useEffect, Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import getValue from 'lodash/get';
import { Button, Loading, ProjectSelection } from '../components';
import { queryProjects } from '../actions/projects_actions';
import {
  getColors,
  lastDays,
  formatDates,
  reportsPerDay,
  reportsCreatedDates,
  setOpacity,
  validatePositive,
} from '../helpers/chart_helpers';
import { pluralize } from '../helpers/format_helpers';
import detailsStyles from './styles/Details.css';
import styles from './styles/Projects.css';

function dataForDays(reports, dates) {
  const reportsDates = reportsCreatedDates(reports, report => report.createdAt);
  return reportsPerDay(dates, reportsDates);
}

const colors = getColors();
const colorNames = Object.keys(colors);
let colorIndex = 0;
const days = 7;

function getColor() {
  const color = colors[colorNames[colorIndex]];
  colorIndex = colorIndex === colorNames.length - 2 ? 0 : colorIndex + 1;
  return color;
}

function getDescription(count) {
  return `${pluralize(count, 'report')} for the last ${pluralize(days, 'day')}`;
}

function formatLabels(daysArray) {
  const weekdays = formatDates(daysArray, { weekday: 'short' });
  return weekdays.map(weekday => weekday.toUpperCase());
}

function formatTooltip({ datasetIndex, index }, { datasets }) {
  const dataset = datasets[datasetIndex];
  const number = dataset.data[index];
  if (number !== 1) {
    return ` ${number} reports`;
  }
  return ` 1 report`;
}

const chartOptions = {
  animation: { duration: 0 },
  elements: { point: { radius: 2 } },
  legend: { display: false },
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          callback: validatePositive,
          fontColor: 'rgba(0, 0, 0, 0.3)',
        },
        gridLines: {
          drawBorder: false,
          color: 'transparent',
          zeroLineColor: 'transparent',
        },
      },
    ],
    xAxes: [
      {
        gridLines: {
          drawBorder: false,
          color: setOpacity(colors.grey, 0.5),
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
};

function Projects(props) {
  const { xApiKey, projects, isAdmin, loaded } = props;

  useEffect(() => {
    props.queryProjects(xApiKey, { lastDays: days });
  }, []);

  function getChartData(projectName, color) {
    return canvas => {
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createLinearGradient(0, 0, 0, 250);
      gradient.addColorStop(0, setOpacity(color, 0.6));
      gradient.addColorStop(1, setOpacity(color, 0));
      const { reports } = projects[projectName];
      const lastDates = lastDays(days);
      return {
        labels: formatLabels(lastDates),
        datasets: [
          {
            backgroundColor: gradient,
            borderColor: setOpacity(color, 0.3),
            fill: 'origin',
            pointBackgroundColor: setOpacity(color, 0.9),
            pointHoverBackgroundColor: color,
            data: dataForDays(reports, lastDates),
          },
        ],
      };
    };
  }

  if (!loaded) {
    return <Loading page />;
  }

  colorIndex = 0;
  const projectsList = Object.entries(projects);

  return (
    <Fragment>
      <br />
      <div className={detailsStyles.detailsContainer}>
        <div className={detailsStyles.detailsHeader}>
          <h1 className={detailsStyles.detailsName}>Projects</h1>
        </div>
        <div className={detailsStyles.detailsButtons}>
          {isAdmin && (
            <Button color="primary" fill="true" to="/project/new">
              Add a Project
            </Button>
          )}
        </div>
        {projectsList.length > 0 ? (
          <div className={styles.projectsList}>
            {projectsList.map(([projectName, project]) => {
              const color = getColor();
              return (
                <ProjectSelection
                  chartOptions={chartOptions}
                  description={getDescription(project.reports.length)}
                  getChartData={getChartData(projectName, color)}
                  key={projectName}
                  name={projectName}
                  path={`/projects/${projectName}`}
                  style={{ backgroundColor: setOpacity(color, 0.05) }}
                />
              );
            })}
          </div>
        ) : (
          <div className={`${styles.emptyList} loading`}>
            You haven&#39;t created any projects yet.
          </div>
        )}
      </div>
    </Fragment>
  );
}

Projects.propTypes = {
  xApiKey: PropTypes.string.isRequired,
  projects: PropTypes.shape({
    [PropTypes.string]: PropTypes.shape({
      reports: PropTypes.array.isRequired,
    }),
  }).isRequired,
  isAdmin: PropTypes.bool.isRequired,
  loaded: PropTypes.bool.isRequired,
  queryProjects: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  projects: state.projects.list.data,
  loaded: state.projects.list.loaded,
  isAdmin:
    getValue(state.users.currentUser, 'data.attributes.type') === 'Admin',
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(
  mapStateToProps,
  { queryProjects },
)(Projects);
