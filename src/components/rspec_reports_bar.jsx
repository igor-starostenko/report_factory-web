import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import BarChart from './bar_chart';
import { getRspecReports } from '../actions/reports_actions';
import { getColors, setOpacity } from '../helpers/chart_helpers';

const lastReports = (reports, number) => {
  const keys = _.takeRight(_.keys(reports), number);
  return _.map(keys, key => reports[key]);
};

const getDuration = (reports, number = 10) => {
  if (_.isEmpty(reports)) {
    return _.times(number, _.constant(0));
  }
  return _.map(reports, report => report.attributes.summary.duration);
};

const getStatus = (reports, number = 10) => {
  const colors = getColors();
  if (_.isEmpty(reports)) {
    return _.times(number, _.constant(colors.grey));
  }
  return _.map(reports, (report) => {
    const failureCount = report.attributes.summary.failure_count;
    if (failureCount > 0) {
      return colors.red;
    }
    return colors.green;
  });
};

const setAllOpacity = (colors, opacity = 1) => _.map(colors, c => setOpacity(c, opacity));

const getChartData = (reports, activeFilter) => {
  let displayedNumber;
  switch (activeFilter) {
    case 'Last 10':
      displayedNumber = 10;
      break;
    case 'Last 30':
      displayedNumber = 30;
      break;
    default: throw new Error(`Filter ${activeFilter} is not supported`);
  }
  const last = lastReports(reports, displayedNumber);
  const data = getDuration(last, displayedNumber);
  const colors = getStatus(last, displayedNumber);

  return {
    labels: _.times(displayedNumber, _.constant('')),
    datasets: [
      {
        fillColor: setAllOpacity(colors, 0.4),
        strokeColor: setAllOpacity(colors, 0.7),
        highlightFill: setAllOpacity(colors, 0.6),
        highlightStroke: setAllOpacity(colors, 1),
        data,
      },
    ],
  };
};

const chartOptions = {
  barStrokeWidth: 2,
  barValueSpacing: 3,
  scaleLineWidth: 3,
  scaleFontFamily: "'Helvetica Neue'",
  scaleFontSize: 15,
  scaleShowVerticalLines: false,
  responsive: true,
  maintainAspectRatio: false,
  tooltipFillColor: 'rgba(255,165,91,0.8)',
  tooltipTemplate: '<%= value %> seconds',
};

class RspecReportsBar extends Component {
  componentDidMount() {
    const { rspecReports } = this.props;
    if (!rspecReports || _.isEmpty(rspecReports)) {
      const { projectName, xApiKey } = this.props;
      this.props.getRspecReports(projectName, xApiKey);
    }
  }

  render() {
    return (<BarChart
      getChartData={getChartData}
      options={chartOptions}
      reports={this.props.rspecReports}
    />);
  }
}

const mapStateToProps = (state, ownProps) => ({
  rspecReports: state.rspecReports[ownProps.projectName],
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, { getRspecReports })(RspecReportsBar);
