import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import styles from './styles/ProjectSelection.css';

export default function ProjectSelection(props) {
  const { description, name, path } = props;
  return (
    <Link to={path} className={styles.project} style={props.style}>
      <div className={styles.projectHeader}>
        <div className={styles.projectTitle}>{name}</div>
        <p className={styles.projectDescription}>{description}</p>
      </div>
      <div className={styles.projectChart}>
        <Line
          data={props.getChartData}
          options={props.chartOptions}
        />
      </div>
    </Link>
  );
}
