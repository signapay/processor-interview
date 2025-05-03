import { Grid } from "@mui/material";
import TotalByCard from "@/components/transactions/sections/TotalByCard";
import TotalByCardType from "@/components/transactions/sections/TotalByCardType";
import TotalByDay from "@/components/transactions/sections/TotalByDay";
import RejectedTransactions from "@/components/transactions/sections/RejectedTransactions";

export interface Transaction {
  cardNumber: string;
  amount: number;
  timestamp: string;
  rejected?: boolean;
}

// Mock data for the TransactionsSummary component
const transactionsByCard = {
  "1234-5678-9012-3456": 1500.5,
  "9876-5432-1098-7654": 2300.75,
};

const transactionsByCardType = {
  Visa: 3000.25,
  MasterCard: 800.0,
};

const transactionsByDay = {
  "2025-05-01": 1200.0,
  "2025-05-02": 1600.5,
};

const rejectedTransactions = [
  {
    cardNumber: "1234-5678-9012-3456",
    amount: 100.0,
    timestamp: "2025-05-01T10:00:00Z",
    rejected: true,
  },
  {
    cardNumber: "9876-5432-1098-7654",
    amount: 200.0,
    timestamp: "2025-05-02T15:30:00Z",
    rejected: true,
  },
];

const TransactionsSummary = () => {
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
