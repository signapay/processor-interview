const AbstractModel = require('./abstractModel');

/**
 * Expose a postgres pool client to allow transactional use cases
 */
class DBTransactionModel extends AbstractModel {
    constructor() {
        super();
    }  
    async clear() {
      //no ob
    }
    async getTransactionClient(){
      return await this._getPool().connect();
    }
    async releaseTransactionClient(client){
      try {
        if( client != null) {
          client.release();
      }
      } catch (error) {
        console.log("Error releasing client",error);
      }
    }
   
}

module.exports = DBTransactionModel;