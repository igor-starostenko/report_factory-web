import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import SearchReports from './search_reports';
import { RspecReportsList, Pagination, PerPageFilter } from '../components';
import { getRspecReports, setRspecReportsPage, setRspecReportsTags,
  getRspecReportsSuccess, getRspecReportsFailure, resetRspecReports } from '../actions/reports_actions';
import styles from './styles/Reports.css';

class Reports extends Component {
  constructor(props) {
    super(props);
    this.fetchRspecReports = this.fetchRspecReports.bind(this);
  }

  componentDidMount() {
    const { reportsList } = this.props;
    if (!reportsList || _.isEmpty(reportsList)) {
      const { page, perPage } = this.props;
      this.fetchRspecReports({ page, perPage });
    }
  }

  fetchRspecReports({ page, perPage, tags }) {
    const { xApiKey, dispatch } = this.props;
    const options = {
      page: page || this.props.page,
      per_page: perPage || this.props.perPage,
      tags: tags || this.props.tags,
    };
    getRspecReports(xApiKey, options)
      .then((response) => {
        if (response.status !== 200) {
          return dispatch(getRspecReportsFailure(response.payload));
        }
        dispatch(setRspecReportsPage(response));
        return dispatch(getRspecReportsSuccess(response));
      });
  }

  render() {
    return (
      <div>
        <br />
        <div className={styles.reportsContainer}>
          <div className={styles.reportsHeader}>
            <div className={styles.reportsTitle}>Reports</div>
          </div>
          <div className={styles.reportsSearch}>
            <SearchReports
              action={this.fetchRspecReports}
              setSearch={this.props.setRspecReportsTags}
              initialValues={{ tags: this.props.tags }}
              {...this.props}
            />
          </div>
          <div className={styles.reportsContent}>
            <RspecReportsList reports={this.props.reports} />
          </div>
          <div className={styles.reportsButtons}>
            <Pagination
              className={styles.reportsPagination}
              page={this.props.page}
              perPage={this.props.perPage}
              total={this.props.total}
              action={this.fetchRspecReports}
            />
            <PerPageFilter
              items={this.props.reports}
              totalCount={this.props.total}
              buttons={[30,10]}
              perPage={this.props.perPage}
              action={this.fetchRspecReports}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  getRspecReports: (...args) => dispatch(getRspecReports(...args)),
  setRspecReportsTags: (...args) => dispatch(setRspecReportsTags(...args)),
  resetRspecReports: () => dispatch(resetRspecReports()),
  dispatch,
});

const mapStateToProps = state => ({
  page: state.reports.rspecReportsList.page,
  perPage: state.reports.rspecReportsList.perPage,
  total: state.reports.rspecReportsList.total,
  tags: state.reports.rspecReportsList.tags,
  reports: state.reports.rspecReportsList.data,
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
