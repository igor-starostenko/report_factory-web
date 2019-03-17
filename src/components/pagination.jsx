import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import ceil from 'lodash/ceil';
import map from 'lodash/map';
import { PaginationNumber } from '.';
import styles from './styles/Pagination.css';

function getPageNumbers(currentPage, lastPage) {
  const pageNumbers = [];
  if (lastPage > 5) {
    const startPage = 1;
    pageNumbers.push(startPage);
    if (currentPage - 1 <= startPage) {
      pageNumbers.push(startPage + 1);
      pageNumbers.push(startPage + 2);
      pageNumbers.push(startPage + 3);
    } else if (lastPage - 2 <= currentPage) {
      pageNumbers.push(lastPage - 3);
      pageNumbers.push(lastPage - 2);
      pageNumbers.push(lastPage - 1);
    } else {
      pageNumbers.push(currentPage - 1);
      pageNumbers.push(currentPage);
      pageNumbers.push(currentPage + 1);
    }
    pageNumbers.push(lastPage);
  } else {
    for (let i = 1; i <= lastPage; i += 1) {
      pageNumbers.push(i);
    }
  }
  return pageNumbers;
}

export default function Pagination(props) {
  const { page, perPage, total } = props;
  const currentPage = parseInt(page, 10);
  const lastPage = ceil(parseInt(total, 10) / parseInt(perPage, 10));
  const pageNumbers = getPageNumbers(currentPage, lastPage);

  if (lastPage <= 1) {
    return <Fragment />;
  }

  return (
    <ul className={styles.pagination}>
      <div className={styles.pageWrapper}>
        {map(pageNumbers, number => (
          <PaginationNumber
            key={number}
            value={{ page: number }}
            setPage={props.setPage}
            page={currentPage}
          />
        ))}
      </div>
    </ul>
  );
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
};
