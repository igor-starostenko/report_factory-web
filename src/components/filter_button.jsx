import React, { Component } from 'react';

export default class FilterButton extends Component {
  constructor(props) {
    super(props);
    this.handleFilterClick = this.handleFilterClick.bind(this);
  }

  handleFilterClick() {
    this.props.action(this.props.value);
  }

  render() {
    const className = this.props.active ? 'active' : '';
    /* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
    return (
      <li className={className} onClick={this.handleFilterClick} role="button">
        <a>{this.props.name}</a>
      </li>
    );
  }
}
