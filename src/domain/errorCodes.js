const ErrorCodes = {
    NO_CARD_NUMBER : { code:'NO_CARD_NUMBER',description: 'Missing card number'},
    INVALID_CARD_NUMBER : { code:'INVALID_CARD_NUMBER',description: 'Invalid Card Number'},
    FAILED_CARD_VENDOR_VALIDATION : { code:'FAILED_CARD_VENDOR_VALIDATION',description: "Did not pass card type's validation"},
    TRANSACTION_AMOUNT_TOO_LARGE : { code:"TRANSACTION_AMOUNT_TOO_LARGE",description: 'Transaction is greater than 99999999.99'},
    ZERO_TRANSACTION_AMOUNT : { code:'ZERO_TRANSACTION_AMOUNT',description: 'Zero transaction amount'},
    NO_TRANSACTION_AMOUNT : { code:'NO_TRANSACTION_AMOUNT',description: 'Missing transaction amount'},
    NO_TIMESTAMP : { code:'NO_TIMESTAMP',description: 'Missing timestamp'}
}
module.exports = ErrorCodes;