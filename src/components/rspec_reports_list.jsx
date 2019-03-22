import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import { formatDuration, formatDateAgo } from '../helpers/format_helpers';
import styles from './styles/RspecReportsList.css';

const statusName = failureCount => {
  return failureCount > 0 ? 'failedTest' : 'passedTest';
};

const headerItems = [
  'Number',
  'Project',
  'Type',
  'Ran',
  'Duration',
  'Tests',
  'Pending',
  'Failed',
];
function RspecReportsHeader() {
  return (
    <div className={styles.headerRow}>
      {headerItems.map(name => (
        <div className={styles[`list${name}`]} key={name}>
          {name}
        </div>
      ))}
    </div>
  );
}

function RspecReportRow(props) {
  const {
    id,
    projectName,
    reportableType,
    createdAt,
    duration,
    exampleCount,
    pendingCount,
    failureCount,
  } = props;
  const timeAgo = `${formatDateAgo(new Date(createdAt))} ago`;
  const status = statusName(failureCount);

  return (
    <Link
      to={`/reports/${id}`}
      className={`${styles.listRow} ${styles[status]}`}
    >
      <div className={styles.listNumber}># {id}</div>
      <div className={styles.listProject}>{projectName}</div>
      <div className={styles.listType}>{reportableType}</div>
      <div className={styles.listRan}>{timeAgo}</div>
      <div className={styles.listDuration}>{formatDuration(duration)}</div>
      <div className={styles.listTests}>{exampleCount}</div>
      <div className={styles.listPending}>{pendingCount}</div>
      <div className={styles.listFailed}>{failureCount}</div>
    </Link>
  );
}

RspecReportRow.propTypes = {
  id: PropTypes.number.isRequired,
  projectName: PropTypes.string.isRequired,
  reportableType: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  exampleCount: PropTypes.number.isRequired,
  pendingCount: PropTypes.number.isRequired,
  failureCount: PropTypes.number.isRequired,
};

function RspecReportsList(props) {
  const { edges } = props;
  const reports = edges.map(edge => edge.node);

  if (isEmpty(reports)) {
    return <div className="loading">No reports found.</div>;
  }

  return (
    <Fragment>
      <br />
      <div className={styles.reportsList}>
        <RspecReportsHeader />
        <div className={styles.listGroup}>
          {reports.map(({ id, report, summary }) => (
            <RspecReportRow
              id={id}
              key={id}
              projectName={report.projectName}
              reportableType={report.reportableType}
              createdAt={report.createdAt}
              duration={summary.duration}
              exampleCount={summary.exampleCount}
              pendingCount={summary.pendingCount}
              failureCount={summary.failureCount}
            />
          ))}
        </div>
      </div>
    </Fragment>
  );
}

RspecReportsList.propTypes = {
  edges: PropTypes.arrayOf(
    PropTypes.shape({
      node: PropTypes.shape({
        id: PropTypes.number.isRequired,
        report: PropTypes.shape({
          projectName: PropTypes.string.isRequired,
          reportableType: PropTypes.string.isRequired,
          createdAt: PropTypes.string,
        }).isRequired,
        summary: PropTypes.shape({
          duration: PropTypes.number.isRequired,
          exampleCount: PropTypes.number.isRequired,
          pendingCount: PropTypes.number.isRequired,
          failureCount: PropTypes.number.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
  ).isRequired,
};

export default React.memo(RspecReportsList);
