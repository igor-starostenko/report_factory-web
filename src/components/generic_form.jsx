import React, { Component } from 'react';
import _ from 'lodash';

class GenericForm extends Component {
  static renderField(field) {
    const { meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? 'has-danger' : ''}`;

    return (
      <div className={className}>
        <label>{field.label}</label>
        <input
          className="form-control"
          type={field.type}
          placeholder={field.placeholder}
          {...field.input}
        />
        <div className="text-help error">
          {touched ? error : ''}
        </div>
      </div>
    );
  }

  static renderRadio({ input, options }) {
    return (
      <div>
        {
           options.map(o => (
             <label key={o.value} className="radioLabel">
               <input
                 className="radio"
                 {...input}
                 type="radio"
                 value={o.value}
               />
               <i />{o.value}
             </label>
          ))
      }
      </div>
    );
  }

  static renderErrors(errors) {
    const i = 0;
    return _.map(errors, error => (<li key={i + 1} className="error">{error.detail}</li>));
  }
}

export default GenericForm;
