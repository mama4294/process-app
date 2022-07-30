import Button from "@mui/material/Button";
import { EquipmentContext } from "../contexts/equipmentContext";
import { useContext } from "react";
import styles from "../styles/ActionBar.module.css";

const ActionBar = ({ handleNew, handleEdit }) => {
  const { selectionIds, deleteEquipment } = useContext(EquipmentContext);

  return (
    <div className={styles.actionBar}>
      <Button onClick={handleNew}>Add</Button>
      {selectionIds.length === 1 && <Button onClick={handleEdit}>Edit</Button>}
      {selectionIds.length > 0 && (
        <Button onClick={deleteEquipment}>Delete</Button>
      )}
    </div>
  );
};

export default ActionBar;
