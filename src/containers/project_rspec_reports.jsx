import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import SearchReports from './search_reports';
import {
  RspecReportsBar,
  RspecReportsList,
  ReportsSuccessChart,
  PaginationConnection,
  PerPageFilter,
} from '../components';
import {
  queryProjectRspecReports,
  setProjectRspecReportsQuery,
  resetProjectRspecReports,
} from '../actions/project_reports_actions';
import styles from './styles/ProjectRspecReports.css';

class ProjectRspecReports extends Component {
  constructor(props) {
    super(props);
    this.resetSearchTags = this.resetSearchTags.bind(this);
    this.fetchProjectRspecReports = this.fetchProjectRspecReports.bind(this);
  }

  componentDidMount() {
    if (!this.props.edges) {
      const { perPage, tags } = this.props.query;
      this.fetchProjectRspecReports({ perPage, tags });
    }
  }

  componentWillUnmount() {
    this.props.resetProjectRspecReports();
  }

  setProjectRspecReportsQuery({ page, perPage, tags }) {
    this.props.setProjectRspecReportsQuery({ page, perPage, tags });
  }

  queryProjectRspecReports({ first, last, before, after, tags }) {
    const { xApiKey, projectName } = this.props;
    this.props.queryProjectRspecReports(xApiKey, {
      projectName,
      first,
      last,
      before,
      after,
      tags,
    });
  }

  prepareVariables({ page, perPage, tags, start, next, previous, end }) {
    const newPage = page || this.props.query.page;
    const newPerPage = perPage || this.props.query.perPage;
    const newTags = tags || this.props.query.tags;
    if (start || tags || perPage) {
      return { page: 1, perPage: newPerPage, first: newPerPage, tags: newTags };
    }
    if (next) {
      const { endCursor: after } = this.props.pageInfo;
      return {
        page: newPage,
        perPage: newPerPage,
        first: newPerPage,
        after,
        tags: newTags,
      };
    }
    if (previous) {
      const { startCursor: before } = this.props.pageInfo;
      return {
        page: newPage,
        perPage: newPerPage,
        last: newPerPage,
        before,
        tags: newTags,
      };
    }
    if (end) {
      const remaining = this.props.totalCount % newPerPage;
      return {
        page: newPage,
        perPage: newPerPage,
        last: remaining,
        tags: newTags,
      };
    }
    return {
      page: newPage,
      perPage: newPerPage,
      first: newPerPage,
      tags: newTags,
    };
  }

  fetchProjectRspecReports(options) {
    const variables = this.prepareVariables(options);
    this.setProjectRspecReportsQuery(variables);
    this.queryProjectRspecReports(variables);
  }

  resetSearchTags(tags) {
    this.props.setProjectRspecReportsQuery({ page: 1, perPage: 10, tags });
  }

  render() {
    if (!this.props.edges) {
      return <div className="loading">Loading...</div>;
    }

    const projectUrl = `/projects/${this.props.projectName}`;
    const reports = this.props.edges.map(edge => edge.node);
    return (
      <div>
        <Link to={projectUrl}>Back to project</Link>
        <div className={styles.projectReportsContainer}>
          <div className={styles.projectReportsHeader}>
            <div className={styles.projectReportsName}>
              {this.props.projectName}
            </div>
          </div>
          <div className={styles.projectReportsSearch}>
            <SearchReports
              action={this.fetchProjectRspecReports}
              setSearch={this.resetSearchTags}
              initialValues={{ tags: this.props.query.tags }}
              {...this.props}
            />
          </div>
          <div className={styles.projectReportsTotal}>
            Reports submitted: {this.props.totalCount}
          </div>
          <div className={styles.projectReportsChart}>
            <RspecReportsBar
              reports={reports}
              displayCount={this.props.query.perPage}
              filterAction={this.fetchProjectRspecReports}
            />
          </div>
          <div className={styles.projectReportsSuccessChart}>
            <ReportsSuccessChart reports={reports} />
          </div>
          <div className={styles.projectReportsList}>
            <RspecReportsList reports={reports} />
          </div>
          <div className={styles.projectReportsListButtons}>
            <PaginationConnection
              className={styles.projectReportsPagination}
              page={this.props.query.page}
              perPage={this.props.query.perPage}
              totalCount={this.props.totalCount}
              action={this.fetchProjectRspecReports}
            />
            <PerPageFilter
              totalCount={this.props.totalCount}
              buttons={[30, 10]}
              perPage={this.props.query.perPage}
              action={this.fetchProjectRspecReports}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  queryProjectRspecReports,
  resetProjectRspecReports,
  setProjectRspecReportsQuery,
};

const mapStateToProps = (state, ownProps) => ({
  projectName: ownProps.match.params.name,
  edges: state.projectReports.rspecReportsConnection.edges,
  pageInfo: state.projectReports.rspecReportsConnection.pageInfo,
  totalCount: state.projectReports.rspecReportsConnection.totalCount,
  query: state.projectReports.rspecReportsConnection.query,
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProjectRspecReports);
