import { useEffect, useState } from "react";
import { Box, Backdrop, CircularProgress } from "@mui/material";
import TransactionsFloatingMenu from "@/components/transactions/TransactionsFloatingMenu";
import EmptyTransactionsState from "@/components/transactions/EmptyTransactionsState";
import TransactionsSummary from "@/components/transactions/TransactionsSummary";
import DeleteTransactionsModal from "@/components/transactions/modals/DeleteTransactionsModal";
import { useTransactions } from "@/contexts/TransactionsContext";

const TransactionsPage = () => {
  const {
    fetchTransactions,
    fetchingTransactions,
    hasTransactions,
    transactionsByCard,
    transactionsByCardType,
    transactionsByDay,
    rejectedTransactions,
    uploadFiles,
    deleteAllTransactions,
  } = useTransactions();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleOpenDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleConfirmDelete = () => {
    deleteAllTransactions();
    setDeleteModalOpen(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      uploadFiles(event.target.files);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

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
          <TransactionsSummary
            transactionsByCard={transactionsByCard}
            transactionsByCardType={transactionsByCardType}
            transactionsByDay={transactionsByDay}
            rejectedTransactions={rejectedTransactions}
          />
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
