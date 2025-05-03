import { Routes, Route, Navigate } from "react-router";
import { ROUTES } from "@/routes/routes";
import Layout from "@/layouts/Layout";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path={ROUTES.TRANSACTIONS}
          element={
            'Hello World'
          }
        />
      </Route>
      <Route path="/" element={<Navigate to={ROUTES.TRANSACTIONS} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.TRANSACTIONS} replace />} />
    </Routes>
  );
};

export default AppRouter;
