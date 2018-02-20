import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Button extends Component {
  buttonColor() {
    switch (this.props.color) {
      case 'primary': return 'btn btn-primary';
      case 'success': return 'btn btn-success';
      case 'info': return 'btn btn-info';
      case 'warning': return 'btn btn-warning';
      case 'danger': return 'btn btn-danger';
      default: return 'btn btn-default';
    }
  }

  buttonStyle() {
    if (this.props.fill === 'true') {
      return (`btn ${this.buttonColor()} btn-fill`);
    }
    return (`btn ${this.buttonColor()}`);
  }

  render() {
    if (this.props.to) {
      return (
        <Link
          className={this.buttonStyle()}
          {...this.props}
        >{this.props.text}
        </Link>
      );
    }
    return (
      <button
        className={this.buttonStyle()}
        {...this.props}
      >{this.props.text}
      </button>
    );
  }
}
