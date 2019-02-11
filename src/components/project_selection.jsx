import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import styles from './styles/ProjectSelection.css';

export default class ProjectSelection extends Component {
  render() {
    const { description, name, path } = this.props;
    return (
      <Link to={path} className={styles.project} style={this.props.style}>
        <div className={styles.projectHeader}>
          <div className={styles.projectTitle}>{name}</div>
          <p className={styles.projectDescription}>{description}</p>
        </div>
        <div className={styles.projectChart}>
          <Line
            data={this.props.getChartData}
            options={this.props.chartOptions}
          />
        </div>
      </Link>
    );
  }
}
