import React, { useState, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import SettingsIcon from "@mui/icons-material/Settings";
import Settings from "../components/settings";
import { EquipmentContext } from "../contexts/equipmentContext";

const Navbar = () => {
  const { saveEquipment } = useContext(EquipmentContext);
  const [openSettings, setOpenSettings] = useState(false);
  const handleOpenSettings = () => setOpenSettings(true);
  const handleCloseSettings = () => setOpenSettings(false);

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleOpenSettings}
          >
            <SettingsIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Process
          </Typography>
          <Button color="inherit" onClick={saveEquipment}>
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <Settings open={openSettings} handleClose={handleCloseSettings} />
    </>
  );
};

export default Navbar;
