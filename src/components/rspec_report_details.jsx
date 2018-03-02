import React, { Component } from 'react';
import _ from 'lodash';
import { formatDuration, formatDateAgo } from '../helpers/format_helpers';
import styles from './styles/RspecReportDetails.css';

// const statusName = (failureCount) => {
//   if (failureCount > 0) {
//     return 'failedTest';
//   }
//   return 'passedTest';
// };

export default class RspecReportDetails extends Component {
  render() {
    if (!this.props.report) {
      return (<div className="loading">Loading...</div>);
    }

    const { date, summary } = this.props.report.attributes;
    // const status = statusName(summary.failure_count);
    const details = {
      Project: this.props.report.attributes.project_name,
      Type: this.props.report.attributes.report_type,
      Ran: `${formatDateAgo(new Date(date.created_at))} ago`,
      Duration: formatDuration(summary.duration),
      'Total Count': summary.example_count,
      Pending: summary.pending_count,
      Failed: summary.failure_count,
    };

    return _.map(details, (value, key) => (
      <div className={styles.reportDetailsRow} key={key}>
        <div className={styles.reportDetailsParam}>{key}:</div>
        <div className={styles.reportDetailsValue}>{value}</div>
      </div>
    ));
  }
}
