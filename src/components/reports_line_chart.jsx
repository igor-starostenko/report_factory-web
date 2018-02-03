import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Line as LineChart } from 'react-chartjs';
import { getReports } from '../actions/reports_actions';
import { lastDays, formatDays, reportsPerDay, reportsCreatedDates } from '../helpers/chart_helpers';

const parseDate = report => {
  return _.get(report, 'attributes.date.created_at');
}

class ReportsLineChart extends Component {
  componentDidMount() {
    const { reports } = this.props;
    if (!reports || _.isEmpty(reports)) {
      const { projectName, xApiKey } = this.props;
      this.props.getReports(projectName, xApiKey);
    }
  }

  render() {
    const dates = lastDays(10);
    const days = formatDays(dates);
    const reportsDates = reportsCreatedDates(this.props.reports, parseDate);
    const data = reportsPerDay(dates, reportsDates);

    const chartData = {
    	labels: days,
    	datasets: [
    		{
    			label: this.props.projectName,
    			fillColor: "rgba(255,212,91,0.4)",
    			strokeColor: "rgba(255,165,91,0.8)",
    			pointColor: "rgba(255,165,91,0.9)",
    			pointStrokeColor: "#fff",
    			pointHighlightFill: "rgba(255,165,91,1)",
    			pointHighlightStroke: "rgba(220,220,220,1)",
    			data: data
    		}
    	]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
    }

    return (
      <div>
        <LineChart data={chartData} options={options} height="320" />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  reports: state.reports[ownProps.projectName],
  xApiKey: state.xApiKey,
});

export default connect(mapStateToProps, { getReports })(ReportsLineChart);
