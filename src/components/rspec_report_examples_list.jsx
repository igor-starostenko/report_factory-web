import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { formatDurationString } from '../helpers/format_helpers';
import { CollapsibleItem, Loading } from '.';
import styles from './styles/RspecReportExamplesList.css';

const statusClassNames = {
  failed: 'failedExample',
  passed: 'passedExample',
  default: 'pendingExample',
};

function Backtrace(props) {
  let i = 0;
  return map(props.backtraces, backtrace => {
    i += 1;
    return <p key={i}>{backtrace}</p>;
  });
}

Backtrace.propTypes = {
  backtraces: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function ExampleDetails(props) {
  const { exception, filePath, lineNumber, pendingMessage, runTime } = props;

  const details = {
    'Line Number': `${filePath}:${lineNumber}`,
    'Run Time': formatDurationString(runTime),
  };
  if (pendingMessage) {
    details['Pending Message'] = pendingMessage;
  }
  if (exception) {
    details[exception.classname] = exception.message;
    details.backtrace = <Backtrace backtraces={exception.backtrace} />;
  }

  return map(details, (value, key) => (
    <div className={styles.exampleDetailsRow} key={key}>
      <div className={styles.exampleDetailsParam}>{key}:</div>
      <div className={styles.exampleDetailsValue}>{value}</div>
    </div>
  ));
}

ExampleDetails.propTypes = {
  filePath: PropTypes.string.isRequired,
  lineNumber: PropTypes.number.isRequired,
  pendingMessage: PropTypes.string,
  exception: PropTypes.shape({
    classname: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    backtrace: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
  runTime: PropTypes.number,
};

export default function RspecReportExamplesList(props) {
  const { examples } = props;

  if (!examples) {
    return <Loading />;
  }

  if (isEmpty(examples)) {
    return (
      <div className="loading">This report does not have any examples</div>
    );
  }

  return (
    <Fragment>
      <div className={styles.examplesHeader}>Examples:</div>
      <div className={styles.reportExamplesList}>
        {map(examples, example => {
          const status =
            statusClassNames[example.status] || statusClassNames.default;
          return (
            <CollapsibleItem
              className={`${styles.example} ${styles[status]}`}
              title={example.full_description}
              key={example.id}
            >
              <ExampleDetails
                filePath={example.file_path}
                exception={example.exception}
                lineNumber={example.line_number}
                pendingMessage={example.pending_message}
                runTime={example.run_time}
              />
            </CollapsibleItem>
          );
        })}
      </div>
    </Fragment>
  );
}

RspecReportExamplesList.propTypes = {
  examples: PropTypes.arrayOf(
    PropTypes.shape({
      file_path: PropTypes.string,
      exception: PropTypes.object,
      line_number: PropTypes.number,
      pending_message: PropTypes.string,
      run_time: PropTypes.number,
    }),
  ),
};

RspecReportExamplesList.defaultProps = {
  examples: [],
};
