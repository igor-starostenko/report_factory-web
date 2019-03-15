import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import ceil from 'lodash/ceil';
import { PaginationNumber } from '.';
import styles from './styles/Pagination.css';

function getPages(currentPage, lastPage) {
  const pages = [];
  const startPage = 1;
  pages.push({ page: startPage, start: true });
  if (lastPage > 3) {
    if (currentPage === startPage) {
      // 1, 2, '...', 148
      pages.push({ page: currentPage + 1, next: true });
      pages.push({ page: currentPage + 2, ellipsis: true });
    } else if (currentPage - 1 === startPage) {
      // 1, 2, 3, '...', 148
      pages.push({ page: currentPage });
      pages.push({ page: currentPage + 1, next: true });
      pages.push({ page: currentPage + 2, ellipsis: true });
    } else if (lastPage - 2 >= currentPage) {
      // 1, 3, 4, 5, 148
      pages.push({ page: currentPage - 1, previous: true });
      pages.push({ page: currentPage });
      pages.push({ page: currentPage + 1, next: true });
    } else if (lastPage - 1 === currentPage) {
      // 1, '...', 146, 147, 148
      pages.push({ page: currentPage - 2, ellipsis: true });
      pages.push({ page: currentPage - 1, previous: true });
      pages.push({ page: currentPage });
    } else {
      // 1, '...', 147, 148
      pages.push({ page: currentPage - 2, ellipsis: true });
      pages.push({ page: currentPage - 1, previous: true });
    }
  } else if (lastPage === 3) {
    // 1, 2, 3
    pages.push({ page: 2, next: currentPage === 1 });
  }
  pages.push({ page: lastPage, end: true });
  return pages;
}

function PageNumber(props) {
  const { action, currentPage, obj } = props;
  return (
    <Fragment>
      {obj.ellipsis ? (
        <div className={styles.ellipsis}>...</div>
      ) : (
        <PaginationNumber
          key={obj.page}
          value={obj}
          action={action}
          page={currentPage}
        />
      )}
    </Fragment>
  );
}

PageNumber.propTypes = {
  action: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  obj: PropTypes.shape({
    page: PropTypes.number.isRequired,
    ellipsis: PropTypes.bool,
    start: PropTypes.bool,
    end: PropTypes.bool,
    previous: PropTypes.bool,
    next: PropTypes.bool,
  }).isRequired,
};

export default function PaginationConnection(props) {
  const { action, page, perPage, totalCount } = props;
  const lastPage = ceil(parseInt(totalCount, 10) / parseInt(perPage, 10));

  if (lastPage <= 1) {
    return <Fragment />;
  }

  const currentPage = parseInt(page, 10);
  const pages = getPages(currentPage, lastPage);

  return (
    <ul className={styles.pagination}>
      <div className={styles.pageWrapper}>
        {pages.map(obj => (
          <PageNumber
            action={action}
            currentPage={currentPage}
            key={obj.page}
            obj={obj}
          />
        ))}
      </div>
    </ul>
  );
}

PaginationConnection.propTypes = {
  action: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
};
