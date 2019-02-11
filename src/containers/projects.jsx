import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Button, ProjectSelection } from '../components';
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

const dataForDays = (reports, dates) => {
  const reportsDates = reportsCreatedDates(reports, report => report.createdAt);
  return reportsPerDay(dates, reportsDates);
};

const colors = getColors();

const days = 7;

const formatLabels = daysArray => {
  const weekdays = formatDates(daysArray, { weekday: 'short' });
  return weekdays.map(weekday => weekday.toUpperCase());
};

const formatTooltip = ({ datasetIndex, index }, { datasets }) => {
  const dataset = datasets[datasetIndex];
  const number = dataset.data[index];
  if (number !== 1) {
    return ` ${number} reports`;
  }
  return ` 1 report`;
};

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

class Projects extends Component {
  constructor(props) {
    super(props);
    this.getChartData = this.getChartData.bind(this);
  }

  componentDidMount() {
    this.props.queryProjects(this.props.xApiKey, { lastDays: days });
  }

  getChartData(projectName, color) {
    return canvas => {
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createLinearGradient(0, 0, 0, 250);
      gradient.addColorStop(0, setOpacity(color, 0.6));
      gradient.addColorStop(1, setOpacity(color, 0));
      const { reports } = this.props.projects[projectName];
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

  renderProjects() {
    let colorIndex = 0;
    const colorNames = Object.keys(colors);
    return Object.keys(this.props.projects).map(projectName => {
      const projectPath = `/projects/${projectName}`;
      const reportsCount = this.props.projects[projectName].reports.length;
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
          getChartData={this.getChartData(projectName, color)}
          key={projectName}
          name={projectName}
          path={projectPath}
          style={{ backgroundColor: setOpacity(color, 0.05) }}
        />
      );
    });
  }

  render() {
    if (!this.props.loaded) {
      return <div className="loading">Loading...</div>;
    }

    return (
      <div>
        <br />
        <div className={detailsStyles.detailsContainer}>
          <div className={detailsStyles.detailsHeader}>
            <div className={detailsStyles.detailsName}>Projects</div>
          </div>
          <div className={detailsStyles.detailsButtons}>
            {this.props.isAdmin && (
              <Button
                color="primary"
                fill="true"
                text="Add a Project"
                to="/project/new"
              />
            )}
          </div>
          <div className={styles.projectsList}>{this.renderProjects()}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  projects: state.projects.list.data,
  loaded: state.projects.list.loaded,
  isAdmin: _.get(state.users.currentUser, 'data.attributes.type') === 'Admin',
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(
  mapStateToProps,
  { queryProjects },
)(Projects);
