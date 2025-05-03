import { Outlet } from "react-router";
import { Box, Container, CssBaseline } from "@mui/material";
import NavBar, { NAVBAR_HEIGHT } from "@/components/common/NavBar";

const Layout = () => {
  return (
    <Box>
      <CssBaseline />
      <NavBar />
      <Container
        component="main"
        disableGutters
        maxWidth="xl"
        sx={{
          minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;
