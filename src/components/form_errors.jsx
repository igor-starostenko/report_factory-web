import React, { Component } from 'react';
import _ from 'lodash';

export default class FormErrors extends Component {
  renderErrors() {
    return _.map(this.props.errors, (error) => {
      const { title, detail } = error;
      return (<li key={title} className="error">{detail}</li>);
    });
  }

  render() {
    return (<ul>{this.renderErrors()}</ul>);
  }
}
