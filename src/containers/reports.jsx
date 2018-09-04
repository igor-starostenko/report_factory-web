import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import SearchReports from './search_reports';
import { RspecReportsList, Pagination, PerPageFilter } from '../components';
import { queryRspecReports, setRspecReportsQuery } from '../actions/reports_actions';
import styles from './styles/Reports.css';

class Reports extends Component {
  constructor(props) {
    super(props);
    this.setSearchTags = this.setSearchTags.bind(this);
    this.fetchRspecReports = this.fetchRspecReports.bind(this);
  }

  componentDidMount() {
    if (!this.props.rspecReports) {
      const { tags } = this.props.query;
      this.fetchRspecReports({ perPage: this.perPage(), tags });
    }
  }

  fetchRspecReports({ perPage, tags }) {
    const { xApiKey } = this.props;
    const variables = this.prepareVariables({ perPage, tags });
    this.props.setRspecReportsQuery(variables)
    this.props.queryRspecReports(xApiKey, variables);
  }

  prepareVariables({ perPage, tags }) {
    const { first, last, before, after } = this.props.query;
    if (last) {
      return { last: perPage || last, before, tags };
    }
    return { first: perPage || first, after, tags };
  }

  setSearchTags(tags) {
    this.props.setRspecReportsQuery({ tags })
  }

  perPage() {
    const { query: { first, last } } = this.props;
    return first || last;
  }

  fetchReportablesFromProps() {
    return this.props.edges.map(edge => edge.node);
  }

  render() {
    if (!this.props.edges) {
      return (<div className="loading">Loading...</div>);
    }

    const reports = this.fetchReportablesFromProps();
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
              setSearch={this.setSearchTags}
              initialValues={{ tags: this.props.query.tags }}
              {...this.props}
            />
          </div>
          <div className={styles.reportsContent}>
            <RspecReportsList reports={reports} />
          </div>
          <div className={styles.reportsButtons}>
            <PerPageFilter
              totalCount={this.props.totalCount}
              buttons={[30,10]}
              perPage={this.perPage()}
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
