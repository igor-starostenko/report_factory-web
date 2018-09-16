import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Button, ProjectSelection } from '../components';
import { queryProjects } from '../actions/projects_actions';
import { getColors, lastDays, formatDates, reportsPerDay, reportsCreatedDates,
  setOpacity, validateInteger } from '../helpers/chart_helpers';
import detailsStyles from './styles/Details.css';
import styles from './styles/Projects.css';

const dataForDays = (reports, dates) => {
  const reportsDates = reportsCreatedDates(reports, report => report.createdAt);
  return reportsPerDay(dates, reportsDates);
};

const colors = getColors();

const chartOptions = {
  animation: { duration: 0 },
  elements: { point: { radius: 0 } },
  layout: { padding: { top: 10, bottom: 10 } },
  legend: { display: false },
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    yAxes: [{
      ticks: {
         beginAtZero: true,
         callback: validateInteger,
      },
      gridLines: { drawBorder: false },
      display: false,
    }],
    xAxes: [{
      gridLines: { drawBorder: false },
      display: false,
    }]
  },
  tooltips: { enabled: false },
};

class Projects extends Component {
  constructor(props) {
    super(props);
    this.getChartData = this.getChartData.bind(this);
  }

  componentDidMount() {
    this.props.queryProjects(this.props.xApiKey, { lastDays: 3 });
  }

  getChartData(projectName) {
    const { reports } = this.props.projects[projectName];
    const data = dataForDays(reports, lastDays(3));
    return {
      labels: formatDates(lastDays(3)),
      datasets: [
        {
          borderColor: setOpacity(colors.grey, 1),
          fill: false,
          data,
        }
      ]
    }
  }

  renderProjects() {
    return Object.keys(this.props.projects).map((projectName) => {
      const projectPath = `/projects/${projectName}`;
      return (
        <ProjectSelection
          chartOptions={chartOptions}
          getChartData={this.getChartData}
          key={projectName}
          name={projectName}
          path={projectPath}
        />
      );
    });
  }

  render() {
    if (!this.props.loaded) {
      return (<div className="loading">Loading...</div>);
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
          <div className={styles.projectsList}>
            {this.renderProjects()}
          </div>
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

export default connect(mapStateToProps, { queryProjects })(Projects);
