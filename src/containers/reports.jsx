import React, { Fragment, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import SearchReports from './search_reports';
import {
  Loading,
  RspecReportsList,
  PaginationConnection,
  PerPageFilter,
} from '../components';
import {
  queryRspecReports,
  setRspecReportsQuery,
} from '../actions/reports_actions';
import { prepareVariables } from '../helpers/search_helpers';
import styles from './styles/Reports.css';

function Reports(props) {
  const { edges, pageInfo, query, totalCount, xApiKey } = props;

  function fetchRspecReports(options) {
    const opts = { query, pageInfo, totalCount, ...options };
    const variables = prepareVariables(opts);
    props.setRspecReportsQuery(variables);
    props.queryRspecReports(xApiKey, variables);
  }

  function resetSearchTags(tags) {
    props.setRspecReportsQuery({ page: 1, perPage: 10, tags });
  }

  useEffect(() => {
    if (!edges) {
      fetchRspecReports({ perPage: query.perPage, tags: query.tags });
    }
    return () => resetSearchTags();
  }, [...query]);

  if (!edges) {
    return <Loading />;
  }

  const reports = edges.map(edge => edge.node);

  return (
    <Fragment>
      <br />
      <div className={styles.reportsContainer}>
        <div className={styles.reportsHeader}>
          <div className={styles.reportsTitle}>Reports</div>
        </div>
        <div className={styles.reportsSearch}>
          <SearchReports
            action={fetchRspecReports}
            setSearch={resetSearchTags}
            initialValues={{ tags: query.tags }}
            {...props}
          />
        </div>
        <div className={styles.reportsContent}>
          <RspecReportsList reports={reports} />
        </div>
        <div className={styles.reportsButtons}>
          <PaginationConnection
            className={styles.reportsPagination}
            page={query.page}
            perPage={query.perPage}
            totalCount={totalCount}
            action={fetchRspecReports}
          />
          <PerPageFilter
            totalCount={totalCount}
            buttons={[30, 10]}
            perPage={query.perPage}
            action={fetchRspecReports}
          />
        </div>
      </div>
    </Fragment>
  );
}

Reports.propTypes = {
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
  query: PropTypes.shape({
    page: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    query: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  totalCount: PropTypes.number,
  xApiKey: PropTypes.string.isRequired,
  queryRspecReports: PropTypes.func.isRequired,
  setRspecReportsQuery: PropTypes.func.isRequired,
};

Reports.defaultProps = {
  edges: null,
  totalCount: 0,
  pageInfo: {
    startCursor: null,
    endCursor: null,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const mapStateToProps = state => ({
  edges: state.reports.rspecReportsConnection.edges,
  pageInfo: state.reports.rspecReportsConnection.pageInfo,
  totalCount: state.reports.rspecReportsConnection.totalCount,
  query: state.reports.rspecReportsConnection.query,
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(
  mapStateToProps,
  { queryRspecReports, setRspecReportsQuery },
)(Reports);
