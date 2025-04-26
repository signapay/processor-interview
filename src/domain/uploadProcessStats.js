class UploadProcessStats {

    constructor(fileName) {
        this.transactionsSaved = 0;
        this.errorsSaved = 0;
        this.ignored = 0;
        this.message = "";
        this.fileName = fileName;
    }

    incrementTransactionsSaved() {
        this.transactionsSaved++;
    }
    incrementTransactionsSavedBulk(inc) {
        this.transactionsSaved += inc;    
    }
    incrementErrorsSaved() {
        this.errorsSaved++;
    }
    incrementErrorsSavedBulk(inc) {
        this.errorsSaved+=inc;
    }
    incrementIgnored() {
        this.ignored++;
    }
    setMessage(message) {
        this.message = message;
    }

    getTotal() {
        return this.transactionsSaved + this.errorsSaved + this.ignored;
    }
}

module.exports = UploadProcessStats;