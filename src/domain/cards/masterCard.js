/**
 * 
 * Base class for all credit cards
 * 
 */
const ErrorCodes = require('../errorCodes');
const AbstractCard = require('./abstractCard');
const validRegex = /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/;
const typeRegex = /^5[0-9]{15}?$/;
const TYPE = "MasterCard";
class MasterCard extends AbstractCard{
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

module.exports = MasterCard;