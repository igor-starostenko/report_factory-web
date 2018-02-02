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

  reportsCreatedDates(reports) {
    const reportsArr = _.values(reports);
    return _.map(reportsArr, (report) => {
      return new Date(report.attributes.report.date.created_at);
    });
  }

  isSameDay(dateOne, dateTwo) {
    return dateOne.getFullYear() === dateTwo.getFullYear()
      && dateOne.getDate() === dateTwo.getDate();
  }

  reportsPerDay(reports, dates) {
    const reportsDates = this.reportsCreatedDates(reports);
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

  groupReportsByProjects(reports) {
    if (_.isEmpty(reports)) {
      return [];
    }
    let projectReports = {};
    let projectName;
    for (let i = 0; i < reports.length ; i++) {
        projectName = _.get(reports[i], 'attributes.report.project_name');
        if (projectReports[projectName]) {
          projectReports[projectName].push(reports[i]);
        } else {
          projectReports[projectName] = [reports[i]];
        }
    }
    return projectReports;
  }

  colorByIndex(index, opacity = '1') {
    switch (index) {
      case 0: return `rgba(52,114,247,${opacity})`;
      case 1: return `rgba(247,52,114,${opacity})`;
      case 2: return `rgba(52,247,114,${opacity})`;
      case 3: return `rgba(255,212,91,${opacity})`;
      default: return `rgba(220,220,220,${opacity})`;
    }
  }

  projectReportsDatasets(reports, dates) {
    let datasets = [];
    let colorIndex = 0;
    let color;
    _.forIn(reports, (projectReports, projectName) => {
  		datasets.push({
  			label: projectName,
  			fillColor: this.colorByIndex(colorIndex, 0.4),
  			strokeColor: this.colorByIndex(colorIndex, 0.8),
  			pointColor: this.colorByIndex(colorIndex, 0.9),
  			pointStrokeColor: "#fff",
  			pointHighlightFill: this.colorByIndex(colorIndex, 1),
  			pointHighlightStroke: "rgba(220,220,220,1)",
  			data: this.reportsPerDay(projectReports, dates)
  		});
      colorIndex === 3 ? colorIndex = 0 : colorIndex++;
    });
    return datasets;
  }

  render() {
    const dates = this.lastDays(10);
    const days = this.formatDays(dates);
    const reports = this.groupReportsByProjects(this.props.reports);

    if (_.isEmpty(reports)) {
      return (<div className="loading">Loading</div>);
    }

    const chartData = {
    	labels: days,
    	datasets: this.projectReportsDatasets(reports, dates),
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
