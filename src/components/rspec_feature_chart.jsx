import React, { Component } from 'react';
import _ from 'lodash';
import { PolarArea } from 'react-chartjs';
import { getColors, setOpacity } from '../helpers/chart_helpers';
import { formatDuration } from '../helpers/format_helpers';
import styles from './styles/RspecReportPieChart.css';

const options = {
  responsive: true,
  maintainAspectRatio: false,
  percentageInnerCutout: 15,
  animateRotate: false,
  segmentShowStroke: false,
  tooltipFillColor: 'rgba(255,165,91,0.8)',
  tooltipTemplate: v => (`${v.label}: ${formatDuration(v.value)}`),
};

const colors = getColors();

/* eslint-disable arrow-body-style */
const groupByFeatures = (examples) => {
  return _.groupBy(examples, (example) => {
    return _.split(example.full_description, ' ', 1)[0];
  });
};

const countFeatureLength = (examples) => {
  const runTimes = _.map(examples, example => (example.run_time));
  return _.reduce(runTimes, (sum, n) => (sum + n), 0);
};

const getChartData = (examples) => {
  let colorIndex = 3;
  const colorNames = Object.keys(colors);
  return _.map(groupByFeatures(examples), (featureExamples, feature) => {
    const color = _.get(colors, `${colorNames[colorIndex]}`);
    /* eslint-disable no-unused-expressions */
    colorIndex === colorNames.length - 1 ? colorIndex = 0 : colorIndex += 1;
    /* eslint-enable no-unused-expressions */
    return {
      value: countFeatureLength(featureExamples),
      color: setOpacity(color, 0.9),
      highlight: setOpacity(color, 0.7),
      label: feature,
    };
  });
};
/* eslint-enable arrow-body-style */

export default class ReportsFeatureChart extends Component {
  render() {
    if (_.isEmpty(this.props.examples)) {
      return (<div />);
    }

    return (
      <div className={styles.chart}>
        <h4 className={styles.chartTitle}>Features</h4>
        <PolarArea
          data={getChartData(this.props.examples)}
          options={options}
          height="320"
          redraw
        />
      </div>
    );
  }
}