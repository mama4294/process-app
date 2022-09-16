import React, { useState, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import Settings from "./settings/settings";
import TextInput from "../components/inputs/textInput";
import styles from "../styles/components.module.css";
import { EquipmentContext } from "../contexts/equipmentContext";
import { CampaignContext } from "../contexts/campaignContext";
import { ResourceContext } from "../contexts/resourceContext";
import { TitleContext } from "../contexts/titleContext";

const Navbar = () => {
  const { saveEquipment } = useContext(EquipmentContext);
  const { saveBatches } = useContext(CampaignContext);
  const { saveResources } = useContext(ResourceContext);
  const { saveTitle, projectTitle, setProjectTitle } = useContext(TitleContext);
  const [openSettings, setOpenSettings] = useState(false);
  const handleOpenSettings = () => setOpenSettings(true);
  const handleCloseSettings = () => setOpenSettings(false);

  const handleSave = () => {
    saveTitle();
    saveEquipment();
    saveBatches();
    saveResources();
  };

  const handleChangeTitle = (e) => {
    setProjectTitle(e.target.value);
  };

  return (
    <>
      <AppBar position="fixed" sx={{ boxShadow: "none" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleOpenSettings}
          >
            <MenuIcon />
          </IconButton>
          <TextInput
            className={styles.projectTitle}
            value={projectTitle}
            onChange={handleChangeTitle}
            type="text"
            placeholder="Project Title"
          />
          <Button color="inherit" onClick={handleSave}>
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <Settings open={openSettings} handleClose={handleCloseSettings} />
    </>
  );
};

export default Navbar;
