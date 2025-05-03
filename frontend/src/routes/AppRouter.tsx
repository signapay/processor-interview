import { Routes, Route, Navigate } from "react-router";
import { ROUTES } from "@/routes/routes";
import Layout from "@/layouts/Layout";
import TransactionsPage from "@/pages/TransactionsPage";
import { TransactionsProvider } from "@/contexts/TransactionsContext";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path={ROUTES.TRANSACTIONS}
          element={
            <TransactionsProvider>
              <TransactionsPage />
            </TransactionsProvider>
          }
        />
      </Route>
      <Route path="/" element={<Navigate to={ROUTES.TRANSACTIONS} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.TRANSACTIONS} replace />} />
    </Routes>
  );
};

export default AppRouter;
