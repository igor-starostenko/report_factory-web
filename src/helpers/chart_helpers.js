import _ from 'lodash';

const lastDate = (dateType, number) => {
  let result = [];
  for (let i = number - 1; i >= 0; i--) {
      const d = new Date();
      let date = d[`set${dateType}`](d[`get${dateType}`]() - i);
      result.push(new Date(date));
  }

  return(result);
}

export function lastDays(number) {
  return lastDate('Date', number);
}

export function lastMonths(number) {
  return lastDate('Month', number);
}

export function formatDates(dates, options) {
  const formatOptions = options || { month: 'short', day: 'numeric' };
  return _.map(dates, (date) => {
    return date.toLocaleDateString('en-US', formatOptions);
  });
}

export function reportsCreatedDates(reports, parseDate) {
  const projectReports = _.values(reports);
  return _.map(projectReports, report => {
    return new Date(parseDate(report));
  });
}

const isSameDay = (dateOne, dateTwo) => {
  return dateOne.getFullYear() === dateTwo.getFullYear()
    && dateOne.getDate() === dateTwo.getDate();
}

const isSameMonth = (dateOne, dateTwo) => {
  return dateOne.getFullYear() === dateTwo.getFullYear()
    && dateOne.getMonth() === dateTwo.getMonth();
}

const reportsPerDate = (dates, reportsDates, matchFun) => {
  if(reportsDates.length === 0) {
    return _.map(dates, d => 0);
  }
  let numberOfReportsArr = new Array();
  for(let i = 0; i < dates.length; i++) {
    let numberOfReports = 0;
    for(let y = 0; y < reportsDates.length; y++) {
      if(matchFun(reportsDates[y], dates[i])) {
        numberOfReports++;
      }
    }
    numberOfReportsArr.push(numberOfReports);
  }
  return numberOfReportsArr;
}

export function reportsPerDay(dates, reportsDates) {
  return reportsPerDate(dates, reportsDates, isSameDay);
}

export function reportsPerMonth(dates, reportsDates) {
  return reportsPerDate(dates, reportsDates, isSameMonth);
}

export function getColors(opacity = 1) {
  return {
    blue: `rgba(52,114,247,${opacity})`,
    pink: `rgba(247,52,114,${opacity})`,
    green: `rgba(0,145,0,${opacity})`,
    red: `rgba(215,0,0,${opacity})`,
    orange: `rgba(255,212,91,${opacity})`,
    grey: `rgba(220,220,220,${opacity})`,
  }
}

export function setOpacity(color, opacity = 1) {
  const startIndex = color.lastIndexOf(',');
  const endIndex = color.lastIndexOf(')') + 1;
  const toReplace = color.substring(startIndex, endIndex);
  return color.replace(toReplace, `,${opacity})`)
}

export function groupReportsByProjects(reports, parseProjectName) {
  if (_.isEmpty(reports)) {
    return [];
  }
  let projectReports = {};
  for (let i = 0; i < reports.length ; i++) {
    const projectName = parseProjectName(reports[i]);
    if (projectReports[projectName]) {
      projectReports[projectName].push(reports[i]);
    } else {
      projectReports[projectName] = [reports[i]];
    }
  }
  return projectReports;
}
