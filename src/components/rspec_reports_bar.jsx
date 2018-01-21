import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import _ from 'lodash';
import { Bar as BarChart } from 'react-chartjs';
import { getRspecReports } from '../actions';

const defaultTimeFormat = () => ({
  month: 'short', day: 'numeric', 'hour': 'numeric', 'minute': 'numeric',
});

class RspecReportsBar extends Component {
  componentDidMount() {
    const { rspecReports } = this.props;
    if (!rspecReports || _.isEmpty(rspecReports)) {
      const { projectName, xApiKey } = this.props;
      this.props.getRspecReports(projectName, xApiKey);
    }
  }

  lastReports(number) {
    const { rspecReports } = this.props;
    const keys = _.takeRight(_.keys(rspecReports), number);
    return _.map(keys, key => rspecReports[key]);
  }

  getReportTime(reports, number = 10, options) {
    if(_.isEmpty(reports)) {
      return _.times(number, _.constant(0));
    }
    return _.map(reports, report => {
      const formatOptions = options || defaultTimeFormat();
      const date = new Date(report.attributes.date.created_at);
      return date.toLocaleDateString('en-US', formatOptions);
    });
  }

  getDuration(reports, number = 10) {
    if(_.isEmpty(reports)) {
      return _.times(number, _.constant(0));
    }
    return _.map(reports, report => report.attributes.summary.duration);
  }

  getStatus(reports, number = 10) {
    if(_.isEmpty(reports)) {
      return _.times(number, _.constant('rgba(220,220,220,0.8)'));
    }
    return _.map(reports, report => {
      const failureCount = report.attributes.summary.failure_count;
      if(failureCount > 0) {
        return 'rgba(215,0,0,o)';
      }
      return 'rgba(0,145,0,o)';
    });
  }

  setOpacity(colors, opacity = '1') {
    return _.map(colors, color => _.replace(color, 'o', opacity));
  }

  render() {
    const displayedNumber = 10;
    const reports = this.lastReports(displayedNumber);
    if(_.isEmpty(reports)) {
      return (<div>Loading...</div>);
    }
    const time = this.getReportTime(reports, displayedNumber);
    const data = this.getDuration(reports, displayedNumber);
    const colors = this.getStatus(reports, displayedNumber);

    const chartData = {
    	labels: _.times(displayedNumber, _.constant('')),
    	datasets: [
    		{
    			label: this.props.projectName,
          fillColor: this.setOpacity(colors, 0.4),
      		strokeColor: this.setOpacity(colors, 0.7),
          highlightFill: this.setOpacity(colors, 0.6),
    			highlightStroke: this.setOpacity(colors, 1),
    			data: data
    		}
    	]
    };

    const options = {
      barStrokeWidth : 2,
      barValueSpacing : 3,
      scaleLineWidth: 3,
      scaleFontFamily: "'Helvetica Neue'",
      scaleFontSize: 15,
      scaleShowVerticalLines: false,
    }

    return (
      <div>
        <BarChart data={chartData} options={options} width="600" height="500" />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  rspecReports: state.rspecReports[ownProps.projectName],
  xApiKey: state.xApiKey,
});

export default connect(mapStateToProps, { getRspecReports })(RspecReportsBar);