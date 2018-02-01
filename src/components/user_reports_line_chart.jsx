import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Line as LineChart } from 'react-chartjs';
import { getUserReports } from '../actions/users_actions';

class UserReportsLineChart extends Component {
  componentDidMount() {
    const { reports } = this.props;
    if (!reports || _.isEmpty(reports)) {
      const { userId, xApiKey } = this.props;
      this.props.getUserReports(userId, xApiKey);
    }
  }

  lastDays(number) {
    let result = [];
    for (let i = number - 1; i >= 0; i--) {
        const d = new Date();
        let date = d.setDate(d.getDate() - i);
        result.push(new Date(date));
    }

    return(result);
  }

  formatDays(dates, options) {
    const formatOptions = options || { month: 'short', day: 'numeric' };
    return _.map(dates, (date) => {
      return date.toLocaleDateString('en-US', formatOptions);
    });
  }

  reportsCreatedDates() {
    const reportsArr = _.values(this.props.reports);
    return _.map(reportsArr, (report) => {
      return new Date(report.attributes.report.date.created_at);
    });
  }

  isSameDay(dateOne, dateTwo) {
    return dateOne.getFullYear() === dateTwo.getFullYear()
      && dateOne.getDate() === dateTwo.getDate();
  }

  reportsPerDay(dates) {
    const reportsDates = this.reportsCreatedDates();
    if(reportsDates.length === 0) {
      return _.map(dates, d => 0);
    }

    let numberOfReportsArr = new Array();
    for(let i = 0; i < dates.length; i++) {
      let numberOfReports = 0;
      for(let y = 0; y < reportsDates.length; y++) {
        if(this.isSameDay(reportsDates[y], dates[i])) {
          numberOfReports++;
        }
      }
      numberOfReportsArr.push(numberOfReports);
    }
    return numberOfReportsArr;
  }

  render() {
    const dates = this.lastDays(10);
    const days = this.formatDays(dates);
    const data = this.reportsPerDay(dates);

    const chartData = {
    	labels: days,
    	datasets: [
    		{
    			label: this.props.userId,
    			fillColor: "rgba(255,212,91,0.4)",
    			strokeColor: "rgba(255,165,91,0.9)",
    			pointColor: "rgba(255,165,91,1)",
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

const mapStateToProps = state  => ({
  reports: state.users.userReports.data,
  xApiKey: state.xApiKey,
});

export default connect(mapStateToProps, { getUserReports })(UserReportsLineChart);
