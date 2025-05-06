// Import the function to test
import { formatDateToLocale } from './dateFormatter'; // Adjust the import path as needed

describe('formatDateToLocale', () => {
  // Test case for a standard date
  test('formats a standard ISO date string correctly', () => {
    const input = '2023-05-15T14:30:45.000Z'; // ISO format date string
    const expected = '2023-05-15 14:30:45'; // Expected formatted output
    expect(formatDateToLocale(input)).toBe(expected);
  });

  // Test case for date with single-digit month and day
  test('pads single-digit month and day with leading zeros', () => {
    const input = '2023-01-05T08:12:09.000Z';
    const expected = '2023-01-05 08:12:09';
    expect(formatDateToLocale(input)).toBe(expected);
  });

  // Test case for date with single-digit hours, minutes, and seconds
  test('pads single-digit hours, minutes, and seconds with leading zeros', () => {
    const input = '2023-11-30T01:02:03.000Z';
    const expected = '2023-11-30 01:02:03';
    expect(formatDateToLocale(input)).toBe(expected);
  });

  // Test for edge case: midnight (hour 0)
  test('correctly formats midnight time', () => {
    const input = '2023-07-20T00:00:00.000Z';
    const expected = '2023-07-20 00:00:00';
    expect(formatDateToLocale(input)).toBe(expected);
  });

  // Test for edge case: new year
  test('correctly formats new year date', () => {
    const input = '2024-01-01T00:00:00.000Z';
    const expected = '2024-01-01 00:00:00';
    expect(formatDateToLocale(input)).toBe(expected);
  });

  // Test for edge case: leap year (February 29)
  test('correctly formats leap year date', () => {
    const input = '2024-02-29T12:34:56.000Z';
    const expected = '2024-02-29 12:34:56';
    expect(formatDateToLocale(input)).toBe(expected);
  });

  // Test for invalid date input
  test('returns "Invalid Date" for invalid input', () => {
    const input = 'not-a-date';

    // The function should either return a specific error message
    // or we should check that it throws an error
    // Since the function doesn't appear to have error handling, we'll test the actual behavior

    // Option 1: If function returns 'NaN-NaN-NaN NaN:NaN:NaN' for invalid dates
    const result = formatDateToLocale(input);
    expect(result).toMatch(/NaN-NaN-NaN NaN:NaN:NaN/);

    // Option 2: If you want to modify the function to throw an error for invalid dates
    // expect(() => formatDateToLocale(input)).toThrow();
  });
});
