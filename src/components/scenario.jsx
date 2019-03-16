import React from 'react';
import { PropTypes } from 'prop-types';
import { CollapsibleItem, Details, Loading, ScenarioSuccessChart } from '.';
import {
  firstScenarioColumn,
  secondScenarioColumn,
} from '../helpers/scenarios_helpers';
import styles from './styles/Scenario.css';

const statusClassNames = {
  failed: 'failedScenario',
  passed: 'passedScenario',
  default: 'pendingScenario',
};

export default function Scenario(props) {
  const {
    projectName,
    scenarioDetails,
    status,
    title,
    withProjectName,
    xApiKey,
  } = props;

  function onExpand() {
    if (!scenarioDetails) {
      props.queryScenario(projectName, title, xApiKey);
    }
  }

  const statusName = statusClassNames[status];
  const extendedDetailsStyle = withProjectName
    ? 'scenarioExtendedDetails'
    : 'projectScenariosExtendedDetails';

  return (
    <CollapsibleItem
      className={`${styles.scenario} ${styles[statusName] || styles.default}`}
      onExpand={onExpand}
      {...props}
    >
      {scenarioDetails ? (
        <div className={styles[extendedDetailsStyle]}>
          {withProjectName && <Details rows={{ Project: projectName }} />}
          <div className={styles.scenarioSuccessChart}>
            <ScenarioSuccessChart scenario={scenarioDetails} />
          </div>
          <div className={styles.scenarioPrimaryDetails}>
            <Details rows={firstScenarioColumn(scenarioDetails)} />
          </div>
          <div className={styles.scenarioSecondaryDetails}>
            <Details rows={secondScenarioColumn(scenarioDetails)} />
          </div>
        </div>
      ) : (
        <Loading className={styles.loadingScenario} />
      )}
    </CollapsibleItem>
  );
}

Scenario.propTypes = {
  projectName: PropTypes.string.isRequired,
  scenarioDetails: PropTypes.shape({
    lastFailed: PropTypes.string,
    lastPassed: PropTypes.string,
    lastRun: PropTypes.string,
    lastStatus: PropTypes.string,
    name: PropTypes.string.isRequired,
    projectName: PropTypes.string.isRequired,
    totalFailed: PropTypes.number,
    totalPassed: PropTypes.number,
    totalPending: PropTypes.number,
    totalRuns: PropTypes.number,
  }),
  status: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  withProjectName: PropTypes.bool.isRequired,
  xApiKey: PropTypes.string.isRequired,
  queryScenario: PropTypes.func.isRequired,
};

Scenario.defaultProps = {
  scenarioDetails: null,
};
