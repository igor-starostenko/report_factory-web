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
    return (
      /* eslint-disable jsx-a11y/click-events-have-key-events */
      /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
      <li className={className} onClick={this.handleFilterClick}>
        <a>{this.props.name}</a>
      </li>
      /* eslint-enable jsx-a11y/no-noninteractive-element-interactions */
      /* eslint-enable jsx-a11y/click-events-have-key-events */
    );
  }
}
