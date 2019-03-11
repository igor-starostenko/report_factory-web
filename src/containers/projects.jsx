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
import detailsStyles from './styles/Details.css';
import styles from './styles/Projects.css';

function dataForDays(reports, dates) {
  const reportsDates = reportsCreatedDates(reports, report => report.createdAt);
  return reportsPerDay(dates, reportsDates);
}

const colors = getColors();
const colorNames = Object.keys(colors);
const days = 7;

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
    return <Loading />;
  }

  let colorIndex = 0;
  return (
    <Fragment>
      <br />
      <div className={detailsStyles.detailsContainer}>
        <div className={detailsStyles.detailsHeader}>
          <div className={detailsStyles.detailsName}>Projects</div>
        </div>
        <div className={detailsStyles.detailsButtons}>
          {isAdmin && (
            <Button color="primary" fill="true" to="/project/new">
              Add a Project
            </Button>
          )}
        </div>
        <div className={styles.projectsList}>
          {Object.keys(projects).map(projectName => {
            const projectPath = `/projects/${projectName}`;
            const reportsCount = props.projects[projectName].reports.length;
            const description = `${reportsCount} reports for the last ${days} days`;
            const color = colors[colorNames[colorIndex]];
            /* eslint-disable no-unused-expressions */
            colorIndex === colorNames.length - 2
              ? (colorIndex = 0)
              : (colorIndex += 1);
            /* eslint-enable no-unused-expressions */
            return (
              <ProjectSelection
                chartOptions={chartOptions}
                description={description}
                getChartData={getChartData(projectName, color)}
                key={projectName}
                name={projectName}
                path={projectPath}
                style={{ backgroundColor: setOpacity(color, 0.05) }}
              />
            );
          })}
        </div>
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
