import { AppBar, Toolbar, Typography } from "@mui/material";

export const NAVBAR_HEIGHT = 64;

const NavBar = () => {
  return (
    <AppBar position="sticky" sx={{ height: NAVBAR_HEIGHT }}>
      <Toolbar>
        <Typography component="h1" variant="h6">
          Card Processor
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
