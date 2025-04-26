/**
 * 
 * Base class for all credit cards
 * 
 */
const ErrorCodes = require('../errorCodes')
const regex = /^\d{16}?$/;
class AbstractCard {
    constructor() {
    }

    /**
     * 
     * @returns credit card type
     */
    getType() {
        throw new Error("Method 'getType' must be implemented in subclass.");
    }
    /**
     * 
     * @param {*} number 
     * @returns true if the given number matches this credit card type, false otherwise
     */
    isThisType(number){
        throw new Error("Method 'isThisType' must be implemented in subclass.");
    }

    getCardValidationRegex(){
        throw new Error("Method '_getCardValidationRegex' must be implemented in subclass.");
    }

    validate(number,errorCodes){
        if( !number || !regex.test(number) ){
            errorCodes.push(ErrorCodes.INVALID_CARD_NUMBER.code);
        }
        if( number && !this.getCardValidationRegex().test(number) ){
            errorCodes.push(ErrorCodes.FAILED_CARD_VENDOR_VALIDATION.code);
        }
    }
}

module.exports = AbstractCard;