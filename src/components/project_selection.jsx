import React from 'react';
import { PropTypes } from 'prop-types';
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
        <Line data={props.getChartData} options={props.chartOptions} />
      </div>
    </Link>
  );
}

ProjectSelection.propTypes = {
  description: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  getChartData: PropTypes.func.isRequired,
  chartOptions: PropTypes.shape({
    maintainAspectRatio: PropTypes.bool.isRequired,
    responsive: PropTypes.bool.isRequired,
    scales: PropTypes.shape({
      yAxes: PropTypes.array,
      xAxes: PropTypes.array,
    }).isRequired,
    tooltips: PropTypes.object,
  }).isRequired,
  style: PropTypes.shape({
    backgroundColor: PropTypes.string,
  }),
};

ProjectSelection.defaultProps = {
  style: {},
};
