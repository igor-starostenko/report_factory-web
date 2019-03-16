import React from 'react';
import { PropTypes } from 'prop-types';
import styles from './styles/Pagination.css';

export default function PaginationNumber(props) {
  function handlePageClick() {
    props.setPage(props.value);
  }

  const isActive = props.page === props.value;
  const pageStyle = isActive ? 'pageActive' : '';

  return (
    <li className={styles.pageItem}>
      <div
        className={`${styles.pageNumber} ${pageStyle}`}
        onClick={handlePageClick}
        role="button"
        tabIndex={0}
      >
        {props.value}
      </div>
    </li>
  );
}

PaginationNumber.propTypes = {
  setPage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
