export function validateCardNumber(cardNumber: string): {
  isValid: boolean;
  cardType: string | null;
  rejectionReason?: string;
} {
  if (!cardNumber || cardNumber.length < 1) {
    return { isValid: false, cardType: null, rejectionReason: 'Card number is missing' };
  }

  const firstDigit = cardNumber[0];
  let cardType = null;

  switch (firstDigit) {
    case '3':
      cardType = 'Amex';
      break;
    case '4':
      cardType = 'Visa';
      break;
    case '5':
      cardType = 'MasterCard';
      break;
    case '6':
      cardType = 'Discover';
      break;
    default:
      return { isValid: false, cardType: null, rejectionReason: 'Unrecognized card type' };
  }

  // Basic validation - could be expanded for more robust validation
  if (cardNumber.length < 13 || cardNumber.length > 19) {
    return { isValid: false, cardType, rejectionReason: 'Invalid card number length' };
  }

  // Check that all characters are digits
  if (!/^\d+$/.test(cardNumber)) {
    return { isValid: false, cardType, rejectionReason: 'Card number contains non-digit characters' };
  }

  return { isValid: true, cardType };
}
