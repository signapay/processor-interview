const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();

app.use(cors());

const upload = multer({ dest: 'uploads/' });

const properHeaders = ['Account Name', 'Card Number', 'Transaction Amount', 'Transaction Type', 'Description', 'Target Card Number'];

let allTransactions = [];
let uploadedFiles = [];  

function calculateBalances(transactions) {
  const balances = {};
  const negativeBalances = []; 

  transactions.forEach((tx) => {
    const { customer, cardNumber, amount, type, targetCardNumber } = tx;

    if (!balances[customer]) {
      balances[customer] = {};
    }

    if (!balances[customer][cardNumber]) {
      balances[customer][cardNumber] = 0;
    }

    if (type === 'Credit') {
      balances[customer][cardNumber] += amount;
    } else if (type === 'Debit') {
      balances[customer][cardNumber] -= amount;
    }

    else if (type === 'Transfer') {
      balances[customer][cardNumber] -= amount;

      if (!balances[customer][targetCardNumber]) {
        balances[customer][targetCardNumber] = 0;
      }
      balances[customer][targetCardNumber] += amount;
    }
  });

  const balanceReport = Object.keys(balances).map((customer) => ({
    customer,
    cards: Object.keys(balances[customer]).map((cardNumber) => {
      const cardBalance = parseFloat(balances[customer][cardNumber].toFixed(3)); 

      if (cardBalance < 0.00) {
        negativeBalances.push({
          customer,
          cardNumber,
          balance: cardBalance,
        });
      }

      return {
        cardNumber,
        balance: cardBalance,
      };
    }),
  }));

  return { balanceReport, negativeBalances };
}

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;
  const fileName = req.file.originalname;  
  uploadedFiles.push(fileName);  

  const transactions = [];
  const badTransactions = [];  

  fs.createReadStream(filePath)
    .pipe(csv({ headers: properHeaders, skipLines: 1 })) 
    .on('data', (row) => {
      console.log('CSV Row:', row);  

      const accountName = row['Account Name'];
      const cardNumber = row['Card Number'];
      const amount = parseFloat(row['Transaction Amount']);
      const type = row['Transaction Type'];
      const description = row['Description'];
      const targetCardNumber = row['Target Card Number'];

      if (!accountName || !cardNumber || isNaN(amount) || !['Credit', 'Debit', 'Transfer'].includes(type)) {
        badTransactions.push({
          accountName,
          cardNumber,
          amount: row['Transaction Amount'],  
          type,
          description,
          targetCardNumber
        });
      } else {
        transactions.push({
          customer: accountName,  
          cardNumber: cardNumber,  
          amount: amount,  
          type: type,  
          description: description,  
          targetCardNumber: targetCardNumber || 'N/A',  
        });
      }
    })
    .on('end', () => {
      allTransactions = [...allTransactions, ...transactions];

      const { balanceReport, negativeBalances } = calculateBalances(allTransactions);

      res.json({ balanceReport, negativeBalances, badTransactions, allTransactions, uploadedFiles });
    })
    .on('error', (err) => {
      console.error('Error processing CSV:', err);
      res.status(500).json({ error: 'Failed to process file' });
    });
});

app.post('/reset', (req, res) => {
  allTransactions = [];
  uploadedFiles = [];  
  res.json({ message: 'System reset successfully' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
