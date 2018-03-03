import React, { Component } from 'react';
import _ from 'lodash';
import { formatDuration } from '../helpers/format_helpers';
import { CollapsibleItem } from '../components';
import styles from './styles/RspecReportExamplesList.css';

const statusName = (status) => {
  if (status === 'failed') {
    return 'failedExample';
  } else if (status === 'passed') {
    return 'passedExample';
  }
  return 'pendingExample';
};

export default class RspecReportExamplesList extends Component {
  static renderBacktrace(backtraces) {
    let i = 0;
    return _.map(backtraces, (backtrace) => {
      i += 1;
      return (<p key={i}>{backtrace}</p>);
    });
  }

  static renderExampleDetails(example) {
    const details = {
      'Line Number': `${example.file_path}:${example.line_number}`,
      'Run Time': formatDuration(example.run_time),
    };
    if (example.pending_message) {
      details['Pending Message'] = example.pending_message;
    }
    if (example.exception) {
      details[example.exception.classname] = example.exception.message;
      details.Backtrace = this.renderBacktrace(example.exception.backtrace);
    }
    return _.map(details, (value, key) => (
      <div className={styles.exampleDetailsRow} key={key}>
        <div className={styles.exampleDetailsParam}>{key}:</div>
        <div className={styles.exampleDetailsValue}>{value}</div>
      </div>
    ));
  }

  renderExamples() {
    return _.map(this.props.examples, (example) => {
      const status = statusName(example.status);
      return (
        <CollapsibleItem
          className={`${styles.example} ${styles[status]}`}
          title={example.full_description}
          details={this.constructor.renderExampleDetails(example)}
          key={example.id}
        />
      );
    });
  }

  render() {
    if (!this.props.examples) {
      return (<div className="loading">Loading...</div>);
    }

    if (_.isEmpty(this.props.examples)) {
      return (<div className="loading">This report does not have any examples</div>);
    }

    return (
      <div>
        <div className={styles.examplesHeader}>Examples:</div>
        <div className={styles.reportExamplesList}>
          {this.renderExamples()}
        </div>
      </div>
    );
  }
}
