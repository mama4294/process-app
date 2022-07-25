import Button from "@mui/material/Button";
import { EquipmentContext } from "../contexts/equipmentContext";
import { useContext } from "react";
import styles from "../styles/ActionBar.module.css";

const ActionBar = ({ openModal }) => {
  const { selectionIds, deleteEquipment } = useContext(EquipmentContext);

  return (
    <div className={styles.actionBar}>
      <Button onClick={openModal}>Add</Button>
      {selectionIds.length === 1 && <Button>Edit</Button>}
      {selectionIds.length > 0 && (
        <Button onClick={deleteEquipment}>Delete</Button>
      )}
    </div>
  );
};

export default ActionBar;
