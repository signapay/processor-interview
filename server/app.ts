import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { KafkaClient, Producer } from 'kafka-node';
import { resetDatabase, getTransactions, saveFileHistory, getAccountDetails, getBadTransactions, getNegativeBalanceAccounts } from './db';

const app = express();
const port = 3001;

//const upload = multer({ dest: 'uploads/' });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Save the file with its original name
  }
});

const upload = multer({ storage: storage });

app.use(express.json());

const kafkaClient = new KafkaClient({ kafkaHost: 'localhost:9092' });
const producer = new Producer(kafkaClient);

producer.on('ready', () => {
  console.log('Kafka Producer is connected and ready.');
});

producer.on('error', (err) => {
  console.error('Kafka Producer error:', err);
});

app.get('/', (req, res) => {
  res.send('Transaction Processor API');
});

app.post('/api/upload', upload.single('file'), (req, res) => {

  const file = req.file;
  const username = req.body.username;
  if (!file) {
    return res.status(400).send('No file uploaded');
  }

  const filePath = file.path;
  const fileName = file.originalname;
  fs.readFile(filePath, 'utf8', async (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }

    const fileID: number = await saveFileHistory(fileName, username);

    const message = JSON.stringify({ username, fileID, fileName, data });

    producer.send([{ topic: 'transactions', messages: message }], (err, data) => {
      if (err) {
        console.error('Error sending messages to Kafka:', err);
        res.status(500).send('Error processing file');
      } else {
        console.log(' [x] Sent transactions to Kafka', data);
        res.send('File processed successfully');
      }
    });
  });
});

app.get('/api/transactions', async (req, res) => {
  const transactions = await getTransactions();
  res.json(transactions);
});

app.get('/api/badTransactions', async (req, res) => {
  const transactions = await getBadTransactions();
  res.json(transactions);
});

app.get('/api/accountDetails', async (req, res) => {
  const accountDetails = await getAccountDetails();
  res.json(accountDetails);
});

app.get('/api/accountsForCollections', async (req, res) => {
  const accountDetails = await getNegativeBalanceAccounts();
  res.json(accountDetails);
});

app.post('/api/reset', async (req, res) => {
  await resetDatabase();
  res.send('System reset successfully');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
