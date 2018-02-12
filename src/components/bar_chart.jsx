import React, { Component } from 'react';
import { Bar } from 'react-chartjs';

export default class BarChart extends Component {
  constructor(state) {
    super(state);
    this.state = { activeFilter: 'Last 10' };
  }

  setFilter(name) {
    this.setState({ activeFilter: name });
  }

  renderFilterItem(name) {
    const className = this.state.activeFilter === name ? 'active' : '';
    return (
      /* eslint-disable jsx-a11y/click-events-have-key-events */
      /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
      /* eslint-disable react/jsx-no-bind */
      <li className={className} onClick={this.setFilter.bind(this, name)}>
        <a>{name}</a>
      </li>
      /* eslint-enable react/jsx-no-bind */
      /* eslint-enable jsx-a11y/no-noninteractive-element-interactions */
      /* eslint-enable jsx-a11y/click-events-have-key-events */
    );
  }

  render() {
    const { reports, options, getChartData } = this.props;

    return (
      <div>
        <Bar
          data={getChartData(reports, this.state.activeFilter)}
          options={options}
          height="350"
          redraw
        />
        <div className="filters">
          <ul id="chart-pills" className="nav nav-pills ct-orange">
            {this.renderFilterItem('Last 30')}
            {this.renderFilterItem('Last 10')}
          </ul>
        </div>
      </div>
    );
  }
}
