import { TransactionServiceImpl } from "./infrastructure/services/TransactionServiceImpl";
import { TransactionoController } from "./interfaces/controllers/TransactionController";

const transactionService = new TransactionServiceImpl();
const controller = new TransactionoController(transactionService);

export const handler = async (): Promise<any> => {
  return await controller.handleRequest();
};

if (require.main === module) {
  handler().then(console.log).catch(console.error);
}
