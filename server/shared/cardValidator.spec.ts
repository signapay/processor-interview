import { validateCardNumber } from './cardValidator';

describe('Card Validator', () => {
  test('should identify Amex cards correctly', () => {
    const result = validateCardNumber('378282246310005');
    expect(result.isValid).toBe(true);
    expect(result.cardType).toBe('Amex');
  });

  test('should identify Visa cards correctly', () => {
    const result = validateCardNumber('4111111111111111');
    expect(result.isValid).toBe(true);
    expect(result.cardType).toBe('Visa');
  });

  test('should identify MasterCard cards correctly', () => {
    const result = validateCardNumber('5555555555554444');
    expect(result.isValid).toBe(true);
    expect(result.cardType).toBe('MasterCard');
  });

  test('should identify Discover cards correctly', () => {
    const result = validateCardNumber('6011111111111117');
    expect(result.isValid).toBe(true);
    expect(result.cardType).toBe('Discover');
  });

  test('should reject cards with invalid starting numbers', () => {
    const result = validateCardNumber('7123456789012345');
    expect(result.isValid).toBe(false);
    expect(result.rejectionReason).toBe('Unrecognized type');
  });

  test('should reject cards with invalid length', () => {
    const result = validateCardNumber('41111');
    expect(result.isValid).toBe(false);
    expect(result.rejectionReason).toBe('Invalid number length');
  });

  test('should reject cards with non-digit characters', () => {
    const result = validateCardNumber('4111111A111111');
    expect(result.isValid).toBe(false);
    expect(result.rejectionReason).toBe('Number contains non-digit characters');
  });

  test('should handle empty card numbers', () => {
    const result = validateCardNumber('');
    expect(result.isValid).toBe(false);
    expect(result.rejectionReason).toBe('Number is missing');
  });
});
