import { TransactionService } from "../../application/services/TransactionService";

export class TransactionoController {
  constructor(private transactionService: TransactionService) {}

  async handleRequest(): Promise<any> {
    const message = await this.transactionService.getTransaction();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: message.content }),
    };
  }
}