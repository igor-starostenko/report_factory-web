import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { ButtonGroup } from 'reactstrap';
import { FilterButton } from '.';

export default function PerPageFilter(props) {
  const { action, perPage, totalCount, buttons } = props;

  if (totalCount <= 10) {
    return <Fragment />;
  }

  return (
    <ButtonGroup className="filters">
      {buttons.map(value => {
        const name = `${value} Per Page`;
        return (
          <FilterButton
            active={perPage === value}
            key={value}
            onClick={action}
            value={{ perPage: value }}
          >
            {name}
          </FilterButton>
        );
      })}
    </ButtonGroup>
  );
}

PerPageFilter.propTypes = {
  action: PropTypes.func.isRequired,
  perPage: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  buttons: PropTypes.arrayOf(PropTypes.any.isRequired).isRequired,
};
