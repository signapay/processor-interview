class DBResponse {
    /**
     * @param {boolean} success - Indicates if the operation was successful.
     * @param {string|null} error - Error message if any, or null if no error.
     * @param {number} rowsInserted - Number of rows inserted.
     * @param {number} rowsUpdated - Number of rows updated.
     * @param {number} rowsIgnored - Number of rows ignored.
     * @param {number} rowsFailed - Number of rows that failed.
     */
    constructor(success, error, rowsInserted, rowsUpdated, rowsIgnored, rowsFailed) {
        this.success = success; // Indicates if the operation was successful
        this.error = error; // Error message if any
        this.rowsInserted = rowsInserted; // Number of rows inserted
        this.rowsUpdated = rowsUpdated; // Number of rows updated
        this.rowsIgnored = rowsIgnored; // Number of rows ignored
        this.rowsFailed = rowsFailed; // Number of rows that failed
    }
}

module.exports = DBResponse;