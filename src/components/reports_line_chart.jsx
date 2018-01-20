import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import _ from 'lodash';
import { Line as LineChart } from 'react-chartjs';
import { getReports } from '../actions';

class ReportsLineChart extends Component {
  componentDidMount() {
    const { reports } = this.props;
    if (!reports || _.isEmpty(reports)) {
      const { projectName, xApiKey } = this.props;
      this.props.getReports(projectName, xApiKey);
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
      return new Date(report.attributes.date.created_at);
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
    			label: this.props.projectName,
    			fillColor: "rgba(220,220,220,0.2)",
    			strokeColor: "rgba(220,220,220,1)",
    			pointColor: "rgba(220,220,220,1)",
    			pointStrokeColor: "#fff",
    			pointHighlightFill: "#fff",
    			pointHighlightStroke: "rgba(220,220,220,1)",
    			data: data
    		}
    	]
    };

    return (
      <div>
        <LineChart data={chartData} options={null} width="600" height="250" />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  reports: state.reports,
  xApiKey: state.xApiKey,
});

export default connect(mapStateToProps, { getReports })(ReportsLineChart);