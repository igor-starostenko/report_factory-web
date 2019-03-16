import React from 'react';
import { PropTypes } from 'prop-types';
import styles from './styles/Pagination.css';

export default function PaginationNumber(props) {
  function handlePageClick() {
    props.action(props.value);
  }

  const isActive = props.page === props.value.page;
  const pageStyle = isActive ? 'pageActive' : '';

  return (
    <li className={styles.pageItem}>
      <div
        className={`${styles.pageNumber} ${pageStyle}`}
        onClick={handlePageClick}
        role="button"
        tabIndex={0}
      >
        {props.value.page}
      </div>
    </li>
  );
}

PaginationNumber.propTypes = {
  action: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  value: PropTypes.shape({
    page: PropTypes.number.isRequired,
  }).isRequired,
};
