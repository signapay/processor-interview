/**
 * 
 * Base class for all file parsers
 * 
 */

const promises = require('fs').promises;
var parser = require('xml2json');
const AbstractFileParser = require('./abstractFileParser');

class XMLFileParser extends AbstractFileParser{
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
        if( data ){
            //comes in nested, lets collapse a bit
            const verboseJson = JSON.parse(parser.toJson(data));
            return verboseJson.transactions.transaction;
        }else{
            throw new Error("Error during file processing xml file"); 
        }
        

    
    }
 
    /**
     * 
     * @param {*} filePath 
     * @returns file extention in lowercase that this parser class can parse
     */
    getSupportedExtension(filePath) {
       return "xml"
    }
}

module.exports = XMLFileParser;