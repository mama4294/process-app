import Button from "@mui/material/Button";
import { EquipmentContext } from "../contexts/equipmentContext";
import { useContext } from "react";
import styles from "../styles/ActionBar.module.css";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";

const ActionBar = ({ handleNew, handleEdit }) => {
  const { selectionIds, deleteEquipment } = useContext(EquipmentContext);

  return (
    <div className={styles.actionBar}>
      <Tooltip title="Add Equipment">
        <IconButton onClick={handleNew}>
          <AddIcon color="action" />
        </IconButton>
      </Tooltip>
      {selectionIds.length === 1 && (
        <Tooltip title="Edit">
          <IconButton onClick={handleEdit}>
            <EditIcon color="action" />
          </IconButton>
        </Tooltip>
      )}
      {selectionIds.length > 0 && (
        <Tooltip title="Delete">
          <IconButton onClick={deleteEquipment}>
            <DeleteIcon color="action" />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
};

export default ActionBar;
