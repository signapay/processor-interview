import * as processTransactions from "./process-transactions";
import * as generateReport from "./generate-report";
import * as readTransactionsFromFile from "./file-reader";
import * as getTransactions from "./get-transactions";

export default {
  ...processTransactions,
  ...generateReport,
  ...readTransactionsFromFile,
  ...getTransactions,
};
