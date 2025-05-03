import { Grid } from "@mui/material";
import TotalByCard from "@/components/transactions/sections/TotalByCard";
import TotalByCardType from "@/components/transactions/sections/TotalByCardType";
import TotalByDay from "@/components/transactions/sections/TotalByDay";
import RejectedTransactions from "@/components/transactions/sections/RejectedTransactions";
import { Transaction } from "@/contexts/TransactionsContext";

interface TransactionsSummaryProps {
  transactionsByCard: Record<string, number>;
  transactionsByCardType: Record<string, number>;
  transactionsByDay: Record<string, number>;
  rejectedTransactions: Transaction[];
}

const TransactionsSummary = ({
  transactionsByCard,
  transactionsByCardType,
  transactionsByDay,
  rejectedTransactions,
}: TransactionsSummaryProps) => {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, lg: 6 }}>
        <TotalByCard totalByCard={transactionsByCard} />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <TotalByCardType totalByCardType={transactionsByCardType} />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <TotalByDay totalByDay={transactionsByDay} />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <RejectedTransactions rejectedTransactions={rejectedTransactions} />
      </Grid>
    </Grid>
  );
};

export default TransactionsSummary;
