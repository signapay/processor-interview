import { Card, CardContent, Typography } from "@mui/material";
import TransactionsDataGrid from "@/components/transactions/TransactionsDataGrid";

const TotalByCard = ({
  totalByCard,
}: {
  totalByCard: Record<string, number>;
}) => {
  const rows = Object.entries(totalByCard).map(
    ([cardNumber, total], index) => ({
      id: index,
      cardNumber,
      total: total.toFixed(2),
    }),
  );

  const columns = [
    { field: "cardNumber", headerName: "Card Number", flex: 1 },
    { field: "total", headerName: "Total ($)", flex: 1 },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Total Processed Volume by Card
        </Typography>
        <TransactionsDataGrid rows={rows} columns={columns} />
      </CardContent>
    </Card>
  );
};

export default TotalByCard;
