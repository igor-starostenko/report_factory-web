import React, { Component } from 'react';
import { Bar } from 'react-chartjs';
import { FilterButton } from '../components';

export default class BarChart extends Component {
  activeFilter(number) {
    return this.props.reportsCount === number;
  }

  render() {
    const { reports, options, getChartData } = this.props;

    return (
      <div>
        <Bar
          data={getChartData(reports, this.props.reportsCount)}
          options={options}
          height="350"
          redraw
        />
        <div className="filters">
          <ul id="chart-pills" className="nav nav-pills ct-orange">
            <FilterButton
              name="Last 30"
              value={30}
              active={this.activeFilter(30)}
              action={this.props.setFilterCount}
            />
            <FilterButton
              name="Last 10"
              value={10}
              active={this.activeFilter(10)}
              action={this.props.setFilterCount}
            />
          </ul>
        </div>
      </div>
    );
  }
}
