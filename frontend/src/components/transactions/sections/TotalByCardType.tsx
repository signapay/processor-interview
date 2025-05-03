import { Card, CardContent, Typography } from "@mui/material";
import TransactionsDataGrid from "@/components/transactions/TransactionsDataGrid";

const TotalByCardType = ({
  totalByCardType,
}: {
  totalByCardType: Record<string, number>;
}) => {
  const rows = Object.entries(totalByCardType).map(
    ([cardType, total], index) => ({
      id: index,
      cardType,
      total: total.toFixed(2),
    }),
  );

  const columns = [
    { field: "cardType", headerName: "Card Type", flex: 1 },
    { field: "total", headerName: "Total ($)", flex: 1 },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Total Processed Volume by Card Type
        </Typography>
        <TransactionsDataGrid rows={rows} columns={columns} />
      </CardContent>
    </Card>
  );
};

export default TotalByCardType;
