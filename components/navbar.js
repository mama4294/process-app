import React, { useState, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import SettingsIcon from "@mui/icons-material/Settings";
import Settings from "../components/settings";
import { EquipmentContext } from "../contexts/equipmentContext";
import { CampaignContext } from "../contexts/campaignContext";
import { ResourceContext } from "../contexts/resourceContext";

const Navbar = () => {
  const { saveEquipment } = useContext(EquipmentContext);
  const { saveBatches } = useContext(CampaignContext);
  const { saveResources } = useContext(ResourceContext);
  const [openSettings, setOpenSettings] = useState(false);
  const handleOpenSettings = () => setOpenSettings(true);
  const handleCloseSettings = () => setOpenSettings(false);

  const handleSave = () => {
    saveEquipment();
    saveBatches();
    saveResources();
  };

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
          <Button color="inherit" onClick={handleSave}>
            Save
          </Button>
        </Toolbar>
      </AppBar>
      {openSettings && (
        <Settings open={openSettings} handleClose={handleCloseSettings} />
      )}
    </>
  );
};

export default Navbar;
