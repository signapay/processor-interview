/**
 * 
 * Base class for all credit cards
 * 
 */
const ErrorCodes = require('../errorCodes');
const AbstractCard = require('./abstractCard');
const validRegex = /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/;
const typeRegex = /^6[0-9]{15}?$/;
const TYPE = "Discover";
class DiscoverCard extends AbstractCard{
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

module.exports = DiscoverCard;