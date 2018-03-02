import React, { Component } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { formatDuration, formatDateAgo } from '../helpers/format_helpers';
import styles from './styles/RspecReportDetails.css';

export default class RspecReportDetails extends Component {
  static renderDetails(details) {
    return _.map(details, (value, key) => (
      <div className={styles.reportDetailsRow} key={key}>
        <div className={styles.reportDetailsParam}>{key}:</div>
        <div className={styles.reportDetailsValue}>{value}</div>
      </div>
    ));
  }

  render() {
    const { date, summary } = this.props.report.attributes;
    const projectName = this.props.report.attributes.project_name;
    const projectLink = `/projects/${projectName}`;
    const details = {
      Type: this.props.report.attributes.report_type,
      Ran: `${formatDateAgo(new Date(date.created_at))} ago`,
      Duration: formatDuration(summary.duration),
      'Total Examples': summary.example_count,
      Pending: summary.pending_count,
      Failed: summary.failure_count,
    };

    return (
      <div>
        <div className={styles.reportDetailsRow}>
          <div className={styles.reportDetailsParam}>Project:</div>
          <Link to={projectLink} className={styles.reportDetailsValue}>{projectName}</Link>
        </div>
        {this.constructor.renderDetails(details)}
      </div>
    );
  }
}
