const express = require('express');
const multer = require('multer');
const path = require('path');
const transactionRoutes = require('./routes/transactions');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use('/api/transactions', upload.single('file'), transactionRoutes);

app.get('/', (req, res) => res.render('index'));
app.get('/accounts', (req, res) => res.render('accounts'));
app.get('/collections', (req, res) => res.render('collections'));
app.get('/bad-transactions', (req, res) => res.render('bad-transactions'));

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

module.exports = app;
