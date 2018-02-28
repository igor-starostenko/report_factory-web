import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { RspecReportsList, Pagination, FilterButton } from '../components';
import { getRspecReports, setRspecReportsPage, getRspecReportsSuccess,
  getRspecReportsFailure, resetRspecReports } from '../actions/reports_actions';
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

  fetchRspecReports({ page, perPage }) {
    const { xApiKey, dispatch } = this.props;
    const options = {
      page: page || this.props.page,
      per_page: perPage || this.props.perPage,
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

  activeFilter(number) {
    return this.props.perPage === number;
  }

  render() {
    return (
      <div>
        <br />
        <div className={styles.reportsContainer}>
          <div className={styles.reportsHeader}>
            <div className={styles.reportsTitle}>Reports</div>
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
            <div className="filters">
              <ul id="chart-pills" className="nav nav-pills ct-orange">
                <FilterButton
                  name="30 Per Page"
                  value={{ perPage: 30 }}
                  active={this.activeFilter(30)}
                  action={this.fetchRspecReports}
                />
                <FilterButton
                  name="10 Per Page"
                  value={{ perPage: 10 }}
                  active={this.activeFilter(10)}
                  action={this.fetchRspecReports}
                />
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  getRspecReports: (...args) => dispatch(getRspecReports(...args)),
  resetRspecReports: () => dispatch(resetRspecReports()),
  dispatch,
});

const mapStateToProps = state => ({
  page: state.reports.rspecReportsList.page,
  perPage: state.reports.rspecReportsList.perPage,
  total: state.reports.rspecReportsList.total,
  reports: state.reports.rspecReportsList.data,
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
