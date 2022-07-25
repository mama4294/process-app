import React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const EditEquipmentModal = ({ open, handleClose }) => {
  return (
    <div>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        variant="temporary"
      >
        <EquipmentInputForm />
      </Drawer>
    </div>
  );
};

const EquipmentInputForm = () => {
  const [equipment, setEquipment] = useState({ name: "Equipment 1" });
  const { name } = equipment;

  const handleChange = (event) => {
    setEquipment(event.target.value);
  };
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
      <div>
        <TextField
          label="Equipment Name"
          id="name"
          sx={{ m: 1, width: "25ch" }}
          value={name}
          onChange={handleChange}
        />
      </div>
    </Box>
  );
};

export default EditEquipmentModal;
