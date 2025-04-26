let express = require('express');
let router = express.Router();
const AdminController = require('../controllers/adminController');

const Util = require('../domain/util');
const ErrorCodes = require('../domain/errorCodes')
const CardFactory = require('../domain/cards/cardFactory')
const cardFactory = new CardFactory();
/**
 * Get the name of the files (that have been uploaded)
 */
router.get('/fileNames', async (req, res) => {
    let data = {};
    try {
        const controller = new AdminController();
        const files = await controller.getFileNames();
        data.data = files
    }catch (error) {
        data.error = error.message
    }
    res.json(data);
});

/**
 * Get file data
 */
router.get('/file', async (req, res) => {
    let data = {};
    try {
        const fileName = req.query.fileName;
        const controller = new AdminController();
        const files = await controller.getFile(fileName);
        data.data = files
        if( files.length > limit) {
            data.nextOffset = offset + Mathlimit;
            data.nextLimit = limit;
        }
        
    }catch (error) {
        data.error = error.message
    }
    res.json(data);
});

/**
 * Get stats by card type
 */
router.get('/cardTypeStats', async (req, res) => {
    let data = {};
    try {
        const limit = Util.safeLimit(req.query.limit);
        const offset = Util.safeOffst(req.query.offset);
        let startDate = Util.safeTimestamp(req.query.startDate,null);
        let endDate = Util.safeTimestamp(req.query.endDate,null);
        let cardType = req.query.cardType;
        if( !cardType || cardType === '*' ){
            cardType = null;
        }else if( !cardFactory.validCardType(cardType) ){
            data.error = "Card type is not valie"
        }
        if( !startDate || !endDate ){
            data.error = "Start and end dates are required"
        }
        if( !data.error ){
            const controller = new AdminController();
            const files = await controller.getCardTypeStats(cardType,startDate,endDate,offset,limit);
            data.data = files
            if( files.length > limit) {
                data.nextOffset = offset + limit;
                data.nextLimit = limit;
            }
        }
  
    }catch (error) {
        data.error = error.message
    }
    res.json(data);
});

/**
 * Get stats by card 
 */
router.get('/cardStats', async (req, res) => {
    let data = {};
    try {
        const limit = Util.safeLimit(req.query.limit);
        const offset = Util.safeOffst(req.query.offset);
        let startDate = Util.safeTimestamp(req.query.startDate,null);
        let endDate = Util.safeTimestamp(req.query.endDate,null);
        let card = req.query.card;
        if( !card || card.trim().length < 3 ){
            data.error = "Card search must contain at least 3 digits"
        }
        if( !startDate || !endDate ){
            data.error = "Start and end dates are required"
        }
        if( !data.error ){
            const controller = new AdminController();
            const files = await controller.getCardStats(card,startDate,endDate,offset,limit);
            data.data = files
            if( files.length > limit) {
                data.nextOffset = offset + limit;
                data.nextLimit = limit;
            }
        }
  
    }catch (error) {
        data.error = error.message
    }
    res.json(data);
});
/**
 * Get transaction data
 */
router.get('/transactionData', async (req, res) => {
    let data = {};
    try {
        const limit = Util.safeLimit(req.query.limit);
        const offset = Util.safeOffst(req.query.offset);
        const fileName = req.query.fileName;
        const controller = new AdminController();
        let files = await controller.getTransactions(fileName, limit, offset);
        data.data = files
        if( files.length >= limit) {
            data.nextOffset = offset + limit;
            data.nextLimit = limit;
        }
        
    }catch (error) {
        data.error = error.message
    }
    res.json(data);
});


/**
 * Get error data
 */
router.get('/errorData', async (req, res) => {
    let data = {};
    try {
        const limit = Util.safeLimit(req.query.limit);
        const offset = Util.safeOffst(req.query.offset);
        const fileName = req.query.fileName;
        const controller = new AdminController();
        let files =  await controller.getErrors(fileName, limit, offset);;
        data.data = files
        if( files.length >= limit) {
            data.nextOffset = offset + limit;
            data.nextLimit = limit;
        }
    }catch (error) {
        data.error = error.message
    }
    res.json(data);
});


/**
 * Get error codes
 */
router.get('/errorCodes',  (req, res) => {
    var response = {data:[]};
    for( prop in ErrorCodes ){

       response.data.push(ErrorCodes[prop]);
    }
    res.json(response);
});

/**
 * Clears all the table data to reset the system
 */
router.post('/clear', async (req, res) => {
    try {
        const controller = new AdminController();
        await controller.clearAll();
        res.json({"deleted": true});
    }
    catch (error) {
        res.json({"deleted": false,"error" :error.message});
    }
});

/**
 * Get the name of the files (that have been uploaded)
 */
router.get('/cardTypes', async (req, res) => {
    let data = {};
    try {
        data.data = cardFactory.getCardTypes();
    }catch (error) {
        data.error = error.message
    }
    res.json(data);
});

module.exports = router;