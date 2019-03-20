import React, { Fragment, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Loading,
  RspecReportDetails,
  RspecReportPieChart,
  RspecFeatureChart,
  RspecReportExamplesList,
} from '../components';
import { getRspecReport, resetRspecReport } from '../actions/reports_actions';
import { formatDate } from '../helpers/format_helpers';
import styles from './styles/RspecReport.css';

const formatDateOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

function RspecReport(props) {
  const { report, reportId, xApiKey } = props;

  useEffect(() => {
    if (!report || report.id !== reportId) {
      props.getRspecReport(reportId, xApiKey);
    }
    return () => props.resetRspecReport();
  }, [reportId]);

  if (!report) {
    return <Loading page />;
  }

  const { date, examples } = report.attributes;
  const createdAt = formatDate(new Date(date.created_at), formatDateOptions);

  return (
    <Fragment>
      <Link to="/reports">Back to reports</Link>
      <div className={styles.reportContainer}>
        <div className={styles.reportHeader}>
          <h1 className={styles.reportId}># {reportId}</h1>
        </div>
        <div className={styles.reportCreated}>Created on {createdAt}</div>
        <div className={styles.reportDetails}>
          <RspecReportDetails report={report} />
        </div>
        <div className={styles.reportFeatureChart}>
          <RspecFeatureChart examples={examples} />
        </div>
        <div className={styles.reportChart}>
          <RspecReportPieChart examples={examples} />
        </div>
        <div className={styles.reportExamples}>
          <RspecReportExamplesList examples={examples} />
        </div>
      </div>
    </Fragment>
  );
}

RspecReport.propTypes = {
  report: PropTypes.shape({
    attributes: PropTypes.shape({
      date: PropTypes.shape({
        created_at: PropTypes.string.isRequired,
      }).isRequired,
      examples: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
    id: PropTypes.string.isRequired,
  }),
  reportId: PropTypes.string.isRequired,
  xApiKey: PropTypes.string.isRequired,
  getRspecReport: PropTypes.func.isRequired,
  resetRspecReport: PropTypes.func.isRequired,
};

RspecReport.defaultProps = {
  report: null,
};

const mapStateToProps = (state, ownProps) => ({
  reportId: ownProps.match.params.id,
  report: state.reports.activeRspecReport.data,
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(
  mapStateToProps,
  { getRspecReport, resetRspecReport },
)(RspecReport);
