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

// Ensure both data formats are supported
const fetchDetailsFromReport = (rspecReport) => {
  if (rspecReport.attributes) {
    return fetchFromAttributes(rspecReport);
  }
  return fetchFromConnection(rspecReport);
};

const fetchFromAttributes = (rspecReport) => {
  const {
    project_name: projectName,
    report_type: reportableType,
    date: { created_at: createdAt },
    summary: {
      duration,
      example_count: exampleCount,
      pending_count: pendingCount,
      failure_count: failureCount,
    },
  } = rspecReport.attributes;
  return {
    projectName, reportableType, createdAt, duration,
    exampleCount, pendingCount, failureCount,
  };
};

const fetchFromConnection = (rspecReport) => {
  const {
    report: { projectName, reportableType, createdAt },
    summary: { duration, exampleCount, pendingCount, failureCount },
  } = rspecReport;
  return {
    projectName, reportableType, createdAt, duration,
    exampleCount, pendingCount, failureCount,
  };
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
    return this.props.reports.map((report) => {
      const {
        projectName, reportableType, createdAt, duration,
        exampleCount, pendingCount, failureCount,
      } = fetchDetailsFromReport(report);
      const timeAgo = `${formatDateAgo(new Date(createdAt))} ago`;
      const status = statusName(failureCount);
      return (
        <Link
          to={`/reports/${report.id}`}
          className={`${styles.listRow} ${styles[status]}`}
          key={report.id}
        >
          <div className={styles.listNumber}># {report.id}</div>
          <div className={styles.listProject}>{projectName}</div>
          <div className={styles.listType}>{reportableType}</div>
          <div className={styles.listRan}>{timeAgo}</div>
          <div className={styles.listDuration}>{formatDuration(duration)}</div>
          <div className={styles.listTests}>{exampleCount}</div>
          <div className={styles.listPending}>{pendingCount}</div>
          <div className={styles.listFailed}>{failureCount}</div>
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
