import React, { Component } from 'react';

class GenericForm extends Component {
  static renderField(field) {
    const { meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? 'has-danger' : ''}`;

    return (
      <div className={className}>
        <label>{field.label}</label>
        <input className="form-control" type="text" {...field.input} />
        <div className="text-help error">
          {touched ? error : ''}
        </div>
      </div>
    );
  }

  static renderErrors(errors) {
    if (errors) {
      let i = 0;
      return _.map(errors, error => {
        return (<li key={i++} className="error">{error.detail}</li>);
      });
    }
  };
}

export default GenericForm;
