import { TransactionService } from "../../application/services/TransactionService";

export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  async handleRequest(event: any): Promise<any> {
    try {
      const contentType = event.headers["content-type"] || event.headers["Content-Type"];
      const result = await this.transactionService.processTransactions(event.body, contentType);

      return {
        statusCode: 200,
        body: JSON.stringify(result),
      };
    } catch (error: any) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  }
}