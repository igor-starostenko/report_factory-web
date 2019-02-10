import React, { Component } from 'react';

export default class FormRadio extends Component {
  render() {
    return (
      <div>
        {this.props.options.map(o => (
          <label key={o.value} htmlFor={o.value} className="radioLabel">
            <input
              className="radio"
              checked={this.props.input.value === o.value}
              {...this.props.input}
              id={o.value}
              type="radio"
              value={o.value}
            />
            <i />
            {o.value}
          </label>
        ))}
      </div>
    );
  }
}
