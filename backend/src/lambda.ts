import { TransactionServiceImpl } from "./infrastructure/services/TransactionServiceImpl";
import { TransactionController } from "./interfaces/controllers/TransactionController";

const transactionService = new TransactionServiceImpl();
const controller = new TransactionController(transactionService);

export const handler = async (event: any): Promise<any> => {
  return await controller.handleRequest(event);
};

