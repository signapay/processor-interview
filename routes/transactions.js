const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const Transaction = require('../models/transaction');

const router = express.Router();

router.post('/upload', (req, res) => {
    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csv({ headers: true }))
        .on('data', (data) => results.push(data))
        .on('end', () => {
            results.forEach(transaction => {
                try {
                    Transaction.addTransaction(transaction);
                } catch (error) {
                    Transaction.badTransactions.push(transaction);
                }
            });
            res.json({ message: 'File uploaded and processed successfully!' });
        });
});

router.post('/reset', (req, res) => {
    Transaction.reset();
    res.json({ message: 'Transactions reset successfully!' });
});

router.get('/accounts', (req, res) => {
    res.json(Transaction.getAccounts());
});

router.get('/collections', (req, res) => {
    res.json(Transaction.getCollections());
});

router.get('/bad-transactions', (req, res) => {
    res.json(Transaction.getBadTransactions());
});

module.exports = router;
