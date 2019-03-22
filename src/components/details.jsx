import React from 'react';
import map from 'lodash/map';
import styles from './styles/Details.css';

export default function Details(props) {
  return map(props.rows, (value, key) => (
    <div className={styles.scenarioDetailsRow} key={key}>
      <div className={styles.scenarioDetailsParam}>{key}:</div>
      <div className={styles.scenarioDetailsValue}>{value}</div>
    </div>
  ));
}
