import React from 'react';
import { PropTypes } from 'prop-types';
import { Button } from 'reactstrap';
import styles from './styles/FilterButton.css';

export default function FilterButton(props) {
  const { onClick, value, active, className, children } = props;
  function handleFilterClick() {
    onClick(value);
  }

  const styleName = active ? 'activeFilter' : 'inactiveFilter';
  return (
    <Button
      className={`${styles[styleName]} ${className}`}
      onClick={handleFilterClick}
    >
      {children}
    </Button>
  );
}

FilterButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  value: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
  active: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.string.isRequired,
};

FilterButton.defaultProps = {
  active: false,
  className: '',
};
