const AbstractModel = require('./abstractModel');
DBResponse = require('../domain/dbResponse');
const Util = require('../domain/util');

/**
 * Models the CRUD operations of the errors table - transactions that are invalid
 */
class ErrorModel extends AbstractModel {
    constructor() {
        super();
    }
    async clear() {
      this._clearTable("errors");
    }
    
    async saveError(transaction) {
        let client = null;
        // Logic to save the error transaction to a database or a file
        // For example, you can insert the errors into a database table
        try {
            client = await this._getPool().connect();
            const query = `
              INSERT INTO errors (transaction_id,
              file_name,
              record, 
              error_codes)
              VALUES ($1, $2, $3, $4)
              RETURNING *;
            `;
            const values = [
                Util.safeSubstring(transaction.transaction_id,255),
                Util.safeSubstring(transaction.file_name,255),
                Util.safeSubstring(transaction.record,255),
                Util.safeSubstring(transaction.error_codes,255),
            ];
            const res = await client.query(query, values);
            //console.log('Inserted row:', res.rows[0]);
            return new DBResponse(true, null, 1, 0, 0, 0);
          } catch (err) {
            //console.error('Error inserting data:', err);
            return new DBResponse(true, err, 0, 0, 0, 0);
          } finally {
            if( client != null) {
              client.release();
            }
          }
    }   

    async saveErrorsBulk(transactions) {
      let client = null;
      try {
          client = await this._getPool().connect();
          return await this.saveErrorsBulkTransactional(transactions,client);
        } catch (err) {
          //console.error('Error inserting data:', err);
          return new DBResponse(true, err, 0, 0, 0, 0);
        } finally {
          if( client != null) {
            client.release();
          }
        }
  }   
    
  async saveErrorsBulkTransactional(transactions,client) {


    try {
        let values = [];
        transactions.forEach((transaction) => {
            values.push("('" + transaction.transaction_id + "','" +
                Util.safeSubstring(transaction.file_name,255) + "','" +
                Util.safeSubstring(transaction.record,255) + "','" +
                Util.safeSubstring(transaction.error_codes,255) + "')"
              );
             
        });
        const query = `
          INSERT INTO errors (transaction_id,
              file_name,
              record, 
              error_codes)
          VALUES ${values.join(',')}
          RETURNING *;
        `;

        const res = await client.query(query);
        //console.log('Inserted row:', res.rows[0]);
        return new DBResponse(true, null, 1, 0, 0, 0);
      } catch (err) {
        console.error('Error inserting data:', err);
        return new DBResponse(true, err, 0, 0, 0, 0);
      } finally {
        
      }
} 
    async getErrors(fileName,offset,limit) {
      let client = null;
      try {
          client = await this._getPool().connect();
          const query = `SELECT * FROM errors 
          where file_name = $3 
          order by created_date, transaction_id 
          limit $1 offset $2;`;
          const res = await client.query(query,[limit,offset,fileName]);
          return res.rows;
      } catch (err) {
          console.error('Error fetching transactions:', err);
          return [];
      } finally {
          if( client != null) {
              client.release();
          }
      }
  }
}

module.exports = ErrorModel;