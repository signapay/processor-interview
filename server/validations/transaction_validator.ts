import { DESCRIPTION_TOO_LONG, INVALID_AMOUNT, INVALID_CARD_NUMBER, INVALID_TARGET_CARD_NUMBER, INVALID_TRANSACTION_TYPE, TRANSACTION_TYPES, TRANSFER } from "../utils/constants";

//TODO - need to refine this credit card number check -- to make sure it works for all the card types
export const validateCard = (cardNumber: string) => {
    console.log('-- checking for valid card::', cardNumber);
    console.log('-- checking for valid card::', isValidCard(cardNumber));

    if (!isValidCard(cardNumber))
        return INVALID_CARD_NUMBER + ':' + cardNumber + "||";
    return '';
}

const isValidCard = (cardNumber: string) => {
    // accept only digits, dashes or spaces
    if (/[^0-9-\s]+/.test(cardNumber)) return false;
    
    return true;

    // // The Luhn Algorithm - commented for testing
    //     var nCheck = 0, nDigit = 0, bEven = false;
    //     cardNumber = cardNumber.replace(/\D/g, "");

    //     for (var n = cardNumber.length - 1; n >= 0; n--) {
    //         var cDigit = cardNumber.charAt(n),
    //             nDigit = parseInt(cDigit, 10);

    //         if (bEven) {
    //             if ((nDigit *= 2) > 9) nDigit -= 9;
    //         }
    //         nCheck += nDigit;
    //         bEven = !bEven;
    //     }

    // return (nCheck % 10) == 0;
}

export const validateAmount = (amt: number) => {
    if(isNaN(amt)) return INVALID_AMOUNT +":"+amt+ "||";
    return '';
}

export const validateTransactionType = (type: string) => {
    if(!TRANSACTION_TYPES.includes(type)) return INVALID_TRANSACTION_TYPE+":"+type+ "||";
    return '';
}

export const validateDescription = (desc: string) => {
    if(desc && desc.length > 200) return DESCRIPTION_TOO_LONG+ "||";
    return '';
}

export const validateTargetCard = (type: string, targetCard: string) => {
    if(type === TRANSFER){
        if(!targetCard || validateCard(targetCard).length > 0) return INVALID_TARGET_CARD_NUMBER+":"+targetCard;
    }
    return '';
}