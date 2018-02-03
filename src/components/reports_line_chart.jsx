import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Line as LineChart } from 'react-chartjs';
import { getReports } from '../actions/reports_actions';
import { lastDays, lastMonths, formatDates, reportsPerDay, reportsPerMonth,
         reportsCreatedDates } from '../helpers/chart_helpers';

const parseDate = report => {
  return _.get(report, 'attributes.date.created_at');
}

const dataForDays = (reports, dates) => {
  const reportsDates = reportsCreatedDates(reports, parseDate);
  return reportsPerDay(dates, reportsDates);
}

const dataForMonths = (reports, dates) => {
  const reportsDates = reportsCreatedDates(reports, parseDate);
  return reportsPerMonth(dates, reportsDates);
}

class ReportsLineChart extends Component {
  constructor(state) {
    super(state);
    this.state = { activeFilter: 'Week' }
  }

  componentDidMount() {
    const { reports } = this.props;
    if (!reports || _.isEmpty(reports)) {
      const { projectName, xApiKey } = this.props;
      this.props.getReports(projectName, xApiKey);
    }
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
    let units, data, dates;
    switch (this.state.activeFilter) {
      case 'Week':
        units = lastDays(8);
        dates = formatDates(units);
        data = dataForDays(this.props.reports, units);
        break;
      case 'Month':
        units = lastDays(32);
        dates = formatDates(units);
        data = dataForDays(this.props.reports, units);
        break;
      case 'Year':
        units = lastMonths(12);
        dates = formatDates(units, { month: 'short' });
        data = dataForMonths(this.props.reports, units);
        break;
    }

    const chartData = {
    	labels: dates,
    	datasets: [
    		{
    			label: this.props.projectName,
    			fillColor: "rgba(255,212,91,0.4)",
    			strokeColor: "rgba(255,165,91,0.8)",
    			pointColor: "rgba(255,165,91,0.9)",
    			pointStrokeColor: "#fff",
    			pointHighlightFill: "rgba(255,165,91,1)",
    			data: data
    		}
    	]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      tooltipFillColor: "rgba(255,165,91,0.8)",
      tooltipTemplate: "<%= value %>",
    }

    return (
      <div>
        <LineChart data={chartData} options={options} height="320" />
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

const mapStateToProps = (state, ownProps) => ({
  reports: state.reports[ownProps.projectName],
  xApiKey: state.xApiKey,
});

export default connect(mapStateToProps, { getReports })(ReportsLineChart);
