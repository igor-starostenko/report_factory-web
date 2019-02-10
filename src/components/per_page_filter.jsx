import React, { Component } from 'react';
import _ from 'lodash';
import { FilterButton } from '.';

export default class PerPageFilter extends Component {
  activeFilter(number) {
    return this.props.perPage === number;
  }

  renderFilterButtons() {
    return _.map(this.props.buttons, value => {
      const name = `${value} Per Page`;
      return (
        <FilterButton
          action={this.props.action}
          active={this.activeFilter(value)}
          key={value}
          name={name}
          value={{ perPage: value }}
        />
      );
    });
  }

  render() {
    if (this.props.totalCount <= 10) {
      return <div />;
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
