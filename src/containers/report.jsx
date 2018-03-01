import React, { Component } from 'react';
import { connect } from 'react-redux';
// import _ from 'lodash';
import { Link } from 'react-router-dom';
import { getRspecReport } from '../actions/reports_actions';
import { formatDate } from '../helpers/format_helpers';
import styles from './styles/Report.css';

const formatDateOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

class Report extends Component {
  componentDidMount() {
    const { report, reportId } = this.props;
    if (!report || report.id !== reportId) {
      this.props.getRspecReport(reportId, this.props.xApiKey);
    }
  }

  render() {
    const { reportId, report } = this.props;

    if (!report) {
      return (<div className="loading">Loading...</div>);
    }

    const { date } = report.attributes;
    const createdAt = formatDate(new Date(date.created_at), formatDateOptions);

    return (
      <div>
        <Link to="/reports">Back to reports</Link>
        <div className={styles.reportContainer}>
          <div className={styles.reportHeader}>
            <div className={styles.reportId}># {reportId}</div>
          </div>
          <div className={styles.reportCreated}>Created {createdAt}</div>
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

export default connect(mapStateToProps, { getRspecReport })(Report);
