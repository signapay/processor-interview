import express from 'express';
import Interfaces from './interfaces';
import env from './env';
import cors from 'cors';

const startServer = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(Interfaces.REST.Auth);
  app.use('/api', Interfaces.REST.Transaction);
  const PORT = env.PORT;
  app.listen(PORT, () => {
    console.log(`[${new Date().toISOString()}]: Server listening at http://localhost:${PORT} 🚀`);
  });
};

startServer()
