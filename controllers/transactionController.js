const Transaction = require('../models/transaction');
const csv = require('csv-parser');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const processFile = async (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      await Transaction.insertMany(results);
      res.status(200).send('File processed and transactions saved.');
    });
};

module.exports = { upload, processFile };
