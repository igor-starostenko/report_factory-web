import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Input, FormGroup, FormFeedback, Label } from 'reactstrap';

export default class FormField extends Component {
  render() {
    const {
      meta: { touched, error },
      label,
      placeholder,
      input,
      ...rest
    } = this.props;

    const invalid = touched && error.length > 0;
    const valid = touched && error.length === 0;
    return (
      <FormGroup>
        <Label htmlFor={label}>{label}</Label>
        <Input
          id={label}
          placeholder={placeholder}
          invalid={invalid}
          valid={valid}
          {...input}
          {...rest}
        />
        {touched &&
          error.map((err, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <FormFeedback key={`passwordError${index}`}>{err}</FormFeedback>
          ))}
      </FormGroup>
    );
  }
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
    error: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

FormField.defaultProps = {
  placeholder: '',
  errors: [],
};
