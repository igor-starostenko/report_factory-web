import React, { Component } from 'react';
import { connect } from 'react-redux';
// import _ from 'lodash';
import { Link } from 'react-router-dom';
import {
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

class RspecReport extends Component {
  componentDidMount() {
    const { report, reportId } = this.props;
    if (!report || report.id !== reportId) {
      this.props.getRspecReport(reportId, this.props.xApiKey);
    }
  }

  componentWillUnmount() {
    this.props.resetRspecReport();
  }

  render() {
    const { reportId, report } = this.props;

    if (!report) {
      return <div className="loading">Loading...</div>;
    }

    const { date, examples } = report.attributes;
    const createdAt = formatDate(new Date(date.created_at), formatDateOptions);

    return (
      <div>
        <Link to="/reports">Back to reports</Link>
        <div className={styles.reportContainer}>
          <div className={styles.reportHeader}>
            <div className={styles.reportId}># {reportId}</div>
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
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  reportId: ownProps.match.params.id,
  report: state.reports.activeRspecReport.data,
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(
  mapStateToProps,
  { getRspecReport, resetRspecReport },
)(RspecReport);
