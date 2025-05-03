import { Box } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";

interface TransactionsDataGridProps {
  rows: GridRowsProp;
  columns: GridColDef[];
}

const DATAGRID_HEIGHT = 400;

const TransactionsDataGrid = ({ rows, columns }: TransactionsDataGridProps) => {
  return (
    <Box position="relative" flex="1" sx={{ height: DATAGRID_HEIGHT }}>
      <Box position="absolute" sx={{ inset: 0 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          sx={{ height: DATAGRID_HEIGHT }}
        />
      </Box>
    </Box>
  );
};

export default TransactionsDataGrid;
