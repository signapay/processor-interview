import { useState } from "react";
import { Box, Backdrop, CircularProgress } from "@mui/material";
import TransactionsFloatingMenu from "@/components/transactions/TransactionsFloatingMenu";
import EmptyTransactionsState from "@/components/transactions/EmptyTransactionsState";
import TransactionsSummary from "@/components/transactions/TransactionsSummary";
import DeleteTransactionsModal from "@/components/transactions/modals/DeleteTransactionsModal";

const TransactionsPage = () => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const fetchingTransactions = false;
  const hasTransactions = true;

  const handleOpenDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleConfirmDelete = () => {
    setDeleteModalOpen(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File upload triggered", event);
  };

  if (fetchingTransactions) {
    return (
      <Backdrop open={fetchingTransactions}>
        <CircularProgress color="primary" />
      </Backdrop>
    );
  }

  return (
    <>
      <Box display="flex" alignItems="center" sx={{ p: 4 }}>
        <TransactionsFloatingMenu
          hasDelete={hasTransactions}
          onDelete={handleOpenDeleteModal}
          onFileUpload={handleFileUpload}
        />
        {!hasTransactions && !fetchingTransactions ? (
          <EmptyTransactionsState />
        ) : (
          <TransactionsSummary />
        )}
      </Box>
      <DeleteTransactionsModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default TransactionsPage;
