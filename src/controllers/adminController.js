const ErrorModel = require('../model/errorModel');
const TransactionModel = require('../model/transactionModel');
const FileModel = require('../model/fileModel');
const BootstrapModel = require('../model/bootstrapModel');

const transactionModel = new TransactionModel();
const errorModel = new ErrorModel();
const fileModel = new FileModel();

/**
 * Handles various use cases to call db for
 * 
 * 1) Clearing (truncate) of data
 * 2) Getting File Names (that have been processed)
 * 3) Get the File record by name
 * 4) Get transactions (paginated)
 * 5) Get errors (paginated)
 */
class AdminController {

    async createTables() {
        await new BootstrapModel().createTables();
    }
    async clearAll() {
        await fileModel.clear();
        await transactionModel.clear();
        await errorModel.clear();
        return true;
    }

    async getFileNames() {
        const files = await fileModel.getFileNames();
        return files;
    }


    async getFile(fileName) {
        const files = await fileModel.getFile(fileName);
        return files;
    }

    async getCardTypeStats(cardType,startDate,endDate,offset,limit) {
        const files = await transactionModel.getCardTypeStats(cardType,startDate,endDate,offset,limit);
        return files;
    }

    async getCardStats(card,startDate,endDate,offset,limit) {
        const files = await transactionModel.getCardStats(card,startDate,endDate,offset,limit);
        return files;
    }
    async getTransactions(fileName, offset,limit) {
        const transactions = await transactionModel.getTransactions(fileName, limit, offset);
        return transactions;
    }

    async getErrors(fileName, offset,limit) {
        const transactions = await errorModel.getErrors(fileName, limit, offset);
        return transactions;
    }
    

}

module.exports = AdminController;