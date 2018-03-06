import React, { Component } from 'react';
import _ from 'lodash';

export default class FormErrors extends Component {
  renderErrors() {
    let errorIndex = 0;
    return _.map(this.props.errors, (error) => {
      const { detail } = error;
      errorIndex += 1;
      return (<li key={errorIndex} className="error">{detail}</li>);
    });
  }

  render() {
    return (<ul>{this.renderErrors()}</ul>);
  }
}
