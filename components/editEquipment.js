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
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import styles from "../styles/operations.module.css";
import { useState, useContext } from "react";
import TextInput from "./inputs/textInput";
import Dropdown from "./inputs/dropdown";
import {
  toggleSelection,
  toggleAll,
  addToArray,
  deleteByIds,
  getArrayOptions,
} from "../utils/checkboxes";
import { generateId } from "../utils/helperFunctions";
import { calcGanttLogic } from "../utils/ganttLogic";
import { EquipmentContext } from "../contexts/equipmentContext";

const EditEquipmentModal = ({ drawer, handleClose }) => {
  const { open, mode } = drawer;
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
        <EquipmentInputForm mode={mode} handleClose={handleClose} />
      </Drawer>
    </div>
  );
};

const EquipmentInputForm = ({ mode, handleClose }) => {
  const { addEquipment, updateEquipment, findSelectedEquipment } =
    useContext(EquipmentContext);
  const equipmentToEdit = mode === "edit" ? findSelectedEquipment() : null;

  const defaultEquipment = {
    id: generateId(),
    title: "",
    operations: [],
  };
  const testOperations = [
    {
      id: "1",
      title: "Fill",
      start: 1,
      end: 2,
      bgColor: "#E5B8D0",
      duration: "1",
      durationUnit: { value: "hr", label: "hr" },
      predecessor: { value: 0, label: "Initial" },
      offset: 0,
      offsetUnit: { value: "hr", label: "hr" },
      type: { value: "SF", label: "Start-to-Finish" },
      resources: [],
    },
    {
      id: "2",
      title: "Heat",
      start: 3,
      end: 4,
      bgColor: "#A0C8C2",
      duration: "1",
      durationUnit: { value: "hr", label: "hr" },
      predecessor: { value: 0, label: "Initial" },
      offset: 0,
      offsetUnit: { value: "hr", label: "hr" },
      type: { value: "SF", label: "Start-to-Finish" },
      resources: [],
    },
    {
      id: "3",
      title: "Cool",
      start: 5,
      end: 6,
      bgColor: "#rgb(178,201,151)",
      duration: "1",
      durationUnit: { value: "hr", label: "hr" },
      predecessor: { value: 0, label: "Initial" },
      offset: 0,
      offsetUnit: { value: "hr", label: "hr" },
      type: { value: "SF", label: "Start-to-Finish" },
      resources: [],
    },
    {
      id: "4",
      title: "Ferment",
      start: 6,
      end: 9,
      bgColor: "#F5CF6B",
      duration: "1",
      durationUnit: { value: "hr", label: "hr" },
      predecessor: { value: 0, label: "Initial" },
      offset: 0,
      offsetUnit: { value: "hr", label: "hr" },
      type: { value: "SF", label: "Start-to-Finish" },
      resources: [],
    },
    {
      id: "5",
      title: "Heat Treat",
      start: 10,
      end: 15,
      bgColor: "blue",
      duration: "1",
      durationUnit: { value: "hr", label: "hr" },
      predecessor: { value: 0, label: "Initial" },
      offset: 0,
      offsetUnit: { value: "hr", label: "hr" },
      type: { value: "SF", label: "Start-to-Finish" },
      resources: [],
    },
    {
      id: "6",
      title: "Transfer",
      start: 16,
      end: 150,
      bgColor: "gray",
      duration: "1",
      durationUnit: { value: "hr", label: "hr" },
      predecessor: { value: 0, label: "Initial" },
      offset: 0,
      offsetUnit: { value: "hr", label: "hr" },
      type: { value: "SF", label: "Start-to-Finish" },
      resources: [],
    },
  ];
  const defaultOperation = {
    id: generateId(),
    title: "",
    duration: "1",
    durationUnit: { value: "hr", label: "hr" },
    predecessor: { value: 0, label: "Initial" },
    offset: 0,
    offsetUnit: { value: "hr", label: "hr" },
    type: { value: "SF", label: "Start-to-Finish" },
    resources: [],
  };
  const [equipment, setEquipment] = useState(
    mode === "edit" ? equipmentToEdit : defaultEquipment
  );
  const [operations, setOperations] = useState(
    mode === "edit" ? equipmentToEdit.operations : []
  );
  const [selectedOperations, setSelectedOperations] = useState([]);

  const handleChangeEquipment = (event) => {
    setEquipment({ ...equipment, [event.target.id]: event.target.value });
  };

  const handleChangeOperation = (operationID, targetID) => (event) => {
    let field = null;
    let value = null;
    if (event.target === undefined) {
      //for dropdowns
      field = targetID;
      //   value = event.value;
      value = { value: event.value, label: event.label };
    } else {
      //for text inputs
      field = event.target.id;
      value = event.target.value;
    }
    const newState = operations.map((operation) => {
      if (operation.id === operationID) {
        console.log(`Found operation with field ${field} and value ${value}`);
        return { ...operation, [field]: value };
      }
      //otherwise return object as is
      return operation;
    });

    setOperations(newState);
  };

  const handleAdd = () => {
    setOperations(addToArray(operations, defaultOperation));
    console.log(operations);
  };

  const handleDelete = () => {
    setOperations(deleteByIds(operations, selectedOperations));
    setSelectedOperations([]);
  };

  const handleToggle = (id) => {
    setSelectedOperations(toggleSelection(selectedOperations, id));
  };

  const handleToggleAll = (checked) => {
    setSelectedOperations(toggleAll(operations, checked));
  };

  const handleSave = (mode) => {
    const { error, array } = calcGanttLogic(operations);
    if (error.error) {
      alert(error.message);
    } else {
      const newEquipment = {
        id: generateId(),
        ...equipment,
        operations: array,
      };

      if (mode === "new") {
        addEquipment(newEquipment);
      } else if (mode === "edit") {
        updateEquipment(newEquipment);
      }
      console.log(newEquipment);
      handleClose();
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <>
            <IconButton onClick={handleClose}>
              <CloseIcon color="action" />
            </IconButton>
            <h1>{mode === "new" ? "New Equipment" : "Edit Equipment"}</h1>
          </>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        <div className={`${styles.title} ${styles.pl8}`}>Equipment</div>
        <TextField
          label="Name"
          id="title"
          variant="standard"
          sx={{ m: 1, width: "25ch" }}
          value={equipment.title}
          onChange={handleChangeEquipment}
        />
      </Box>
      <Divider />
      <Box sx={{ display: "flex", flexWrap: "wrap", p: 2 }}>
        <Table
          operations={operations}
          numColumns={10}
          handleChangeOperation={handleChangeOperation}
          selectedOperations={selectedOperations}
          handleToggle={handleToggle}
          handleToggleAll={handleToggleAll}
          handleAdd={handleAdd}
          handleDelete={handleDelete}
        />
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Stack spacing={2} direction="row">
          <Button variant="contained" onClick={() => handleSave(mode)}>
            Save
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
        </Stack>
      </Box>
    </>
  );
};

const Table = ({
  operations,
  numColumns,
  handleChangeOperation,
  selectedOperations,
  handleToggle,
  handleToggleAll,
  handleAdd,
  handleDelete,
}) => {
  return (
    <>
      <TableHeader
        operations={operations}
        handleToggleAll={handleToggleAll}
        selectedOperations={selectedOperations}
        handleAdd={handleAdd}
        handleDelete={handleDelete}
      />
      {operations.length > 0 &&
        operations.map((operation) => {
          return (
            <OperationRow
              operations={operations}
              operation={operation}
              key={operation.id}
              numColumns={numColumns}
              handleChangeOperation={handleChangeOperation}
              selectedOperations={selectedOperations}
              handleToggle={handleToggle}
            />
          );
        })}
    </>
  );
};

const TableHeader = ({
  operations,
  handleToggleAll,
  selectedOperations,
  handleAdd,
  handleDelete,
}) => {
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
    <>
      <div className={styles.titleContainer}>
        <div className={styles.title}>Operations</div>

        {selectedOperations.length > 0 ? (
          <IconButton onClick={handleDelete}>
            <DeleteIcon color="action" />
          </IconButton>
        ) : (
          <IconButton onClick={handleAdd}>
            <AddIcon color="action" />
          </IconButton>
        )}
      </div>
      {operations.length > 0 ? (
        <div className={`${styles.chartRow} ${styles.headerRow}`}>
          <div>
            <Checkbox {...label} onChange={handleChange} />
          </div>
          {headers.map((header, index) => {
            return (
              <div className={styles.tableHeaderValue} key={index}>
                {header}
              </div>
            );
          })}
        </div>
      ) : (
        <Button variant="standard" onClick={handleAdd}>
          Add Operation
        </Button>
      )}
    </>
  );
};

