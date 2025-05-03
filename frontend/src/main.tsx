import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import AppRouter from "@/routes/AppRouter";
import { createTheme, ThemeProvider } from "@mui/material";
import { ToastContainer } from "react-toastify";

const theme = createTheme({
  palette: {
    background: {
      default: "#fafafa",
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        closeOnClick
      />
      <AppRouter />
    </ThemeProvider>
  </BrowserRouter>,
);
