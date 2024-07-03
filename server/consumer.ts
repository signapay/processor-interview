import { KafkaClient, Consumer } from 'kafka-node';
import csvParser from 'csv-parser';
import { saveTransaction, updateFileHistory } from './db';
import { Readable } from 'stream';
import CryptoJS from 'crypto-js';
import { persistData } from './transaction_processor';

const kafkaClient = new KafkaClient({ kafkaHost: 'localhost:9092' });
const consumer = new Consumer(
  kafkaClient,
  [{ topic: 'transactions', partition: 0 }],
  { autoCommit: true, fetchMaxBytes:15728640 }
);

consumer.on('message', async (message:any) => {
    console.log('-- inside consumer -- onMessage:', JSON.parse(message.value.toString()) );
    const { username, fileName, data, fileID} = JSON.parse(message.value.toString());
    console.log('-- inside consumer -- onMessage:', data);
  
  const bytes = CryptoJS.AES.decrypt(data , 'your-secret-key');
  const transaction = bytes.toString(CryptoJS.enc.Utf8);

  console.log('[x] Processed data chunks -- decrypted transactionsssss: ', transaction);

  const stream = new Readable();
  stream.push(transaction);
  stream.push(null);
  let recordCount: number = 0;

// right now this is only for CSV files -- for other types the parser has to be dynamic
  stream.pipe(csvParser())
    .on('data', async (data) => {    
      await persistData(data, fileID);
      recordCount++;
      //console.log('[x] Processed transaction: ', data);
    })
    .on('end', async () => {
        //console.log('[x] Processed data chunks: ', decryptedDataChunks);
      console.log('Finished processing file');
      await updateFileHistory(fileID, recordCount);
    });
});

consumer.on('error', (err) => {
  console.error('Kafka Consumer error:', err);
});
