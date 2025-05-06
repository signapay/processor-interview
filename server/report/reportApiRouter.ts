import { type Request, type Response, Router } from 'express';
import { store } from '../shared/store';

export const reportApiRouter = Router();

reportApiRouter.get('/', async (req: Request, res: Response) => {
  const report = store.getReport();
  res.json(report);
});
