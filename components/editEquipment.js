import React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import Select from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from "@mui/material/InputAdornment";
import styles from "../styles/ProcedureChart.module.css";
import { useState } from "react";

const EditEquipmentModal = ({ open, handleClose }) => {
  let drawerWidth = screen.width * 0.75;
  return (
    <div>
      <Drawer
        anchor="right"
        PaperProps={{
          sx: {
            width: drawerWidth,
          },
        }}
        open={open}
        onClose={handleClose}
        variant="temporary"
      >
        <EquipmentInputForm handleClose={handleClose} />
      </Drawer>
    </div>
  );
};

const EquipmentInputForm = ({ handleClose }) => {
  const defaultEquipment = { title: "Equipment 1", procedures: [] };
  const testProcedures = [
    {
      id: "1",
      title: "Fill",
      start: 1,
      end: 2,
      bgColor: "#E5B8D0",
      duration: "1",
      durationUnit: "hr",
      predecessor: "CIP",
      offset: 0,
      offsetUnit: "hr",
      type: "SF",
      resources: [],
    },
    {
      id: "2",
      title: "Heat",
      start: 3,
      end: 4,
      bgColor: "#A0C8C2",
      duration: "1",
      durationUnit: "hr",
      predecessor: "CIP",
      offset: 0,
      offsetUnit: "hr",
      type: "SF",
      resources: [],
    },
    {
      id: "3",
      title: "Cool",
      start: 5,
      end: 6,
      bgColor: "#rgb(178,201,151)",
      duration: "1",
      durationUnit: "hr",
      predecessor: "CIP",
      offset: 0,
      offsetUnit: "hr",
      type: "SF",
      resources: [],
    },
    {
      id: "4",
      title: "Ferment",
      start: 6,
      end: 9,
      bgColor: "#F5CF6B",
      duration: "1",
      durationUnit: "hr",
      predecessor: "CIP",
      offset: 0,
      offsetUnit: "hr",
      type: "SF",
      resources: [],
    },
    {
      id: "5",
      title: "Heat Treat",
      start: 10,
      end: 15,
      bgColor: "blue",
      duration: "1",
      durationUnit: "hr",
      predecessor: "CIP",
      offset: 0,
      offsetUnit: "hr",
      type: "SF",
      resources: [],
    },
    {
      id: "6",
      title: "Transfer",
      start: 16,
      end: 150,
      bgColor: "gray",
      duration: "1",
      durationUnit: "hr",
      predecessor: "CIP",
      offset: 0,
      offsetUnit: "hr",
      type: "SF",
      resources: [],
    },
  ];
  const defaultProcedure = {
    title: "Fill",
    duration: "1",
    durationUnit: "hr",
    predecessor: "CIP",
    offset: 0,
    offsetUnit: "hr",
    type: "SF",
    resources: [],
  };
  const [equipment, setEquipment] = useState(defaultEquipment);
  const [procedures, setProcedures] = useState([...testProcedures]);

  const handleChange = (event) => {
    setEquipment(event.target.value);
  };

  const addProcedure = () => {
    const newProcedures = [...procedures, defaultProcedure];
    console.log(newProcedures);
    setProcedures(newProcedures);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton onClick={handleClose}>
            <CloseIcon color="action" />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: "flex", flexWrap: "wrap", p: 2 }}>
        <TextField
          label="Equipment Name"
          id="name"
          variant="standard"
          sx={{ m: 1, width: "25ch" }}
          value={equipment.title}
          onChange={handleChange}
        />
      </Box>
      <Divider textAlign="left">Procedures</Divider>
      <Box sx={{ display: "flex", flexWrap: "wrap", p: 2 }}>
        <Table ProcedureData={procedures} numColumns={10} />
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", p: 2 }}>
        <Button variant="contained" onClick={addProcedure}>
          Add Procedure
        </Button>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", flexWrap: "wrap", p: 2 }}>
        <Stack spacing={2} direction="row">
          <Button variant="contained">Save</Button>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
        </Stack>
      </Box>
    </>
  );
};

const Table = ({ ProcedureData, numColumns }) => {
  return (
    <>
      {ProcedureData.map((procedure) => {
        return (
          <ProcedureRow
            procedure={procedure}
            key={procedure.id}
            numColumns={numColumns}
          />
        );
      })}
    </>
  );
};

const ProcedureRow = ({ procedure, numColumns }) => {
  const label = { inputProps: { "aria-label": "selection" } };
  const style = {
    color: "#red",
    gridColumn: `2/4`,
    backgroundColor: "#red",
  };
  return (
    <div className={styles.chartRow}>
      <Checkbox {...label} />
      <div className={styles.chartRowLabel}>
        <TextField
          label="Procedure Title"
          id="name"
          variant="standard"
          sx={{ m: 1 }}
          value={procedure.title}
          //   onChange={handleChange}
        />
      </div>
      <div className={styles.chartRowLabel}>
        <TextField
          label="Duration"
          id="duration"
          sx={{ m: 1 }}
          variant="standard"
          InputProps={{
            endAdornment: <InputAdornment position="end">hr</InputAdornment>,
          }}
          value={procedure.duration}
          //   onChange={handleChange}
        />
      </div>
      <div className={styles.chartRowLabel}>
        <TextField
          label="Predecessor"
          id="predecessor"
          sx={{ m: 1 }}
          variant="standard"
          value={procedure.predecessor}
          //   onChange={handleChange}
        />
      </div>
      <div className={styles.chartRowLabel}>
        <Select
          id="type"
          value={procedure.type}
          label="type"
          variant="standard"
          //   onChange={handleChange}
        >
          <MenuItem value={"SF"}>Start-to-Finish</MenuItem>
          <MenuItem value={"SS"}>Start-to-Start</MenuItem>
          <MenuItem value={"FF"}>Finish-to-Finish</MenuItem>
          <MenuItem value={"FS"}>Finish-to-Start</MenuItem>
        </Select>
      </div>
      <div className={styles.chartRowLabel}>
        <TextField
          label="Offset"
          id="offset"
          variant="standard"
          sx={{ m: 1 }}
          value={procedure.offset}
          InputProps={{
            endAdornment: <InputAdornment position="end">hr</InputAdornment>,
          }}
          //   onChange={handleChange}
        />
      </div>
      <div className={styles.chartRowLabel}>
        <TextField
          label="Resources"
          id="resources"
          variant="standard"
          sx={{ m: 1 }}
          value={procedure.resources[0]}
          //   onChange={handleChange}
        />
      </div>
      <ul
        className={styles.chartRowBars}
        style={{ gridTemplateColumns: `repeat(${numColumns}, 1fr)` }}
      >
        <li className={`${styles.listItem} ${styles.tooltip}`} style={style}>
          <Tooltip title={procedure.title} arrow>
            <div className={styles.taskContainer}>
              {/* <span>{title}</span> */}
            </div>
          </Tooltip>
        </li>
      </ul>
    </div>
  );
};

export default EditEquipmentModal;
