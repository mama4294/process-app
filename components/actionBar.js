import Button from "@mui/material/Button";
import { EquipmentContext } from "../contexts/equipmentContext";
import { useContext } from "react";
import styles from "../styles/ActionBar.module.css";

const ActionBar = () => {
  const { selectionIds, deleteEquipment } = useContext(EquipmentContext);
  return (
    <div className={styles.actionBar}>
      <Button
        varient="outlined"
        //  onClick={}
      >
        Add
      </Button>
      <Button
        varient="outlined"
        //  onClick={}
      >
        Edit
      </Button>
      {selectionIds !== null && selectionIds.length > 0 && (
        <Button varient="outlined" onClick={deleteEquipment}>
          Delete
        </Button>
      )}
    </div>
  );
};

export default ActionBar;
