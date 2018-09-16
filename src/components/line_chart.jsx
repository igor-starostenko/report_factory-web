import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

export default class LineChart extends Component {
  setFilter(filterName) {
    const newFilters = { ...this.props.filterMapping[filterName], filterName };
    this.props.filterAction(newFilters);
  }

  renderFilterItems() {
    return Object.keys(this.props.filterMapping).map((filterName) => {
      return this.renderFilterItem(filterName);
    });
  }

  renderFilterItem(filterName) {
    const className = this.props.activeFilter === filterName ? 'active' : '';
    return (
      /* eslint-disable jsx-a11y/click-events-have-key-events */
      /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
      /* eslint-disable react/jsx-no-bind */
      <li
        className={className}
        key={filterName}
        onClick={this.setFilter.bind(this, filterName)}
      ><a>{filterName}</a>
      </li>
      /* eslint-enable react/jsx-no-bind */
      /* eslint-enable jsx-a11y/no-noninteractive-element-interactions */
      /* eslint-enable jsx-a11y/click-events-have-key-events */
    );
  }

  render() {
    const { options, getChartData } = this.props;

    return (
      <div>
        <Line
          data={getChartData()}
          options={options}
        />
        <div className="filters">
          <ul id="chart-pills" className="nav nav-pills ct-orange">
            {this.renderFilterItems()}
          </ul>
        </div>
      </div>
    );
  }
}
