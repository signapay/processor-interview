import { Box, Typography } from "@mui/material";

const EmptyTransactionsState = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        No transactions yet
      </Typography>
      <Typography variant="subtitle1">
        Upload transactions in order to process them.
      </Typography>
    </Box>
  );
};

export default EmptyTransactionsState;
