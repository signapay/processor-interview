const { Pool } = require('pg');
/**
 * 
 * Base class for all model implementors
 * 
 */
class AbstractModel {
    constructor() {
    
        let config = {
          user: process.env.POSTGRES_USER || 'admin',
          host: process.env.POSTGRES_HOST_ADDRESS || '127.0.0.1',
          database: process.env.POSTGRES_DB || 'signapay',
          password: process.env.POSTGRES_PASSWORD || 'root',
          port: parseInt(process.env.POSTGRES_HOST_PORT) || 5432
        };
        this._pool = new Pool(config);
    }
    _getPool() {
        return this._pool;
    }
    async clear() {
        throw new Error("Method 'clear' must be implemented in subclass.");
    }
  async _clearTable(tableName) {
        let client = null;
        try {
            client = await this._pool.connect();
            const query = `TRUNCATE TABLE ${tableName};`;
            //const query = `DELETE FROM ${tableName};`;
            const res = await client.query(query);
            //console.error('Deleting data response:', res);
            return true
          } catch (err) {
            console.error('Error deleting data:', err);
            return false;
          } finally {
            if( client != null) {
              client.release();
            }
          }
    }   

}

module.exports = AbstractModel;