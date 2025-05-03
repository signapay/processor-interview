import { Card, CardContent, Typography } from "@mui/material";
import TransactionsDataGrid from "@/components/transactions/TransactionsDataGrid";

const TotalByDay = ({ totalByDay }: { totalByDay: Record<string, number> }) => {
  const rows = Object.entries(totalByDay).map(([day, total], index) => ({
    id: index,
    day: new Date(day).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    total: total.toFixed(2),
  }));

  const columns = [
    { field: "day", headerName: "Day", flex: 1 },
    { field: "total", headerName: "Total ($)", flex: 1 },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Total Processed Volume by Day
        </Typography>
        <TransactionsDataGrid rows={rows} columns={columns} />
      </CardContent>
    </Card>
  );
};

export default TotalByDay;
