const AbstractModel = require('./abstractModel');
DBResponse = require('../domain/dbResponse');

/**
 * Models CRUD operation on the transactions table
 */
class TransactionModel extends AbstractModel {
    constructor() {
        super();
    }
    async clear() {
      this._clearTable("transactions");
    }
    async updateTransactionsBalances(transactionIds) {
        let client = null;
        try {
            client = await this._getPool().connect();
            return await this.updateTransactionsBalancesTransactional(transactionIds,client);
        } catch (err) {
            console.error('Error updating transactions:', err);
            return new DBResponse(false, err, 0, 0, 0, 0);
        } finally {
            if( client != null) {
                client.release();
            }
        }
    }

    async getTransactions(fileName,offset,limit) {
      let client = null;
      try {
          client = await this._getPool().connect();
          const query = `SELECT * FROM transactions where file_name = $3 order by timestamp, transaction_id limit $1 offset $2;`;
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
  
  async getCardTypeStats(cardType,startDate,endDate,offset,limit) {
    let client = null;
    try {
       
        client = await this._getPool().connect();

        let query = '';
        let values = [];
        if( cardType ){
          values = [offset,limit,startDate,endDate,cardType];
          query = `SELECT card_type, sum(amount) as total_amount, count(transaction_id) as count 
          FROM transactions 
          WHERE card_type = $5 
          AND timestamp >= date_trunc('day', $3::date) 
          AND timestamp <= date_trunc('day', $4::date)  
          GROUP BY card_type 
          ORDER by card_type 
          limit $2 offset $1;`;
        }else{
          values = [offset,limit,startDate,endDate];
          query = `SELECT card_type, sum(amount) as total_amount, count(transaction_id) as count 
          FROM transactions 
          WHERE timestamp >= date_trunc('day', $3::date) 
          AND timestamp <= date_trunc('day', $4::date)
          GROUP BY card_type 
          ORDER by card_type 
          limit $2 offset $1;`;
        }
        const res = await client.query(query,values);
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

async getCardStats(card,startDate,endDate,offset,limit) {
  let client = null;
  try {
     
      client = await this._getPool().connect();
      let values = [offset,limit,startDate,endDate,'%'+card+'%'];
      let query = `SELECT card_type, sum(amount) as total_amount, count(transaction_id) as count 
      FROM transactions 
      WHERE card_number LIKE $5  
      AND timestamp >= date_trunc('day', $3::date) 
      AND timestamp <= date_trunc('day', $4::date)  
      GROUP BY card_type 
      ORDER by card_type 
      limit $2 offset $1;`;
      const res = await client.query(query,values);
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

    async saveTransaction(transaction) {
  
        let client = null;
        try {
            client = await this._getPool().connect();
            const query = `
              INSERT INTO transactions (transaction_id, 
              file_name, 
              card_number,
              cart_type
              amount, 
              timestamp)
              VALUES ($1, $2, $3, $4, $5, $6)
              RETURNING *;
            `;
            const values = [
                transaction.transaction_id,
                transaction.file_name,
                transaction.card_number,
                transaction.card__type,
                transaction.timestamp
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
    async saveTransactionsBulk(transactions) {
        let client = null;
        try {
            client = await this._getPool().connect();
            return await this.saveTransactionsBulkTransactional(transactions,client);
          } catch (err) {
            //console.error('Error inserting data:', err);
            return new DBResponse(true, err, 0, 0, 0, 0);
          } finally {
            if( client != null) {
              client.release();
            }
          }
    }

  async saveTransactionsBulkTransactional(transactions,client) {
      let lastQuery = null;
      try {
          let values = [];
          for (let i = 0; i < transactions.length; i++) {
              const transaction = transactions[i];
              const item =  `('${transaction.transaction_id}','${transaction.file_name}','${transaction.card_number}','${transaction.card_type}',${transaction.amount},'${transaction.timestamp}')`;
              values.push(item);          
          }
          const query = `
            INSERT INTO transactions (transaction_id, 
              file_name, 
              card_number,
              card_type,
              amount, 
              timestamp)
            VALUES ${values.join(',\n')};
          `;
          lastQuery = query;
          await client.query(query);
          return new DBResponse(true, null, 1, 0, 0, 0);
        } catch (err) {
          console.error('Error inserting data:', err,lastQuery);
          //console.error('Error inserting data:', err);
          return new DBResponse(true, err, 0, 0, 0, 0);
        } finally {
          
        }
  }
}

module.exports = TransactionModel;