import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { fetchApi } from "@/utils/fetch";
import { useWebSocket, WSEvents } from "@/hooks/useWebSocket";
import { useToaster } from "@/hooks/useToaster";

export interface Transaction {
  cardNumber: string;
  amount: number;
  timestamp: string;
  rejected?: boolean;
}

type TransactionsContextType = {
  uploadFiles: (files: FileList) => Promise<void>;
  fetchTransactions: () => Promise<void>;
  deleteAllTransactions: () => Promise<void>;
  transactionsByCard: Record<string, number>;
  transactionsByCardType: Record<string, number>;
  transactionsByDay: Record<string, number>;
  rejectedTransactions: Transaction[];
  hasTransactions: boolean;
  fetchingTransactions: boolean;
};

const TransactionsContext = createContext<TransactionsContextType | null>(null);

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [fetchingTransactions, setFetchingTransactions] = useState(false);
  const [transactionsByCard, setTransactionsByCard] = useState<
    Record<string, number>
  >({});
  const [transactionsByCardType, setTransactionsByCardType] = useState<
    Record<string, number>
  >({});
  const [transactionsByDay, setTransactionsByDay] = useState<
    Record<string, number>
  >({});
  const [rejectedTransactions, setRejectedTransactions] = useState<
    Transaction[]
  >([]);

  const { showSuccess, showError, showInfo } = useToaster();

  const uploadFiles = async (files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    try {
      const response = await fetchApi("/api/transactions", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Error uploading files");
      }
      showInfo("Your files are being processed. Please wait a moment.");
    } catch (error) {
      showError("Error uploading files");
      console.error("Error uploading files:", error);
    }
  };

  const fetchTransactions = useCallback(async () => {
    if (fetchingTransactions) return;
    setFetchingTransactions(true);
    try {
      const [byCard, byCardType, byDay, rejected] = await Promise.all([
        fetchApi("/api/transactions/by-card").then((res) => res.json()),
        fetchApi("/api/transactions/by-card-type").then((res) => res.json()),
        fetchApi("/api/transactions/by-day").then((res) => res.json()),
        fetchApi("/api/transactions/rejected").then((res) => res.json()),
      ]);

      setTransactionsByCard(byCard);
      setTransactionsByCardType(byCardType);
      setTransactionsByDay(byDay);
      setRejectedTransactions(rejected);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setFetchingTransactions(false);
    }
  }, []);

  const deleteAllTransactions = async () => {
    try {
      const response = await fetchApi("/api/transactions", {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error deleting transactions");
      }
      showInfo("Deleting transactions. Please wait a moment.");
    } catch (error) {
      console.error("Error deleting transactions:", error);
    }
  };

  const clearTransactions = () => {
    setTransactionsByCard({});
    setTransactionsByCardType({});
    setTransactionsByDay({});
    setRejectedTransactions([]);
  };

  const hasTransactions = useMemo(() => {
    return (
      Object.keys(transactionsByCard).length > 0 ||
      Object.keys(transactionsByCardType).length > 0 ||
      Object.keys(transactionsByDay).length > 0 ||
      rejectedTransactions.length > 0
    );
  }, [
    transactionsByCard,
    transactionsByCardType,
    transactionsByDay,
    rejectedTransactions,
  ]);

  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    const data = JSON.parse(event.data);
    switch (data.event) {
      case WSEvents.TransactionsUploadSuccess:
        showSuccess("Transactions processed successfully. Reloading...");
        fetchTransactions();
        break;
      case WSEvents.TransactionsUploadFail:
        showError("Error uploading transactions. Please try again.");
        console.error("Error uploading transactions:", data.message);
        break;
      case WSEvents.TransactionsDeleteSuccess:
        showSuccess("Transactions deleted successfully. Reloading...");
        clearTransactions();
        break;
      default:
        console.warn("Unhandled WebSocket event:", data.event);
    }
  }, []);

  useWebSocket(handleWebSocketMessage);

  return (
    <TransactionsContext.Provider
      value={{
        uploadFiles,
        fetchTransactions,
        deleteAllTransactions,
        transactionsByCard,
        transactionsByCardType,
        transactionsByDay,
        rejectedTransactions,
        hasTransactions,
        fetchingTransactions,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error(
      "useTransactions must be used within a TransactionsProvider",
    );
  }
  return context;
};
