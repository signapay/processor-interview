/**
 * 
 * Base class for all credit cards
 * 
 */
const ErrorCodes = require('../errorCodes');
const AbstractCard = require('./abstractCard');
const validRegex = /^3[47][0-9]{13}?$/;
const typeRegex = /^3[0-9]{15}?$/;
const TYPE = "AMEX";
class AmexCard extends AbstractCard{
    constructor() {
        super();
    }
    /**
     * 
     * @returns credit card type
     */
    getType() {
        return TYPE;
    }
    /**
     * 
     * @param {*} number 
     * @returns true if the given number matches this credit card type, false otherwise
     */
    isThisType(number){
        if( number && typeRegex.test(number) ){
            return true;
        }
        return false;
    }
    getCardValidationRegex(){
        return validRegex;
    }
}

module.exports = AmexCard;