import _ from 'lodash';
import { capitalizeFirstLetter, formatDateAgo } from './format_helpers';

const dateAgoString = (dateString) => {
  if (!dateString) {
    return 'Never';
  }
  return `${formatDateAgo(new Date(dateString))} ago`;
};

const numberOfExamples = (number) => {
  if (!number || number === 0) {
    return 'No examples';
  } else if (number === 1) {
    return '1 example';
  }
  return `${number} examples`;
};

/* eslint-disable arrow-body-style */
export const filterScenarios = (examples, search) => {
  return _.filter(examples, (scenario) => {
    return _.every(search, (word) => {
      const scenarioName = scenario.fullDescription.toLowerCase();
      return scenarioName.indexOf(word.toLowerCase()) !== -1;
    });
  });
};
/* eslint-enable arrow-body-style */

export const slicePageScenarios = (scenarios, page, perPage) => {
  const startIndex = (page * perPage) - perPage;
  const endIndex = startIndex + perPage;
  return scenarios.slice(startIndex, endIndex);
};

export const firstScenarioColumn = (scenario) => {
  if (!scenario) {
    return {};
  }
  return {
    'Total Runs': scenario.totalRuns,
    Passed: numberOfExamples(scenario.totalPassed),
    Failed: numberOfExamples(scenario.totalFailed),
    Pending: numberOfExamples(scenario.totalPending),
  };
};

export const secondScenarioColumn = (scenario) => {
  if (!scenario) {
    return {};
  }
  return {
    Status: capitalizeFirstLetter(scenario.lastStatus),
    'Last Run': dateAgoString(scenario.lastRun),
    'Last Passed': dateAgoString(scenario.lastPassed),
    'Last Failed': dateAgoString(scenario.lastFailed),
  };
};
