/**
 * 
 * Factory pattern to get file parser/handler
 * 
 */

const JSONFileParser = require("./jsonFileParser")
const XMLFileParser = require("./xmlFileParser")
const CSVFileParser = require("./csvFileParser")

const parsers = [
    new JSONFileParser(),
    new CSVFileParser(),
    new XMLFileParser()
];


class FileParserFactory {
    getParser(filePath){
        for( let i = 0; i < parsers.length; i++ ){
            if( parsers[i].canParse(filePath) ){
                return parsers[i];
            }
        }
        return null;
    }
}

module.exports = FileParserFactory;