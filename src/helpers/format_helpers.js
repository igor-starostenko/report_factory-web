import round from 'lodash/round';

export const capitalizeFirstLetter = string =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const removeSpecialCharacters = string =>
  string.replace(/[^\w\s]/gi, '');

export const pluralize = (count, noun, suffix = 's') =>
  `${count} ${noun}${count !== 1 ? suffix : ''}`;

export const formatTotalReports = count => {
  if (!count || count < 1) {
    return '';
  }
  return `Reports submitted: ${count}`;
};

export const formatTotalString = reports => {
  const totalReportsCount = Object.keys(reports).length;
  return formatTotalReports(totalReportsCount);
};

export const formatDate = (date, options) => {
  const formatOptions = options || {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-US', formatOptions);
};

export const formatTime = seconds => {
  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return `${interval} years`;
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return `${interval} months`;
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return `${interval} days`;
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return `${interval} hours`;
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return `${interval} minutes`;
  }
  return `${Math.floor(seconds)} seconds`;
};

export const formatDateAgo = date => {
  const seconds = Math.floor((new Date() - date) / 1000);
  return formatTime(seconds);
};

export const formatDuration = seconds => {
  const date = new Date(parseInt(seconds * 1000, 10));
  const hours = date.toISOString().substr(11, 2);
  if (parseInt(hours, 10) > 0) {
    return '>1 hour';
  }
  return date.toISOString().substr(14, 5);
};

const formatSeconds = (seconds, rounded = true) => {
  if (seconds === 1) {
    return '1 second';
  }
  const formatted = rounded ? Math.floor(seconds) : seconds;
  return `${formatted} seconds`;
};

const formatMinutes = minutes => {
  if (minutes < 2) {
    return '1 minute';
  }
  return `${Math.floor(minutes)} minutes`;
};

const formatHours = hours => {
  if (hours < 2) {
    return '1 hour';
  }
  return `${Math.floor(hours)} hours`;
};

export const formatDurationString = seconds => {
  const roundedSeconds = round(seconds, 3);
  if (seconds < 1) {
    return 'Less than a second';
  }
  if (seconds < 60) {
    return formatSeconds(roundedSeconds, false);
  }
  const minutes = roundedSeconds / 60;
  if (minutes === 1) {
    return '1 minute';
  }
  if (minutes < 60) {
    return `${formatMinutes(minutes)}, ${formatSeconds(seconds % 60)}`;
  }
  const hours = minutes / 60;
  if (hours === 1) {
    return '1 hour';
  }
  return `${formatHours(hours)}, ${formatMinutes(minutes % 60)}`;
};
