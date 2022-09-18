import React, { useState } from "react";
import { EquipmentContext } from "../contexts/equipmentContext";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useContext } from "react";
import styles from "../styles/ActionBar.module.css";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CachedIcon from "@mui/icons-material/Cached";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AlignHorizontalLeftIcon from "@mui/icons-material/AlignHorizontalLeft";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { BatchesMenu } from "./settings/batchesMenu";
import { ResourcesMenu } from "./settings/resourcesMenu";

export const viewSelectorOptions = {
  equipment: "Equipment",
  resources: "Resources",
};

const ActionBar = ({ handleNew, view, setView }) => {
  const { solveEquipmentOccupancy } = useContext(EquipmentContext);

  const [openBatchesModal, setOpenBatchesModal] = useState(false);
  const closeBatchesModal = () => {
    setOpenBatchesModal(false);
  };

  const [openResourceModal, setOpenResourceModal] = useState(false);
  const closeResourceModal = () => {
    setOpenResourceModal(false);
  };

  return (
    <div className={styles.actionBar}>
      <ViewSelector view={view} setView={setView} />
      <BatchesModal open={openBatchesModal} handleClose={closeBatchesModal} />
      <ResourcesModal
        open={openResourceModal}
        handleClose={closeResourceModal}
      />
      {view === viewSelectorOptions.equipment && (
        <>
          <Tooltip title="Add Equipment">
            <IconButton onClick={handleNew}>
              <AddIcon color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Batches">
            <IconButton onClick={() => setOpenBatchesModal(true)}>
              <ClearAllIcon color="primary" />
            </IconButton>
          </Tooltip>
        </>
      )}
      {view === viewSelectorOptions.resources && (
        <>
          <Tooltip title="Add Resource">
            <IconButton onClick={() => setOpenResourceModal(true)}>
              <AddIcon color="primary" />
            </IconButton>
          </Tooltip>
        </>
      )}
      <Tooltip title="Refresh">
        <IconButton onClick={solveEquipmentOccupancy}>
          <CachedIcon color="primary" />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default ActionBar;

const ViewSelector = ({ view, setView }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getIcon = (view) => {
    switch (view) {
      case "Chart":
        return <AlignHorizontalLeftIcon />;
      case "Resources":
        return <ShowChartIcon />;
      default:
        return <AlignHorizontalLeftIcon />;
    }
  };

  const handleSelect = (event) => {
    setView(event.target.outerText);
    handleClose();
  };

  return (
    <div>
      <Tooltip title="Change View">
        <Button
          id="demo-customized-button"
          aria-controls={open ? "demo-customized-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          variant="outlined"
          // disableelevation
          onClick={handleClick}
          startIcon={getIcon(view)}
          endIcon={<KeyboardArrowDownIcon />}
        >
          {view}
        </Button>
      </Tooltip>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={handleSelect}
          selected={view === viewSelectorOptions.equipment}
        >
          <ListItemIcon>
            <AlignHorizontalLeftIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Equipment</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={handleSelect}
          selected={view === viewSelectorOptions.resources}
        >
          <ListItemIcon>
            <ShowChartIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Resources</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};

const BatchesModal = ({ open, handleClose }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="Batches modal"
      aria-describedby="Batches modal"
    >
      <div
        style={{
          background: "white",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "400px",
          bgcolor: "background.paper",
          padding: "16px",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <BatchesMenu handleClose={handleClose} />
      </div>
    </Modal>
  );
};

const ResourcesModal = ({ open, handleClose }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="Batches modal"
      aria-describedby="Batches modal"
    >
      <div
        style={{
          background: "white",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          bgcolor: "background.paper",
          padding: "16px",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <ResourcesMenu handleClose={handleClose} />
      </div>
    </Modal>
  );
};
