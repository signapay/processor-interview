import { TransactionServiceImpl } from "./infrastructure/services/TransactionServiceImpl";
import { TransactionoController } from "./interfaces/controllers/TransactionController";

const transactionService = new TransactionServiceImpl();
const controller = new TransactionoController(transactionService);

export const handler = async (event: any): Promise<any> => {
  return await controller.handleRequest(event);
};

if (require.main === module) {
  handler(event).then(console.log).catch(console.error);
}
