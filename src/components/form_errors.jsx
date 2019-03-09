import React from 'react';
import { PropTypes } from 'prop-types';

export default function FormErrors(props) {
  const { errors } = props;

  return (
    <ul>
      {(errors || []).map(({ detail }, index) => {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <li key={index} className="error">
            {detail}
          </li>
        );
      })}
    </ul>
  );
}

FormErrors.propTypes = {
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      detail: PropTypes.string,
    }).isRequired,
  ),
};

FormErrors.defaultProps = {
  errors: [],
};
