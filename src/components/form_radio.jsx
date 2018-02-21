import React, { Component } from 'react';

export default class FormRadio extends Component {
  render() {
    return (
      <div>
        {
           this.props.options.map(o => (
             <label key={o.value} className="radioLabel">
               <input
                 className="radio"
                 checked={this.props.input.value === o.value}
                 {...this.props.input}
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
}
