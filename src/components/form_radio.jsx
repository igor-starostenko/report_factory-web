import React from 'react';
import { PropTypes } from 'prop-types';
import { Input, FormGroup, Label } from 'reactstrap';

export default function FormRadio(props) {
  const { options, input } = props;
  return (
    <FormGroup>
      {options.map(o => (
        <Label key={o.value} htmlFor={o.value}>
          <Input
            checked={input.value === o.value}
            {...input}
            id={o.value}
            type="radio"
            value={o.value}
          />
          <i />
          {o.value}
        </Label>
      ))}
    </FormGroup>
  );
}

FormRadio.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  input: PropTypes.shape({
    value: PropTypes.string.isRequired,
  }).isRequired,
};
