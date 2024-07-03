import { ExecOptions } from "child_process";
import { insertFailedTransaction, saveTransaction, updateCardBalance } from "./db";
import { validateAmount, validateCard, validateDescription, validateTargetCard, validateTransactionType } from "./validations/transaction_validator";
import { Transaction } from "./interfaces/transaction";


const validateTransaction = async (transaction: Transaction) => {
    const { 'Card Number': cardNumber, 'Transaction Amount': transactionAmount, 
    'Transaction Type':transactionType, 'Description' : description, 'Target Card number': targetCard } = transaction;

    //TODO - make the validation rule dynamic
    const errorMsg = validateCard(cardNumber) + validateAmount(transactionAmount) + validateTransactionType(transactionType) 
                    + validateDescription(description) + validateTargetCard(transactionType, targetCard);

    return errorMsg;
}


export const persistData = async (transaction: Transaction, fileID: number) => {
    const { 'Account Number': accountName, 'Card Number': cardNumber, 'Transaction Amount': transactionAmount, 
    'Transaction Type':transactionType, 'Target Card number': targetCard } = transaction;
    let transactionId: number = -1;
    try{

        // save transaction_details
        transactionId = await saveTransaction(fileID, transaction);

        //validate transaction record
        const errorMsg = await validateTransaction(transaction);

         // update account balance if validation is success
        (errorMsg && errorMsg.length > 0) ? await insertFailedTransaction(fileID, transactionId, errorMsg) : 
                                            await updateCardBalance(accountName, cardNumber, Number(transactionAmount), transactionType, targetCard);
    }
    catch(error) {
        console.log('--- Error while persisting transaction data -- ', error);
        //insert error into failed transaction table with error message
         await insertFailedTransaction(fileID, transactionId, (error as Error).message);
    }    
}