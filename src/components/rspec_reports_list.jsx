import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { formatDuration, formatDateAgo } from '../helpers/format_helpers';
import styles from './styles/RspecReportsList.css';

const statusName = (failureCount) => {
  if (failureCount > 0) {
    return 'failedTest';
  }
  return 'passedTest';
};

export default class RspecReportsList extends Component {
  /* eslint-disable arrow-body-style */
  static renderHeaderItems(names) {
    return _.map(names, (name) => {
      return (<div className={styles[`list${name}`]} key={name}>{name}</div>);
    });
  }
  /* eslint-enable arrow-body-style */

  static renderHeader() {
    const items = ['Number', 'Project', 'Type', 'Ran', 'Duration',
      'Tests', 'Pending', 'Failed'];
    return (
      <div className={styles.headerRow}>
        {this.renderHeaderItems(items)}
      </div>
    );
  }

  renderReports() {
    return _.map(this.props.reports, (report) => {
      const { date, summary } = report.attributes;
      const duration = formatDuration(summary.duration);
      const created = formatDateAgo(new Date(date.created_at));
      const status = statusName(summary.failure_count);
      return (
        <Link
          to={`/reports/${report.id}`}
          className={`${styles.listRow} ${styles[status]}`}
          key={report.id}
        >
          <div className={styles.listNumber}># {report.id}</div>
          <div className={styles.listProject}>{report.attributes.project_name}</div>
          <div className={styles.listType}>{report.attributes.report_type}</div>
          <div className={styles.listRan}>{created}</div>
          <div className={styles.listDuration}>{duration}</div>
          <div className={styles.listTests}>{summary.example_count}</div>
          <div className={styles.listPending}>{summary.pending_count}</div>
          <div className={styles.listFailed}>{summary.failure_count}</div>
        </Link>
      );
    });
  }

  render() {
    if (!this.props.reports) {
      return (<div className="loading">Loading...</div>);
    }

    if (_.isEmpty(this.props.reports)) {
      return (<div className="loading">No reports found.</div>);
    }

    return (
      <div>
        <br />
        <div className={styles.reportsList}>
          {this.constructor.renderHeader()}
          <div className={styles.listGroup}>
            {this.renderReports()}
          </div>
        </div>
      </div>
    );
  }
}
