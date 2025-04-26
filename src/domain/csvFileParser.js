/**
 * 
 * Base class for all file parsers
 * 
 */

const fs = require('fs');
const csvParser = require('csv-parser');

const AbstractFileParser = require('./abstractFileParser');

class CSVFileParser extends AbstractFileParser{
    constructor() {
        super();
    }
    /**
     * 
     * @param {*} filePath 
     * @returns and array of json objects
     */
    async parse(filePath){
        let results = [];
       
        const parser = fs.createReadStream(filePath).pipe(csvParser({
            delimiter: ',',
            columns: true
          }));
        for await (const record of parser) {
            results.push(record);
            // You can perform async operations on each record here
            // For example: await someAsyncFunction(record);
        }
        return results;
    }
    // async parse(filePath) {
    //     const results = [];
    //     await fs.createReadStream(filePath)
    //     .pipe(csvParser())
    //     .on('data', (data) => results.push(data))
    //     .on('end', async () => {
    //         await fs.unlinkSync(filePath);
    //         return results;
    //     })
    //     .on('error', async (err) => {
    //         // Handle errors during file processing
    //         fs.unlinkSync(filePath);
    //         throw new Error("Error during file processing: " + err.message);
    //     });
    
    // }
 
    /**
     * 
     * @param {*} filePath 
     * @returns file extention in lowercase that this parser class can parse
     */
    getSupportedExtension(filePath) {
       return "csv"
    }
}

module.exports = CSVFileParser;