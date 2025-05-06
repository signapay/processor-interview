import { type Request, type Response, Router } from 'express';
import multer from 'multer';
import type { SupportedFileType, Transaction } from 'server/shared/entity.js';
import { fileProcessor } from '../shared/fileProcessor';
import { store } from '../shared/store';

export const transactionApiRouter = Router();

const upload = multer({ dest: 'uploads/' });

transactionApiRouter.post('/file', upload.single('file'), async (req, res, next) => {
  const type = req.file.mimetype.split('/')[1].toLowerCase() as SupportedFileType;
  const transactions = await fileProcessor.processFile(req.file.path, type);
  res.json(transactions);
});

transactionApiRouter.post('/', async (req: Request, res: Response) => {
  const transaction = req.body as Transaction;
  const processedTransaction = store.processTransaction(transaction);
  res.status(201).json(processedTransaction);
});

transactionApiRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const transaction = store.getTransaction(id);
  if (!transaction) {
    res.status(404);
  }
  res.json(transaction);
});

transactionApiRouter.get('/', async (req: Request, res: Response) => {
  const transactions = store.getTransactions();
  res.json(transactions);
});

transactionApiRouter.delete('/all', async (req: Request, res: Response) => {
  const count = store.clearAllTransactions();
  res.json(count);
});

transactionApiRouter.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const count = store.deleteTransaction(id);
  res.json(count);
});
