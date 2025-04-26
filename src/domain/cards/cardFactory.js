/**
 * 
 * Factory class for all credit cards
 * 
 */
const AmexCard = require('./amexCard');
const VisaCard = require('./visaCard');
const DiscoverCard = require('./discoverCard');
const MasterCard = require('./masterCard');

const cards = [
    new AmexCard(),
    new VisaCard(),
    new DiscoverCard(),
    new MasterCard()
];

class CardFactory {
    constructor() {
    }

    /**
     * 
     * @returns credit card handler
     */
    getCard(number) {
        for( let i = 0; i < cards.length; i++ ){
            if( cards[i].isThisType(number) ){
                return cards[i];
            }
        }
        return null;
    }

    validCardType(cardType){
        for( let i = 0; i < cards.length; i++ ){
            if( cards[i].getType() === cardType ){
                return true
            }
        }
        return false;
    }

    getCardTypes(){
        let types = [];
        for( let i = 0; i < cards.length; i++ ){
            types.push({"type":cards[i].getType() })
        }
        return types;
    }
    
}

module.exports = CardFactory;