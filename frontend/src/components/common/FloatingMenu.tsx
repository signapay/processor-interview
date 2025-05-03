import { ReactNode, useState } from "react";
import {
  Box,
  OpenReason,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";

interface FloatingMenuAction {
  icon: ReactNode;
  name: string;
  onClick: () => void;
}

interface FloatingMenuProps {
  actions: FloatingMenuAction[];
}

const FloatingMenu = ({ actions }: FloatingMenuProps) => {
  const [open, setOpen] = useState(false);

  const handleOpen = (_e: unknown, reason: OpenReason) => {
    if (reason !== "focus") {
      setOpen(true);
    }
  };
  const handleClose = () => setOpen(false);
  const handleClick = (action: FloatingMenuAction) => {
    handleClose();
    action.onClick();
  };

  return (
    <Box
      display="flex"
      position="fixed"
      bottom={20}
      right={20}
      zIndex={1}
      gap={2}
    >
      <SpeedDial
        ariaLabel="SpeedDial"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            slotProps={{
              tooltip: {
                title: action.name,
              },
            }}
            onClick={() => handleClick(action)}
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

export default FloatingMenu;
