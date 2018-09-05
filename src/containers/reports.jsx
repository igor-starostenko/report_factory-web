import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import SearchReports from './search_reports';
import { RspecReportsList, PaginationConnection, PerPageFilter } from '../components';
import { queryRspecReports, setRspecReportsQuery } from '../actions/reports_actions';
import styles from './styles/Reports.css';

class Reports extends Component {
  constructor(props) {
    super(props);
    this.resetSearchTags = this.resetSearchTags.bind(this);
    this.fetchRspecReports = this.fetchRspecReports.bind(this);
  }

  componentDidMount() {
    if (!this.props.edges) {
      const { perPage, tags } = this.props.query;
      this.fetchRspecReports({ perPage, tags });
    }
  }

  fetchRspecReports(options) {
    const variables = this.prepareVariables(options);
    this.setRspecReportsQuery(variables);
    this.queryRspecReports(variables);
  }

  setRspecReportsQuery({ page, perPage, tags }) {
    this.props.setRspecReportsQuery({ page, perPage, tags });
  }

  queryRspecReports({ first, last, before, after, tags }) {
    const { xApiKey } = this.props;
    this.props.queryRspecReports(xApiKey, { first, last, before, after, tags });
  }

  prepareVariables({
    page, perPage, tags, start, next, previous, end
  }) {
    const newPage = page || this.props.query.page;
    const newPerPage = perPage || this.props.query.perPage;
    const newTags = tags || this.props.query.tags;
    if (start || tags || perPage) {
      return { page: 1, perPage: newPerPage, first: newPerPage, tags: newTags };
    } else if (next) {
      const { endCursor: after } = this.props.pageInfo;
      return { page: newPage, perPage: newPerPage, first: newPerPage, after, tags: newTags };
    } else if (previous) {
      const { startCursor: before } = this.props.pageInfo;
      return { page: newPage, perPage: newPerPage, last: newPerPage, before, tags: newTags };
    } else if (end) {
      const remaining = this.props.totalCount % newPerPage;
      return { page: newPage, perPage: newPerPage, last: remaining, tags: newTags };
    } else {
      return { page: newPage, perPage: newPerPage, first: newPerPage, tags: newTags };
    }
  }

  resetSearchTags(tags) {
    this.props.setRspecReportsQuery({ page: 1, perPage: 10, tags })
  }

  render() {
    if (!this.props.edges) {
      return (<div className="loading">Loading...</div>);
    }

    const reports = this.props.edges.map(edge => edge.node);
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
              setSearch={this.resetSearchTags}
              initialValues={{ tags: this.props.query.tags }}
              {...this.props}
            />
          </div>
          <div className={styles.reportsContent}>
            <RspecReportsList reports={reports} />
          </div>
          <div className={styles.reportsButtons}>
            <PaginationConnection
              className={styles.reportsPagination}
              page={this.props.query.page}
              perPage={this.props.query.perPage}
              totalCount={this.props.totalCount}
              action={this.fetchRspecReports}
            />
            <PerPageFilter
              totalCount={this.props.totalCount}
              buttons={[30,10]}
              perPage={this.props.query.perPage}
              action={this.fetchRspecReports}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  edges: state.reports.rspecReportsConnection.edges,
  pageInfo: state.reports.rspecReportsConnection.pageInfo,
  totalCount: state.reports.rspecReportsConnection.totalCount,
  query: state.reports.rspecReportsConnection.query,
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, { queryRspecReports, setRspecReportsQuery })(Reports);
