import React, { Component } from 'react';

export default class Button extends Component {
  buttonStyle() {
    switch (this.props.color) {
      case 'primary': return 'btn btn-primary';
      case 'success': return 'btn btn-success';
      case 'info': return 'btn btn-info';
      case 'warning': return 'btn btn-warning';
      case 'danger': return 'btn btn-danger';
      default: return 'btn btn-default';
    }
  }

  render() {
    return (
      <button
        className={this.buttonStyle()}
        {...this.props}
      >{this.props.text}
      </button>
    );
  }
}
