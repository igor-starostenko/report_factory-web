import React, { Component } from 'react';
import _ from 'lodash';
import styles from './styles/Details.css';

export default class Details extends Component {
  render() {
    return _.map(this.props.rows, (value, key) => (
      <div className={styles.scenarioDetailsRow} key={key}>
        <div className={styles.scenarioDetailsParam}>{key}:</div>
        <div className={styles.scenarioDetailsValue}>{value}</div>
      </div>
    ));
  }
}
