import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
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
    const { description, path, name } = this.props;
    return (
      <Link to={path} className={this.getClassName()}>
        <Line
          data={this.props.getChartData(name)}
          options={this.props.chartOptions}
        />
        <div className={styles.projectBody}>
          <div className={this.getTitleClassName()}>{name}</div>
          <p className={styles.projectText}>{description}</p>
        </div>
      </Link>
    );
  }
}
