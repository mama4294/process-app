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
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import styles from "../styles/ProcedureChart.module.css";
import { useState, useEffect } from "react";
import TextInput from "./inputs/textInput";
import Dropdown from "./inputs/dropdown";
import { toggleSelection, toggleAll } from "../utils/checkboxes";

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
      type: "Start-to-Finish",
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
      type: "Start-to-Finish",
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
      type: "Start-to-Finish",
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
      type: "Start-to-Finish",
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
      type: "Start-to-Finish",
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
      type: "Start-to-Finish",
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
    type: "Start-to-Finish",
    resources: [],
  };
  const [equipment, setEquipment] = useState(defaultEquipment);
  const [procedures, setProcedures] = useState([...testProcedures]);
  const [selectedProcedures, setSelectedProcedures] = useState([]);

  const handleChangeEquipment = (event) => {
    setEquipment({ ...equipment, [event.target.id]: event.target.value });
  };

  const handleChangeProcedure = (procedureID, targetID) => (event) => {
    let field = null;
    let value = null;
    if (event.target === undefined) {
      //for dropdowns
      field = targetID;
      value = event.value;
    } else {
      //for text inputs
      field = event.target.id;
      value = event.target.value;
    }
    const newState = procedures.map((procedure) => {
      if (procedure.id === procedureID) {
        console.log(`Found procedure with field ${field} and value ${value}`);
        return { ...procedure, [field]: value };
      }
      //otherwise return object as is
      return procedure;
    });

    setProcedures(newState);
  };

  const addProcedure = () => {
    const newProcedures = [...procedures, defaultProcedure];
    console.log(newProcedures);
    setProcedures(newProcedures);
  };

  useEffect(() => {
    console.log(selectedProcedures);
  }, [selectedProcedures]);

  const handleToggle = (id) => {
    setSelectedProcedures(toggleSelection(selectedProcedures, id));
  };

  const handleToggleAll = (checked) => {
    setSelectedProcedures(toggleAll(procedures, checked));
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
          id="title"
          variant="standard"
          sx={{ m: 1, width: "25ch" }}
          value={equipment.title}
          onChange={handleChangeEquipment}
        />
      </Box>
      <Divider textAlign="left">Procedures</Divider>
      <Box sx={{ display: "flex", flexWrap: "wrap", p: 2 }}>
        <Table
          ProcedureData={procedures}
          numColumns={10}
          handleChangeProcedure={handleChangeProcedure}
          selectedProcedures={selectedProcedures}
          handleToggle={handleToggle}
          handleToggleAll={handleToggleAll}
        />
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

const Table = ({
  ProcedureData,
  numColumns,
  handleChangeProcedure,
  selectedProcedures,
  handleToggle,
  handleToggleAll,
}) => {
  return (
    <>
      <TableHeader handleToggleAll={handleToggleAll} />
      {ProcedureData.map((procedure) => {
        return (
          <ProcedureRow
            procedure={procedure}
            key={procedure.id}
            numColumns={numColumns}
            handleChangeProcedure={handleChangeProcedure}
            selectedProcedures={selectedProcedures}
            handleToggle={handleToggle}
          />
        );
      })}
    </>
  );
};

const TableHeader = ({ handleToggleAll }) => {
  const headers = [
    "Title",
    "Duration",
    "Predecessor",
    "Type",
    "Offset",
    "Resources",
  ];
  const handleChange = (event) => {
    handleToggleAll(event.target.checked);
  };
  const label = { inputProps: { "aria-label": "selection" } };
  return (
    <div className={styles.chartRow}>
      <div>
        <Checkbox {...label} onChange={handleChange} />
      </div>
      {headers.map((header, index) => {
        return (
          <div className={styles.tableHeader} key={index}>
            {header}
          </div>
        );
      })}
    </div>
  );
};

const ProcedureRow = ({
  procedure,
  numColumns,
  handleChangeProcedure,
  selectedProcedures,
  handleToggle,
}) => {
  const {
    title,
    id,
    duration,
    durationUnit,
    predecessor,
    type,
    offset,
    offsetUnit,
    resources,
  } = procedure;
  const checked = selectedProcedures.some((item) => item.id === id);
  const handleChange = () => {
    handleToggle(id);
  };
  const label = { inputProps: { "aria-label": "selection" } };
  const style = {
    color: "#red",
    gridColumn: `2/4`,
    backgroundColor: "#red",
  };
  return (
    <div className={styles.chartRow}>
      <Checkbox {...label} checked={checked} onChange={handleChange} />
      <div className={styles.chartRowLabel}>
        <TextInput
          id="title"
          value={title}
          type="text"
          placeholder="Procedure Title"
          onChange={handleChangeProcedure(id)}
        />
      </div>
      <div className={styles.chartRowLabel}>
        <div className={styles.doubleCell}>
          <TextInput
            id="duration"
            value={duration}
            type="number"
            style={{ textAlign: "right" }}
            placeholder="Duration"
            onChange={handleChangeProcedure(id)}
          />
          <Dropdown
            id="durationUnit"
            value={durationUnit}
            onChange={handleChangeProcedure(id, "durationUnit")}
            options={[
              { label: "min", value: "min" },
              { label: "hr", value: "hr" },
              { label: "day", value: "day" },
            ]}
          />
        </div>
      </div>
      <div className={styles.chartRowLabel}>
        <Dropdown
          id="predecessor"
          value={predecessor}
          onChange={handleChangeProcedure(id, "predecessor")}
          options={[{ label: "CIP", value: "CIP" }]}
        />
      </div>
      <div className={styles.chartRowLabel}>
        <Dropdown
          id="type"
          value={type}
          onChange={handleChangeProcedure(id, "type")}
          options={[
            { label: "Start-to-Finish", value: "Start-to-Finish" },
            { label: "Start-to-Start", value: "Start-to-Start" },
            { label: "Finish-to-Finish", value: "Finish-to-Finish" },
            { label: "Finish-to-Start", value: "Finish-to-Start" },
          ]}
        />
      </div>
      <div className={styles.chartRowLabel}>
        <div className={styles.doubleCell}>
          <TextInput
            id="offset"
            value={offset}
            type="number"
            style={{ textAlign: "right" }}
            placeholder="Offset"
            onChange={handleChangeProcedure(id)}
          />
          <Dropdown
            id="offsetUnit"
            value={offsetUnit}
            onChange={handleChangeProcedure(id, "offsetUnit")}
            options={[
              { label: "min", value: "min" },
              { label: "hr", value: "hr" },
              { label: "day", value: "day" },
            ]}
          />
        </div>
      </div>
      <div className={styles.chartRowLabel}>
        <TextField
          label="Resources"
          id="resources"
          variant="standard"
          sx={{ m: 1 }}
          value={resources[0]}
          onChange={handleChangeProcedure(id)}
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
