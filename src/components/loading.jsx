import React from 'react';
import { PropTypes } from 'prop-types';
import { Spinner } from 'reactstrap';
import styles from './styles/Loading.css';

function getClassNames(page) {
  if (page) {
    return `${styles.loading} ${styles.pageLoading}`;
  }
  return styles.loading;
}

export default function Loading(props) {
  const { className, page, ...rest } = props;
  return (
    <div className={`${getClassNames(page)} ${className}`}>
      <span>Loading</span>
      <Spinner {...rest} />
      <Spinner {...rest} />
      <Spinner {...rest} />
    </div>
  );
}

Loading.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  page: PropTypes.bool,
  type: PropTypes.string,
};

Loading.defaultProps = {
  className: '',
  color: 'info',
  type: 'grow',
  page: false,
};
