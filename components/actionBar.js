import Button from "@mui/material/Button";
import { EquipmentContext } from "../contexts/equipmentContext";
import { useContext } from "react";
import styles from "../styles/ActionBar.module.css";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CachedIcon from "@mui/icons-material/Cached";

const ActionBar = ({ handleNew, handleEdit }) => {
  const {
    selectionIds,
    deleteEquipment,
    solveEquipmentOccupancy,
    moveUp,
    moveDown,
  } = useContext(EquipmentContext);

  return (
    <div className={styles.actionBar}>
      <Tooltip title="Add Equipment">
        <IconButton onClick={handleNew}>
          <AddIcon color="action" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Recalculate schedule">
        <IconButton onClick={solveEquipmentOccupancy}>
          <CachedIcon color="action" />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default ActionBar;
