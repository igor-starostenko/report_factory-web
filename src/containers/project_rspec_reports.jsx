import React, { Fragment, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import SearchReports from './search_reports';
import {
  Loading,
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

function ProjectRspecReports(props) {
  const { edges, pageInfo, projectName, query, totalCount, xApiKey } = props;

  function prepareVariables({
    page,
    perPage,
    tags,
    start,
    next,
    previous,
    end,
  }) {
    const newPage = page || query.page;
    const newPerPage = perPage || query.perPage;
    const newTags = tags || query.tags;
    if (start || tags || perPage) {
      return { page: 1, perPage: newPerPage, first: newPerPage, tags: newTags };
    }
    if (next) {
      const { endCursor: after } = pageInfo;
      return {
        page: newPage,
        perPage: newPerPage,
        first: newPerPage,
        after,
        tags: newTags,
      };
    }
    if (previous) {
      const { startCursor: before } = pageInfo;
      return {
        page: newPage,
        perPage: newPerPage,
        last: newPerPage,
        before,
        tags: newTags,
      };
    }
    if (end) {
      const remaining = totalCount % newPerPage;
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

  function fetchProjectRspecReports(options) {
    const variables = prepareVariables(options);
    props.setProjectRspecReportsQuery(variables);
    props.queryProjectRspecReports(xApiKey, { ...variables, projectName });
  }

  function resetSearchTags(tags) {
    props.setProjectRspecReportsQuery({ page: 1, perPage: 10, tags });
  }

  useEffect(() => {
    if (!edges) {
      fetchProjectRspecReports({ perPage: query.perPage, tags: query.tags });
    }
    return () => props.resetProjectRspecReports();
  }, [...query]);

  if (!edges) {
    return <Loading />;
  }

  const projectUrl = `/projects/${projectName}`;
  const reports = edges.map(edge => edge.node);

  return (
    <Fragment>
      <Link to={projectUrl}>Back to project</Link>
      <div className={styles.projectReportsContainer}>
        <div className={styles.projectReportsHeader}>
          <div className={styles.projectReportsName}>{projectName}</div>
        </div>
        <div className={styles.projectReportsSearch}>
          <SearchReports
            action={fetchProjectRspecReports}
            setSearch={resetSearchTags}
            initialValues={{ tags: query.tags }}
            {...props}
          />
        </div>
        <div className={styles.projectReportsTotal}>
          Reports submitted: {totalCount}
        </div>
        <div className={styles.projectReportsChart}>
          <RspecReportsBar
            reports={reports}
            displayCount={query.perPage}
            filterAction={fetchProjectRspecReports}
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
            page={query.page}
            perPage={query.perPage}
            totalCount={totalCount}
            action={fetchProjectRspecReports}
          />
          <PerPageFilter
            totalCount={totalCount}
            buttons={[30, 10]}
            perPage={query.perPage}
            action={fetchProjectRspecReports}
          />
        </div>
      </div>
    </Fragment>
  );
}

ProjectRspecReports.propTypes = {
  edges: PropTypes.arrayOf(
    PropTypes.shape({
      node: PropTypes.object,
    }),
  ),
  pageInfo: PropTypes.shape({
    startCursor: PropTypes.string,
    endCursor: PropTypes.string,
    hasNextPage: PropTypes.bool.isRequired,
    hasPreviousPage: PropTypes.bool.isRequired,
  }),
  projectName: PropTypes.string.isRequired,
  query: PropTypes.shape({
    page: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    query: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  totalCount: PropTypes.number,
  xApiKey: PropTypes.string.isRequired,
  queryProjectRspecReports: PropTypes.func.isRequired,
  setProjectRspecReportsQuery: PropTypes.func.isRequired,
  resetProjectRspecReports: PropTypes.func.isRequired,
};

ProjectRspecReports.defaultProps = {
  edges: null,
  totalCount: 0,
  pageInfo: {
    startCursor: null,
    endCursor: null,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

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
