/**
 * 
 * Base class for all file parsers
 * 
 */
class AbstractFileParser {
    constructor() {
    }
    /**
     * 
     * @param {*} filePath 
     * @returns and array of json objects
     */
    async parse(filePath) {
        throw new Error("Method 'parse' must be implemented in subclass.");
    }
    /**
     * 
     * @param {*} filePath 
     * @returns the file extension in lowercase
     */
    _getFileExtension(filePath) {
        const parts = filePath.split('.');
        return parts.pop().toLowerCase();
    }
    /**
     * 
     * @param {*} filePath 
     * @returns file extention in lowercase that this parser class can parse
     */
    getSupportedExtension(filePath) {
        throw new Error("Method 'getSupportedExtension' must be implemented in subclass.");
    }
    /**
     * 
     * @param {*} filePath 
     * @returns true if this parser can handle parsing of this file, false otherwise
     */
    canParse(filePath){
        if( this.getSupportedExtension().toLowerCase() == this._getFileExtension(filePath) ){
            return true;
        }
        return false;
    }
}

module.exports = AbstractFileParser;