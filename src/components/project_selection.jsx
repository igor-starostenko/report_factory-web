import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import { ReportsLineCharts } from '../components';
// import { firstScenarioColumn, secondScenarioColumn } from '../helpers/scenarios_helpers';
import styles from './styles/ProjectSelection.css';

export default class ProjectSelection extends Component {
  getClassName() {
    if (this.props.newProject) {
      return `${styles.project} ${styles.newProject}`;
    }
    return styles.project;
  }

  getTitleClassName() {
    if (this.props.newProject) {
      return styles.newProjectTitle;
    }
    return styles.projectTitle;
  }

  render() {
    const { path, title, description } = this.props;
    return (
      <Link to={path} className={this.getClassName()}>
        <div className={styles.projectBody}>
          <div className={this.getTitleClassName()}>{title}</div>
          <p className={styles.projectText}>{description}</p>
        </div>
      </Link>
    );
  }
}
