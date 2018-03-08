import { formatDurationString } from '../src/helpers/format_helpers';

test('formats seconds < 1 second', () => {
  expect(formatDurationString(0.970459)).toBe('Less than a second');
});

test('formats seconds < 60 seconds', () => {
  expect(formatDurationString(59.970459)).toBe('59.97 seconds');
});

test('formats seconds < 2 minutes', () => {
  expect(formatDurationString(116.970459)).toBe('1 minute, 56 seconds');
});

test('formats seconds < 1 hour', () => {
  expect(formatDurationString(156.970459)).toBe('2 minutes, 36 seconds');
});

test('formats seconds < 2 hour', () => {
  expect(formatDurationString(3720.970459)).toBe('1 hour, 2 minutes');
});

test('formats seconds > 2 hours', () => {
  expect(formatDurationString(7368.970459)).toBe('2 hours, 2 minutes');
});
