import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import _ from 'lodash';
import styles from './styles/RspecReportsList.css';

const formatDateAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return `${interval} years`;
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return `${interval} months`;
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return `${interval} days`;
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return `${interval} hours`;
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return `${interval} minutes`;
  }
  return `${Math.floor(seconds)} seconds`;
};

/* eslint-disable arrow-body-style */
const formatDuration = (seconds) => {
  return new Date(parseInt(seconds * 1000, 10))
    .toISOString().substr(14, 5);
};

const statusName = (failureCount) => {
  if (failureCount > 0) {
    return 'failedTest';
  }
  return 'passedTest';
};

export default class RspecReportsList extends Component {
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
        <li className={`${styles.listRow} ${styles[status]}`} key={report.id}>
          <div className={styles.listNumber}># {report.id}</div>
          <div className={styles.listProject}>{report.attributes.project_name}</div>
          <div className={styles.listType}>{report.attributes.report_type}</div>
          <div className={styles.listRan}>{created}</div>
          <div className={styles.listDuration}>{duration}</div>
          <div className={styles.listTests}>{summary.example_count}</div>
          <div className={styles.listPending}>{summary.pending_count}</div>
          <div className={styles.listFailed}>{summary.failure_count}</div>
        </li>
      );
    });
  }

  render() {
    if (!this.props.reports) {
      return (<div className="loading">Loading...</div>);
    }

    if (_.isEmpty(this.props.reports)) {
      return (<div className="loading">No Reports have been submitted yet.</div>);
    }

    return (
      <div>
        <br />
        <div className={styles.reportsList}>
          {this.constructor.renderHeader()}
          <ul className={styles.listGroup}>
            {this.renderReports()}
          </ul>
        </div>
      </div>
    );
  }
}
