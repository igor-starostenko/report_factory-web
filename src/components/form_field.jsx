import React, { Component } from 'react';

export default class FormField extends Component {
  render() {
    const {
      meta: { touched, error },
    } = this.props;
    const className = `form-group ${touched && error ? 'has-danger' : ''}`;

    return (
      <div className={className}>
        <label>{this.props.label}</label>
        <input
          className={`${this.props.className} form-control`}
          type={this.props.type}
          placeholder={this.props.placeholder}
          {...this.props.input}
        />
        <div className="text-help error">{touched ? error : ''}</div>
      </div>
    );
  }
}
