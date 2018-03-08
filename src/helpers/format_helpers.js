import _ from 'lodash';

export const formatDate = (date, options) => {
  const formatOptions = options || { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', formatOptions);
};

export const formatTime = (seconds) => {
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

export const formatDateAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  return formatTime(seconds);
};

/* eslint-disable arrow-body-style */
export const formatDuration = (seconds) => {
  return new Date(parseInt(seconds * 1000, 10))
    .toISOString().substr(14, 5);
};
/* eslint-enable arrow-body-style */

const formatSeconds = (seconds, rounded = true) => {
  if (seconds === 1) {
    return '1 second';
  }
  const formatted = rounded ? Math.floor(seconds) : seconds;
  return `${formatted} seconds`;
};

const formatMinutes = (minutes) => {
  if (minutes < 2) {
    return '1 minute';
  }
  return `${Math.floor(minutes)} minutes`;
};

const formatHours = (hours) => {
  if (hours < 2) {
    return '1 hour';
  }
  return `${Math.floor(hours)} hours`;
};

export const formatDurationString = (seconds) => {
  const roundedSeconds = _.round(seconds, 3);
  if (seconds < 1) {
    return 'Less than a second';
  } else if (seconds < 60) {
    return formatSeconds(roundedSeconds, false);
  }
  const minutes = roundedSeconds / 60;
  if (minutes === 1) {
    return '1 minute';
  } else if (minutes < 60) {
    return `${formatMinutes(minutes)}, ${formatSeconds(seconds % 60)}`;
  }
  const hours = minutes / 60;
  if (hours === 1) {
    return '1 hour';
  }
  return `${formatHours(hours)}, ${formatMinutes(minutes % 60)}`;
};
