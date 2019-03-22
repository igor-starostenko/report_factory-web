import React from 'react';
import { PropTypes } from 'prop-types';
import map from 'lodash/map';
import { Link } from 'react-router-dom';
import { formatDuration, formatDateAgo } from '../helpers/format_helpers';
import styles from './styles/RspecReportDetails.css';

export default function RspecReportDetails(props) {
  const {
    date,
    summary,
    project_name: projectName,
    report_type: reportType,
  } = props.report.attributes;

  const projectLink = `/projects/${projectName}`;
  const details = {
    Type: reportType,
    Ran: `${formatDateAgo(new Date(date.created_at))} ago`,
    Duration: formatDuration(summary.duration),
    'Total Examples': summary.example_count,
    Pending: summary.pending_count,
    Failed: summary.failure_count,
  };

  return (
    <div className={styles.reportRowWrapper}>
      <div className={styles.reportDetailsRow}>
        <div className={styles.reportDetailsParam}>Project:</div>
        <Link to={projectLink} className={styles.reportDetailsValue}>
          {projectName}
        </Link>
      </div>
      {map(details, (value, key) => (
        <div className={styles.reportDetailsRow} key={key}>
          <div className={styles.reportDetailsParam}>{key}:</div>
          <div className={styles.reportDetailsValue}>{value}</div>
        </div>
      ))}
    </div>
  );
}

RspecReportDetails.propTypes = {
  report: PropTypes.shape({
    attributes: PropTypes.shape({
      report_type: PropTypes.string.isRequired,
      project_name: PropTypes.string.isRequired,
      date: PropTypes.shape({
        created_at: PropTypes.string.isRequired,
      }).isRequired,
      summary: PropTypes.shape({
        duration: PropTypes.number.isRequired,
        example_count: PropTypes.number.isRequired,
        pending_count: PropTypes.number.isRequired,
        failure_count: PropTypes.number.isRequired,
      }),
    }).isRequired,
  }).isRequired,
};
