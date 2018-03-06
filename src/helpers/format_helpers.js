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

export const formatDurationString = (seconds) => {
  const formatSeconds = _.round(seconds, 3);
  if (formatSeconds === 0) {
    return 'Less than a second';
  }
  if (formatSeconds < 2) {
    return `${formatSeconds} of a second`;
  }
  const minutes = Math.floor(formatSeconds / 60);
  if (minutes < 1) {
    return `${formatSeconds} seconds`;
  } else if (minutes > 1 && minutes < 2) {
    return `1 minute, ${Math.floor(formatSeconds - 60)} seconds`;
  }
  const hours = Math.floor(formatSeconds / 3600);
  if (hours < 1) {
    const floorSeconds = Math.floor(formatSeconds - (minutes * 60));
    return `${minutes} minutes, ${floorSeconds} seconds`;
  } else if (hours > 1 && hours < 2) {
    return `1 hour, ${minutes - 60} minutes`;
  }
  return `${hours} hours, ${minutes - (hours * 60)}`;
};
