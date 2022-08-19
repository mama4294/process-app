import React, { useState } from "react";
import { EquipmentContext } from "../contexts/equipmentContext";
import Button from "@mui/material/Button";
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
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ShowChartIcon from "@mui/icons-material/ShowChart";

const ActionBar = ({ handleNew }) => {
  const { solveEquipmentOccupancy } = useContext(EquipmentContext);

  return (
    <div className={styles.actionBar}>
      <ViewSelector />
      <Tooltip title="Add Equipment">
        <IconButton onClick={handleNew}>
          <AddIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Recalculate schedule">
        <IconButton onClick={solveEquipmentOccupancy}>
          <CachedIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default ActionBar;

const ViewSelector = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Tooltip title="Change View">
        <Button
          id="demo-customized-button"
          aria-controls={open ? "demo-customized-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          // variant="contained"
          disableElevation
          onClick={handleClick}
          startIcon={<AlignHorizontalLeftIcon />}
          endIcon={<KeyboardArrowDownIcon />}
        >
          Chart
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
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <AlignHorizontalLeftIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Chart</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <ShowChartIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Resources</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};
