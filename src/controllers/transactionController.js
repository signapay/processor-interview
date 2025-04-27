const TransactionModel = require('../model/transactionModel');
const transactionModel = new TransactionModel();

const FileModel = require('../model/fileModel');
const fileModel = new FileModel();

const ErrorModel = require('../model/errorModel');
const errorModel = new ErrorModel();

const CardFactory = require('../domain/cards/cardFactory')
const cardFactory = new CardFactory();

const DBTransactionModel = require('../model/dbTransactionModel');
const dbTransactionModel = new DBTransactionModel();
const Util = require('../domain/util');
const UploadProcessStats = require('../domain/uploadProcessStats');
const ErrorCodes = require('../domain/errorCodes')


/**
 * Workhorse of the system
 * 1) Processed data uploaded via file upload (CSV/JSON/XML)
 * 2) Persist transaction data
 * 3) Persist error data (bogus transactions)
 * 4) Persist file name record with ingestion stats
 */
class TransactionController {

    async processFile(fileName, data) {
        // Check if the file name is valid
        let cleansedFileName = Util.safeFileName(fileName);
        if( await fileModel.fileProcessed(cleansedFileName)) {
            throw new Error("File already processed: " + cleansedFileName);
        }
        try {
            let stats = new UploadProcessStats(cleansedFileName);
            await this.processDataBulk(cleansedFileName,data,stats);
            await fileModel.updateFile(cleansedFileName, "completed",stats);
            stats.setMessage("Completed"); 
            return stats;
        } catch (error) {
            //lets roll everything back.....
            console.log(error);
            deleteFile(cleansedFileName);
            deleteErrors(cleansedFileName);
            deleteTransactions(cleansedFileName);
            throw new Error("Error during file processing: " + error.message);
        }

    }
    isEmptyRow(row) {
        if( !row || Object.keys(row).length == 0) {
            return true;
        }
        for( const key in row) {
            if( row[key] && row[key].trim().length > 0) {
                return false;
            }
        }
        return true;
    }


    async processDataBulk(fileName,data,stats) {
        let transactions = [];
        let errors = [];
        for( let i = 0; i < data.length; i++) {
            const row = data[i];
            if( this.isEmptyRow(row)) {
                stats.incrementIgnored();
                continue;
            }
            if( i % 1000 == 0) {
               console.log("row " + i + " of " + data.length);
            }
            let counter = String(i).padStart(6, '0');
            let transaction = {"transaction_id": fileName + "_" + counter};
            transaction["file_name"] = fileName;
            transaction["card_number"] = Util.safeString(row.cardNumber,"");
            transaction["amount"] = Util.safeFloat(row.amount,null);
            transaction["card_type"] = "";
            transaction["timestamp"] = Util.safeTimestamp(row.timestamp,null);
            this.validate(transaction);

            if( !transaction["error_codes"] ) {
                transactions.push(transaction);
            }else{
                transaction['record'] = JSON.stringify(row);
                errors.push(transaction);
            }
            if( transactions.length >= 500) {
                console.log("Saving transactions " + transactions.length);
                await transactionModel.saveTransactionsBulk(transactions);
                stats.incrementTransactionsSavedBulk(transactions.length);
                transactions = [];
            }
            if( errors.length >= 500) {
                console.log("Saving errors " + errors.length);
                await errorModel.saveErrorsBulk(errors);
                stats.incrementErrorsSavedBulk(errors.length);
                errors = [];
            }
        }
        if( transactions.length > 0) {
            await transactionModel.saveTransactionsBulk(transactions);
            stats.incrementTransactionsSavedBulk(transactions.length);
            transactions = [];
        }
        if( errors.length > 0) {
            await errorModel.saveErrorsBulk(errors);
            stats.incrementErrorsSavedBulk(errors.length);
            errors = [];
        }

    }

