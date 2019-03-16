import React from 'react';
import { PropTypes } from 'prop-types';
import { Input, FormGroup, FormFeedback, Label } from 'reactstrap';

export default function FormField(props) {
  const {
    meta: { touched, error },
    label,
    placeholder,
    input,
    ...rest
  } = props;

  return (
    <FormGroup>
      <Label htmlFor={label}>{label}</Label>
      <Input
        id={label}
        placeholder={placeholder}
        invalid={touched && !!error}
        valid={touched && !error}
        {...input}
        {...rest}
      />
      {touched && <FormFeedback>{error}</FormFeedback>}
    </FormGroup>
  );
}

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  errors: PropTypes.arrayOf(PropTypes.string),
  input: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool.isRequired,
    error: PropTypes.string,
  }).isRequired,
};

FormField.defaultProps = {
  placeholder: '',
  errors: [],
};
