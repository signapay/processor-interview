import { Card, CardContent, Typography } from "@mui/material";
import TransactionsDataGrid from "@/components/transactions/TransactionsDataGrid";
import { Transaction } from "@/components/transactions/TransactionsSummary";

const RejectedTransactions = ({
  rejectedTransactions,
}: {
  rejectedTransactions: Transaction[];
}) => {
  const rows = rejectedTransactions.map((transaction, index) => ({
    id: index,
    cardNumber: transaction.cardNumber,
    amount: transaction.amount.toFixed(2),
    timestamp: new Date(transaction.timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  }));

  const columns = [
    { field: "cardNumber", headerName: "Card Number", flex: 1 },
    { field: "amount", headerName: "Amount ($)", flex: 1 },
    { field: "timestamp", headerName: "Timestamp", flex: 1 },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Rejected Transactions
        </Typography>
        <TransactionsDataGrid rows={rows} columns={columns} />
      </CardContent>
    </Card>
  );
};

export default RejectedTransactions;