    validate(transaction) {
        // Logic to validate the transaction
        let errors = [];

        if (!transaction.card_number || transaction.card_number.trim().length == 0) {
            errors.push(ErrorCodes.NO_CARD_NUMBER.code);
        }else{
            let card = cardFactory.getCard(transaction.card_number);
            if( card != undefined ){
                transaction.card_type = card.getType();
                card.validate(transaction.card_number,errors);
            }else{
                errors.push(ErrorCodes.FAILED_CARD_VENDOR_VALIDATION.code);
            }
        }
        if (transaction.amount == null ) {
            errors.push(ErrorCodes.NO_TRANSACTION_AMOUNT.code);
        }else if (transaction.transaction_amount == 0 ) {
            errors.push(ErrorCodes.ZERO_TRANSACTION_AMOUNT.code);
        }else if (transaction.transaction_amount > 99999999.99) {
            errors.push(ErrorCodes.TRANSACTION_AMOUNT_TOO_LARGE.code);
        }
        if( !transaction.timestamp ){
            errors.push(ErrorCodes.NO_TIMESTAMP.code);
        }
        if( errors.length > 0) {
            transaction.error_codes = errors.join(",");
        }
    }


    //########################################################################/

    async processFileTransactional(fileName, data) {

        let client = null;
        try {
            client = await dbTransactionModel.getTransactionClient();
            await client.query('BEGIN');
            // Check if the file name is valid
            let cleansedFileName = Util.safeFileName(fileName);
            if( await fileModel.fileProcessedTransactional(cleansedFileName,client)) {
                throw new Error("File already processed: " + cleansedFileName);
            }
            let stats = new UploadProcessStats(cleansedFileName);
            await this.processDataBulkTransactional(cleansedFileName,data,stats,client);
            await fileModel.addFileTransactional(cleansedFileName,stats,client);
            stats.setMessage("Completed"); 
            await client.query("COMMIT");
            return stats;
        }catch(error){
            await client.query('ROLLBACK');
            console.error('Transaction failed:', error);
        } finally{
            await dbTransactionModel.releaseTransactionClient(client);

        }
    }

    async processDataBulkTransactional(fileName,data,stats,client) {
        let transactions = [];
        let errors = [];
        let transactionCount = 0;
        let errorCount = 0;
        for( let i = 0; i < data.length; i++) {
            const row = data[i];
            if( this.isEmptyRow(row)) {
                stats.incrementIgnored();
                continue;
            }
            if( i % 1000 == 0) {
                console.log("row " + i + " of " + data.length);
            }
            let counter = String(i).padStart(6, '0');
            let transaction = {"transaction_id": fileName + "_" + counter};
            transaction["file_name"] = fileName;
            transaction["card_number"] = Util.safeString(row.cardNumber,"");
            transaction["amount"] = Util.safeFloat(row.amount,null);
            transaction["card_type"] = "";
            transaction["timestamp"] = Util.safeTimestamp(row.timestamp,null);
            this.validate(transaction);

            if( !transaction["error_codes"] ) {
                transactions.push(transaction);
            }else{
                transaction['record'] = JSON.stringify(row);
                errors.push(transaction);
            }
            if( transactions.length >= 200) {
                transactionCount += transactions.length;
                console.log("Saving transactions " + transactionCount );
                await transactionModel.saveTransactionsBulkTransactional(transactions,client);
                stats.incrementTransactionsSavedBulk(transactions.length);
                transactions = [];
            }
            if( errors.length >= 200) {
                errorCount += errors.length;
                console.log("Saving errors " + errorCount );
                await errorModel.saveErrorsBulkTransactional(errors,client);
                stats.incrementErrorsSavedBulk(errors.length);
                errors = [];
            }
        }
        if( transactions.length > 0) {
            transactionCount += transactions.length;
            console.log("Saving transactions " + transactionCount );
            await transactionModel.saveTransactionsBulkTransactional(transactions,client);
            stats.incrementTransactionsSavedBulk(transactions.length);
            transactions = [];
        }
        if( errors.length > 0) {
            errorCount += transactions.length;
            console.log("Saving errors " + errorCount );
            await errorModel.saveErrorsBulkTransactional(errors,client);
            stats.incrementErrorsSavedBulk(errors.length);
            errors = [];
        }
        

    }

  

}

module.exports = TransactionController;