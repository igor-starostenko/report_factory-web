import React, { Component } from 'react';
import { Line } from 'react-chartjs';

export class LineChart extends Component {
  constructor(state) {
    super(state);
    this.state = { activeFilter: 'Week' };
  }

  setFilter(name) {
    this.setState({ activeFilter: name });
  }

  renderFilterItem(name) {
    const className = this.state.activeFilter === name ? "active" : '';
    return (
      <li className={className} onClick={this.setFilter.bind(this, name)}>
        <a>{name}</a>
      </li>
    );
  }

  render() {
    const { reports, options, getChartData } = this.props;

    return (
      <div>
        <Line data={getChartData(reports, this.state.activeFilter)}
              options={options} height="320" />
        <div className="filters">
          <ul id="chart-pills" className="nav nav-pills ct-orange">
            {this.renderFilterItem('Year')}
            {this.renderFilterItem('Month')}
            {this.renderFilterItem('Week')}
          </ul>
        </div>
      </div>
    );
  }
}
