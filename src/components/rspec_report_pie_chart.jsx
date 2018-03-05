import React, { Component } from 'react';
import _ from 'lodash';
import { Pie } from 'react-chartjs';
import { getColors, setOpacity } from '../helpers/chart_helpers';
// import styles from './styles/RspecReportPieChart.css';

const options = {
  responsive: true,
  maintainAspectRatio: false,
  segmentStrokeWidth: 1,
  percentageInnerCutout: 15,
  animateRotate: false,
  tooltipFillColor: 'rgba(255,165,91,0.8)',
  tooltipTemplate: '<%= label %>',
};

const colors = getColors();

const getDataColor = (status) => {
  if (status === 'passed') {
    return colors.green;
  } else if (status === 'pending') {
    return colors.orange;
  }
  return colors.red;
};

const getChartData = examples => (
  _.map(examples, (example) => {
    const color = getDataColor(example.status);
    return {
      label: example.description,
      value: example.run_time,
      color: setOpacity(color, 0.7),
      highlight: setOpacity(color, 0.8),
    };
  }));


export default class RspecReportPieChart extends Component {
  render() {
    if (_.isEmpty(this.props.examples)) {
      return (<div />);
    }

    return (
      <Pie
        data={getChartData(this.props.examples)}
        options={options}
        height="320"
        redraw
      />
    );
  }
}
