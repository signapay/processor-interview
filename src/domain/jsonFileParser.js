/**
 * 
 * Base class for all file parsers
 * 
 */

const promises = require('fs').promises;
const AbstractFileParser = require('./abstractFileParser');

class JSONFileParser extends AbstractFileParser {
    constructor() {
        super();
    }
    /**
     * 
     * @param {*} filePath 
     * @returns and array of json objects
     */
    async parse(filePath) {
        const data = await promises.readFile(filePath,'utf8');
        return JSON.parse(data);
    }
 
    /**
     * 
     * @param {*} filePath 
     * @returns file extention in lowercase that this parser class can parse
     */
    getSupportedExtension(filePath) {
       return "json"
    }
}

module.exports = JSONFileParser;