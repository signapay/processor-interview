const AbstractModel = require('./abstractModel');

DBResponse = require('../domain/dbResponse');

/**
 * Models CRUD operations for the files table
 */
class FileModel extends AbstractModel {
    constructor() {
        super();
    }  
    async clear() {
      this._clearTable("files");
    }
    async getFiles() {
      let client = null;
      try {
          client = await this._getPool().connect();
          const query = `SELECT * FROM files;`;
          const res = await client.query(query);
          return res.rows;
      } catch (err) {
          console.error('Error fetching files:', err);
          return [];
      } finally {
          if( client != null) {
              client.release();
          }
      }
  }

  async getFile(fileName) {
      let client = null;
      try {
          client = await this._getPool().connect();
          const query = `SELECT * FROM files where file_name = $1;`;
          const res = await client.query(query,[fileName]);
          return res.rows;
      } catch (err) {
          console.error('Error fetching files:', err);
          return [];
      } finally {
          if( client != null) {
              client.release();
          }
      }
  }


  async getFileNames() {
      let client = null;
      try {
          client = await this._getPool().connect();
          const query = `SELECT file_name FROM files`;
          const res = await client.query(query);
          return res.rows;
      } catch (err) {
          console.error('Error fetching files:', err);
          return [];
      } finally {
          if( client != null) {
              client.release();
          }
      }
  }


  async addFileTransactional(fileName,stats,client) { 

        try {
            const query = `
              INSERT INTO files (file_name,total,transactionsSaved,errorsSaved,ignored)
              VALUES ($1,$2,$3,$4,$5)
              RETURNING *;
            `;
            const values = [fileName,
                            stats.getTotal(),
                            stats.transactionsSaved,
                            stats.errorsSaved,
                            stats.ignored];
        
            const res = await client.query(query, values);
            //console.log('Inserted row:', res.rows[0]);
            return new DBResponse(true, null, 1, 0, 0, 0);
          } catch (err) {
            //console.error('Error inserting data:', err);
            return new DBResponse(false, err, 0, 0, 0, 0);

          } finally {
            
          }
    }

    async addFile(fileName, status) { 
      
      let client = null;
      try {
          client = await this._getPool().connect();
          return await this.addFileTransactional(fileName,status,client);
        } catch (err) {
          //console.error('Error inserting data:', err);
          return new DBResponse(false, err, 0, 0, 0, 0);

        } finally {
          if( client != null) {
            client.release();
          }
        }
  }

    async updateFile(fileName,status,stats) { 
      let client = null
      try {
          client = await this._getPool().connect();
          return this.updateFileTransactional(fileName,status,stats,client);
        } catch (err) {
          //console.error('Error inserting data:', err);
          return new DBResponse(false, err, 0, 0, 0, 0);
        } finally {
          if( client != null) {
            client.release();
          }
        }
  }

  async updateFileTransactional(fileName,status,stats,client) { 

    try {
        const query = `
          UPDATE files
          SET status = $2,
          total = $3,
          transactionsSaved = $4,
          errorsSaved = $5,
          ignored = $6
          WHERE file_name = $1
          RETURNING *;
        `;
        const values = [fileName,status,stats.getTotal(),stats.transactionsSaved,stats.errorsSaved,stats.ignored];  
    
        const res = await client.query(query, values);
        //console.log('Inserted row:', res.rows[0]);
        return new DBResponse(true, null, 0, 1, 0, 0);
      } catch (err) {
        //console.error('Error inserting data:', err);
        return new DBResponse(false, err, 0, 0, 0, 0);
      } finally {
        
      }
}
    async fileProcessed(fileName) {

        let client = null;
        try {
            client = await this._getPool().connect();
            
            return this.fileProcessedTransactional(fileName,client);
        } catch (err) {
            //console.error('Error checking file:', err);
            throw err;
        } finally {
          if( client != null) {
            client.release();
          }
        }
    }

    async fileProcessedTransactional(fileName,client) {
      try {
          
          const query = 'SELECT count(*) FROM files WHERE file_name = $1';
          const values = [fileName];
          const res = await client.query(query, values);
          if( res.rows[0].count > 0){
              return true;
          }
          return false;
      } catch (err) {
          throw err;
      } finally {
       
      }
  }
}

module.exports = FileModel;