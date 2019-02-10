import _ from 'lodash';

const lastDate = (dateType, number) => {
  const result = [];
  for (let i = number - 1; i >= 0; i -= 1) {
    const d = new Date();
    if (dateType === 'Month') {
      d.setDate(1);
    }
    const date = d[`set${dateType}`](d[`get${dateType}`]() - i);
    result.push(new Date(date));
  }

  return result;
};

export function lastDays(number) {
  return lastDate('Date', number);
}

export function lastMonths(number) {
  return lastDate('Month', number);
}

export function formatDates(dates, options) {
  const formatOptions = options || { month: 'short', day: 'numeric' };
  return _.map(dates, d => d.toLocaleDateString('en-US', formatOptions));
}

export function reportsCreatedDates(reports, parseDate) {
  const projectReports = _.values(reports);
  return _.map(projectReports, report => new Date(parseDate(report)));
}

/* eslint-disable arrow-body-style */
const isSameMonth = (dateOne, dateTwo) => {
  return (
    dateOne.getFullYear() === dateTwo.getFullYear() &&
    dateOne.getMonth() === dateTwo.getMonth()
  );
};

const isSameDay = (dateOne, dateTwo) => {
  return (
    isSameMonth(dateOne, dateTwo) && dateOne.getDate() === dateTwo.getDate()
  );
};
/* eslint-enable arrow-body-style */

const reportsPerDate = (dates, reportsDates, matchFun) => {
  if (reportsDates.length === 0) {
    return _.map(dates, () => 0);
  }
  const numberOfReportsArr = [];
  for (let i = 0; i < dates.length; i += 1) {
    let numberOfReports = 0;
    for (let y = 0; y < reportsDates.length; y += 1) {
      if (matchFun(reportsDates[y], dates[i])) {
        numberOfReports += 1;
      }
    }
    numberOfReportsArr.push(numberOfReports);
  }
  return numberOfReportsArr;
};

export function reportsPerDay(dates, reportsDates) {
  return reportsPerDate(dates, reportsDates, isSameDay);
}

export function reportsPerMonth(dates, reportsDates) {
  return reportsPerDate(dates, reportsDates, isSameMonth);
}

export function randomColor(opacity = 1) {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgba(${r},${g},${b},${opacity})`;
}

export function getColors(opacity = 1) {
  return {
    orange: `rgba(255, 212, 91, ${opacity})`,
    green: `rgba(0, 145, 0, ${opacity})`,
    cyan: `rgba(25, 153, 237, ${opacity})`,
    pink: `rgba(247, 52, 114, ${opacity})`,
    purple: `rgba(149, 33, 237, ${opacity})`,
    yellow: `rgba(227, 239, 59, ${opacity})`,
    red: `rgba(215, 0, 0, ${opacity})`,
    blue: `rgba(52, 114, 247, ${opacity})`,
    grey: `rgba(220, 220, 220, ${opacity})`,
  };
}

export function setOpacity(color, opacity = 1) {
  const startIndex = color.lastIndexOf(',');
  const endIndex = color.lastIndexOf(')') + 1;
  const toReplace = color.substring(startIndex, endIndex);
  return color.replace(toReplace, `,${opacity})`);
}

export function validateInteger(value) {
  return value % 1 === 0 ? value : null;
}

export function validatePositive(value) {
  const integer = validateInteger(value);
  return integer && integer >= 0 ? value : null;
}

export function groupReportsByProjects(reports, parseProjectName) {
  if (_.isEmpty(reports)) {
    return [];
  }
  const projectReports = {};
  for (let i = 0; i < reports.length; i += 1) {
    const projectName = parseProjectName(reports[i]);
    if (projectReports[projectName]) {
      projectReports[projectName].push(reports[i]);
    } else {
      projectReports[projectName] = [reports[i]];
    }
  }
  return projectReports;
}
