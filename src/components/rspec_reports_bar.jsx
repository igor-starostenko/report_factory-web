import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Bar as BarChart } from 'react-chartjs';
import { getRspecReports } from '../actions/reports_actions';
import { getColors, setOpacity  } from '../helpers/chart_helpers';

const defaultTimeFormat = {
  month: 'short', day: 'numeric', 'hour': 'numeric', 'minute': 'numeric',
};

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
      const formatOptions = options || defaultTimeFormat;
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
    const colors = getColors();
    if(_.isEmpty(reports)) {
      return _.times(number, _.constant(colors['grey']));
    }
    return _.map(reports, report => {
      const failureCount = report.attributes.summary.failure_count;
      if(failureCount > 0) {
        return colors['red'];
      }
      return colors['green'];
    });
  }

  setAllOpacity(colors, opacity = 1) {
    return _.map(colors, color => setOpacity(color, opacity));
  }

  render() {
    const displayedNumber = 10;
    const reports = this.lastReports(displayedNumber);
    if(_.isEmpty(reports)) {
      return (<div className="loading">Loading...</div>);
    }
    const time = this.getReportTime(reports, displayedNumber);
    const data = this.getDuration(reports, displayedNumber);
    const colors = this.getStatus(reports, displayedNumber);

    const chartData = {
    	labels: _.times(displayedNumber, _.constant('')),
    	datasets: [
    		{
    			label: this.props.projectName,
          fillColor: this.setAllOpacity(colors, 0.4),
      		strokeColor: this.setAllOpacity(colors, 0.7),
          highlightFill: this.setAllOpacity(colors, 0.6),
    			highlightStroke: this.setAllOpacity(colors, 1),
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
      responsive: true,
      maintainAspectRatio: false,
    }

    return (
      <div>
        <BarChart data={chartData} options={options} height="500" />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  rspecReports: state.rspecReports[ownProps.projectName],
  xApiKey: state.xApiKey,
});

export default connect(mapStateToProps, { getRspecReports })(RspecReportsBar);
