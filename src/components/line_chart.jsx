import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { FilterButton } from '.';

export default class LineChart extends Component {
  constructor(props) {
    super(props);
    this.setFilter = this.setFilter.bind(this);
  }

  setFilter(filterName) {
    const newFilters = { ...this.props.filterMapping[filterName], filterName };
    this.props.filterAction(newFilters);
  }

  activeFilter(filterName) {
    return this.props.activeFilter === filterName;
  }

  renderFilterItems() {
    return Object.keys(this.props.filterMapping).map(filterName => {
      return (
        <FilterButton
          action={this.setFilter}
          active={this.activeFilter(filterName)}
          key={filterName}
          name={filterName}
          value={filterName}
        />
      );
    });
  }

  render() {
    const { options, getChartData } = this.props;

    return (
      <div>
        <Line data={getChartData()} options={options} />
        <div className="filters">
          <ul id="chart-pills" className="nav nav-pills ct-orange">
            {this.renderFilterItems()}
          </ul>
        </div>
      </div>
    );
  }
}
