import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { Input, FormGroup, Label } from 'reactstrap';
import styles from './styles/FormRadio.css';

export default function FormRadio(props) {
  const { options, input } = props;
  return (
    <FormGroup>
      {options.map(({ value }) => (
        <Fragment key={value}>
          <Input
            checked={input.value === value}
            className={styles.formCheckInput}
            {...input}
            id={value}
            type="radio"
            value={value}
          />
          <Label htmlFor={value}>{value}</Label>
        </Fragment>
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