const OperationRow = ({
  operations,
  operation,
  numColumns,
  handleChangeOperation,
  selectedOperations,
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
  } = operation;
  const checked = selectedOperations.some((item) => item.id === id);
  const predecessorOptions = [
    { value: 0, label: "Initial" },
    ...getArrayOptions(operations, id),
  ];

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
          placeholder="Name"
          onChange={handleChangeOperation(id)}
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
            onChange={handleChangeOperation(id)}
          />
          <Dropdown
            id="durationUnit"
            value={durationUnit}
            onChange={handleChangeOperation(id, "durationUnit")}
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
          onChange={handleChangeOperation(id, "predecessor")}
          options={predecessorOptions}
        />
      </div>
      <div className={styles.chartRowLabel}>
        <Dropdown
          id="type"
          value={type}
          onChange={handleChangeOperation(id, "type")}
          options={[
            { label: "Start-to-Finish", value: "SF" },
            { label: "Start-to-Start", value: "SS" },
            { label: "Finish-to-Finish", value: "FF" },
            { label: "Finish-to-Start", value: "FS" },
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
            onChange={handleChangeOperation(id)}
          />
          <Dropdown
            id="offsetUnit"
            value={offsetUnit}
            onChange={handleChangeOperation(id, "offsetUnit")}
            options={[
              { label: "min", value: "min" },
              { label: "hr", value: "hr" },
              { label: "day", value: "day" },
            ]}
          />
        </div>
      </div>
      <div className={styles.chartRowLabel}>
        {/* <TextField
          label="Resources"
          id="resources"
          variant="standard"
          sx={{ m: 1 }}
          value={resources[0]}
          onChange={handleChangeOperation(id)}
        /> */}
      </div>
      <ul
        className={styles.chartRowBars}
        style={{ gridTemplateColumns: `repeat(${numColumns}, 1fr)` }}
      >
        <li className={`${styles.listItem} ${styles.tooltip}`} style={style}>
          <Tooltip title={operation.title} arrow>
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
