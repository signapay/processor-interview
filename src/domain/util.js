/**
 * Utility class with common reusible static functions
 */
class Util {

    static  chunkArray(array, chunkSize) {
        const chunkedArray = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunkedArray.push(array.slice(i, i + chunkSize));
        }
        return chunkedArray;
    }


    static getFileFilter = (req, file, cb) => {
        const allowedTypes = ['text/csv','text/xml','application/json']; // Allowed file types
        if (!allowedTypes.includes(file.mimetype)) {
            cb(new Error('Invalid file type'), false); // Reject the file
        } else{
            let fileName = file.originalname.replace(/[^a-zA-Z0-9\-\_\.]/g, '');
            if( fileName != file.originalname) {
                cb(new Error('Invalid file name, only alpha numberic characters, underscores, periods, and hyphens allowed'), false); // Reject the file
            }else{
                cb(null, true); // Accept the file
            }
        }

       
    };
    static safeFileName(fileName) {
        // Logic to safely fetch a file name
        // For example, you can check if the file name is valid
        if (typeof fileName === 'string') {
            // Replace all characters that are not letters, numbers, or spaces but allow dashes, underscores, and dots
            return fileName.replace(/[^a-zA-Z0-9\-\_\.]/g, '');
        }
        return fileName; // Return the input as-is if it's not a string
    }
    static safeTransactionType(type, defaultValue) {        
         if (type != null) {
            let lc = type.toLowerCase();
            if( lc == "credit" || lc == "debit" || lc == "transfer") {
                return lc;
            }
        }
        return defaultValue;
    }

    static safeFloat(value, defaultValue) {     
        if (value != null) {
            let floatValue = parseFloat(value);
            if (!isNaN(floatValue)) {
                return floatValue;
            }
        }
        return defaultValue;
    }


    static safeString(value, defaultValue) {
        if (value != null) {
           return value.trim();
        }
        return defaultValue;
    }

    static validateCardNumber(number) {
        var regex = new RegExp("^[0-9]{16}$");
        if (!regex.test(number))
            return false;
    
        return Util.luhnCheck(number);
    }
    
    static luhnCheck(val) {
        var sum = 0;
        for (var i = 0; i < val.length; i++) {
            var intVal = parseInt(val.substr(i, 1));
            if (i % 2 == 0) {
                intVal *= 2;
                if (intVal > 9) {
                    intVal = 1 + (intVal % 10);
                }
            }
            sum += intVal;
        }
        return (sum % 10) == 0;
    }

    static safeLimit(value) {
        if (value != null) {
            let intValue = parseInt(value);
            if (!isNaN(intValue)) {
                return intValue <0 ? 20 : Math.min(intValue,100);
            }
        }
        return 100;
    }
    static safeBoolean(value) {
        if (value != null) {
            return value === 'true' || value === true;
        }
        return false;
    }
    static safeOffst(value) {
        if (value != null) {
            let intValue = parseInt(value);
            if (!isNaN(intValue)) {
                return intValue <0 ? 0 : intValue;
            }
        }
        return 0;
    }
    static safeSubstring(value,maxLenth){
        if( value ){
            return value.substring(0,maxLenth);
        }
        return '';
    }

    static safeTimestamp(value,defaultValue){
        if( value ){
            let dt = Date.parse(value);
            if( !isNaN(dt) ){
                return value;
            }
        }
        return defaultValue;
    }

}

module.exports = Util;