import _ from 'lodash';
import { capitalizeFirstLetter, formatDateAgo } from './format_helpers';

export const statusName = (status) => {
  if (status === 'failed') {
    return 'failedScenario';
  } else if (status === 'passed') {
    return 'passedScenario';
  }
  return 'pendingScenario';
};

const dateAgoString = (dateString) => {
  if (!dateString) {
    return 'Never';
  }
  return `${formatDateAgo(new Date(dateString))} ago`;
}

const numberOfExamples = (number) => {
  if (!number || number === 0) {
    return `No examples`;
  } else if (number === 1) {
    return '1 example';
  }
  return `${number} examples`;
}

export const filterScenarios = (scenarios, search) => {
  return _.filter(scenarios.examples, (scenario) => {
     return _.every(search, (word) => {
       const scenarioName = scenario.name.toLowerCase();
       return scenarioName.indexOf(word.toLowerCase()) !== -1;
     });
  });
}

export const slicePageScenarios = (scenarios, page, perPage) => {
  const startIndex = page * perPage - perPage;
  const endIndex = startIndex + perPage;
  return scenarios.slice(startIndex, endIndex);
}

export const firstScenarioColumn = (scenario) => ({
  'Total Runs': scenario.total_runs,
  'Passed': numberOfExamples(scenario.total_passed),
  'Failed': numberOfExamples(scenario.total_failed),
  'Pending': numberOfExamples(scenario.total_pending),
});

export const secondScenarioColumn = (scenario) => ({
  'Status': capitalizeFirstLetter(scenario.last_status),
  'Last Run': dateAgoString(scenario.last_run),
  'Last Passed': dateAgoString(scenario.last_passed),
  'Last Failed': dateAgoString(scenario.last_failed),
});
