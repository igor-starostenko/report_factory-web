import React, { Component } from 'react';

export default class FormField extends Component {
  render() {
    const {
      meta: { touched, error },
      label,
      type,
      placeholder,
      input,
    } = this.props;
    const className = `form-group ${touched && error ? 'has-danger' : ''}`;

    return (
      <div className={className}>
        <label htmlFor={label}>{label}</label>
        <input
          className={`${this.props.className} form-control`}
          id={label}
          type={type}
          placeholder={placeholder}
          {...input}
        />
        <div className="text-help error">{touched ? error : ''}</div>
      </div>
    );
  }
}
