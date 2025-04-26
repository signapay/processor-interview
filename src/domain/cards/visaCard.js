/**
 * 
 * Base class for all credit cards
 * 
 */
const ErrorCodes = require('../errorCodes');
const AbstractCard = require('./abstractCard');
const validRegex = /^4[0-9]{12}(?:[0-9]{3})?$/;
const typeRegex = /^4[0-9]{15}?$/;
const TYPE = "Visa";
class VisaCard extends AbstractCard{
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

module.exports = VisaCard;