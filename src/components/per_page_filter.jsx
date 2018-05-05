import React, { Component } from 'react';
import _ from 'lodash';
import { FilterButton } from '../components';

export default class PerPageFilter extends Component {
  activeFilter(number) {
    return this.props.perPage === number;
  }

  renderFilterButtons() {
    return _.map(this.props.buttons, (value) => {
      const name = `${value} Per Page`;
      return (
        <FilterButton
          name={name}
          key={value}
          value={{ perPage: value }}
          active={this.activeFilter(value)}
          action={this.props.action}
        />
      );
    });
  }

  render() {
    if (!this.props.items || this.props.totalCount <= 10) {
      return (<div />);
    }
    return (
      <div className="filters">
        <ul id="chart-pills" className="nav nav-pills ct-orange">
          {this.renderFilterButtons()}
        </ul>
      </div>
    );
  }
}
