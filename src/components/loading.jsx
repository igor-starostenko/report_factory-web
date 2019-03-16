import React from 'react';
import { PropTypes } from 'prop-types';
import { Spinner } from 'reactstrap';
import styles from './styles/Loading.css';

export default function Loading(props) {
  const { className, ...rest } = props;
  return (
    <div className={`${styles.loading} ${className}`}>
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
  type: PropTypes.string,
};

Loading.defaultProps = {
  className: '',
  color: 'info',
  type: 'grow',
};
