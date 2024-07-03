import Database from 'better-sqlite3';
import { CREDIT, DEBIT, LOADED, TRANSFER } from './utils/constants';
import { CREATE_TABLES_QUERY, GET_ACCOUNT_DETAILS, GET_BAD_TRANSACTIONS, GET_BALANCE_AMT, GET_FILE_ID, GET_TRANSACTIONS, 
        GET_TRANSACTION_ID, INSERT_ACCOUNT_DETAILS, INSERT_FAILED_TRANSACTIONS, 
        INSERT_FILE_HISTORY, INSERT_TRANSACTION_DETAILS, UPDATE_BALANCE_AMT, UPDATE_FILE_HISTORY } from './utils/db_queries';
import { Transaction } from './interfaces/transaction';

const db = new Database('./database.db');

export const resetDatabase = async () => {
  try{  
  db.exec(CREATE_TABLES_QUERY);
  } catch(error){
    console.error('Error while resetting DB:'+(error as Error).message);
  }
};

export const saveFileHistory = async (fileName: string, user: string) =>{
  let fileId: number = 1;
  try{ 
    const seqRow:any = db.prepare( GET_FILE_ID ).get();
    if(seqRow) fileId = seqRow.fileId;
    const stmt = db.prepare( INSERT_FILE_HISTORY );
    stmt.run(fileName, user);
  } catch(error){
      console.error('-- Error while saving file history:', error);
      throw new Error('Error while saving file history:'+ (error as Error).message);
  }
  return fileId;
}

export const saveTransaction = async (fileID: number, transaction: Transaction) => {
  let transactionId: number = 1;
  try{ 
    const seqRow:any = db.prepare( GET_TRANSACTION_ID ).get();
    if(seqRow) transactionId = seqRow.transaction_id;
    const { 'Account Number': accountName, 'Card Number': cardNumber, 'Transaction Amount': transactionAmount, 
    'Transaction Type':transactionType, 'Description' : description, 'Target Card number': targetCard } = transaction;
    const stmt = db.prepare( INSERT_TRANSACTION_DETAILS );
    const inserted = stmt.run(fileID, transactionId, accountName, cardNumber, transactionAmount, transactionType, description, targetCard);
    console.log('--- inside saveTransaction -- inserted:', inserted);
  } catch(error){
      console.error('-- Error while saving transaction:', error);
      throw new Error('Error while saving transaction details:'+ (error as Error).message);
  }
  return transactionId;
};

export const getTransactions = async () => {
  const stmt = db.prepare( GET_TRANSACTIONS );
  return stmt.all();
};

export const getAccountDetails = async () => {
  const stmt = db.prepare( GET_ACCOUNT_DETAILS );
  return stmt.all();
};

export const getNegativeBalanceAccounts = async () => {
  const stmt = db.prepare( GET_ACCOUNT_DETAILS );
  return stmt.all();
};

export const getBadTransactions = async () => {
  const stmt = db.prepare( GET_BAD_TRANSACTIONS );
  return stmt.all();
};

export const updateCardBalance = async (accountName:string, cardNumber: string, transactionAmount: number, transactionType: string, targetCard: string) => {
  try{
    if(transactionType === TRANSFER || transactionType === DEBIT){
        // handling both Debit positive and negative amount
        let updateAmt =  (transactionAmount * -1) ;
        await updateAmount(accountName, cardNumber, updateAmt);
        if(transactionType === TRANSFER){
          await updateAmount('New Account', targetCard, transactionAmount); // TODO - account name is set as 'New Account' here since the data does not have target account name
        }
    }
    else if (transactionType === CREDIT)
    {
      // credit amount to target cardNumber -- can be positive or negative
      await updateAmount(accountName, cardNumber, transactionAmount);
    }
  }catch(error){
    console.error('-- Error while updateCardBalance:', error);
    throw error;
  }
};


const updateAmount = (accountName:string, cardNumber: string, amt: number) => {
  try{  
      let finalAmt: number = amt;
      //check if the card number already exists
      const existingRow:any = db.prepare( GET_BALANCE_AMT ).get(cardNumber, accountName);
      if(existingRow){
        finalAmt = Number(existingRow.balance_amt) + amt;
        //update balance 
        const updateCardAmtStmt = db.prepare( UPDATE_BALANCE_AMT );
        updateCardAmtStmt.run(finalAmt, cardNumber, accountName );
      }
      else{
        const insertCardDetailsStmt = db.prepare( INSERT_ACCOUNT_DETAILS );
        insertCardDetailsStmt.run(cardNumber, accountName, finalAmt);
      }
  }
  catch(error){
    console.error('-- Error while updateAmount:', error);
    throw new Error('Error while updateAmount:'+ (error as Error).message);
  }
}

export const insertFailedTransaction=(fileId: number, transactionId: number, errMsg: string)=>{
  try {
    console.log('-- inside insertFailedTransaction -- transactionId:', transactionId);
    console.log('-- inside insertFailedTransaction -- errorMsg:', errMsg);
    const stmt = db.prepare( INSERT_FAILED_TRANSACTIONS );
    stmt.run(fileId, transactionId, errMsg);
  }
  catch(error){
    console.error('-- Error while insertFailedTransaction:', error);
    //throw new Error('Error while insertFailedTransaction:'+ (error as Error).message);
  }
}

export const updateFileHistory = (fileId: number, count: number)=>{
  try { 
    console.log('--- inside updateFileHistory -- fileId:' +fileId +' , count:'+count);
    const stmt = db.prepare( UPDATE_FILE_HISTORY);
    stmt.run(LOADED, fileId);
 }
  catch(error){
    console.error('-- Error while updateFileHistory:', error);
    throw new Error('Error while updateFileHistory:'+ (error as Error).message);
  }
}