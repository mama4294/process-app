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
import styles from "../../styles/operations.module.css";
import Alert from "@mui/material/Alert";
import { blueGrey } from "@mui/material/colors";
import { useState, useContext, useEffect, useCallback } from "react";
import { useWindowWide } from "../../hooks/windowWidth";
import TextInput from "../inputs/textInput";
import Dropdown from "../inputs/dropdown";
import {
  toggleSelection,
  toggleAll,
  addToArray,
  deleteByIds,
  getArrayOptions,
} from "../../utils/arrayLogic";
import { generateId } from "../../utils/helperFunctions";
import { EquipmentContext } from "../../contexts/equipmentContext";
import { ResourceSelector } from "../inputs/resourceSelector";
import {
  ContentPasteSearchOutlined,
  LocalConvenienceStoreOutlined,
} from "@mui/icons-material";

const EditEquipmentModal = ({ drawer, handleClose }) => {
  const { open, mode } = drawer;
  const windowWidth = useWindowWide();
  const drawerWidth =
    windowWidth < 700 ? windowWidth * 0.95 : windowWidth * 0.8;

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
  const {
    addEquipment,
    updateEquipment,
    findSelectedEquipment,
    findAllEquipmentOpOptions,
    solveGantt,
    findEquipmentDuration,
  } = useContext(EquipmentContext);
  const equipmentToEdit = mode === "edit" ? findSelectedEquipment() : null;
  const [operations, setOperations] = useState(
    mode === "edit" ? equipmentToEdit.operations : []
  );
  const [error, setError] = useState({ error: false, ids: [] });
  const externalOptions = findAllEquipmentOpOptions();

  const defaultEquipment = {
    id: generateId(),
    title: "",
    operations: [],
  };

  const defaultOperation = {
    id: generateId(),
    title: "",
    duration: 1,
    durationUnit: { value: "hr", label: "hr" },
    predecessor:
      operations.length > 0
        ? {
            value: operations[operations.length - 1].id,
            label: operations[operations.length - 1].title,
            external: false,
          }
        : { value: 0, label: "Initial", external: false },
    offset: 0,
    offsetUnit: { value: "hr", label: "hr" },
    type: { value: "SF", label: "Start-to-Finish" },
    resources: [],
  };
  const [equipment, setEquipment] = useState(
    mode === "edit" ? equipmentToEdit : defaultEquipment
  );

  const [selectedOperations, setSelectedOperations] = useState([]);

  const handleChangeEquipment = (event) => {
    setEquipment({ ...equipment, [event.target.id]: event.target.value });
  };

  const handleChangeOperation = ({
    targetID,
    operation,
    event,
    predecessorOptions,
  }) => {
    let field = null;
    let value = null;
    let newOp = {};

    if (!event) return;
    console.log(event);
    if (event.target === undefined) {
      //for dropdowns
      let options = [];
      const predOptions = [
        ...predecessorOptions[0].options,
        ...predecessorOptions[1].options,
      ];

      //LINK is selected, a new duration is automatically calculated
      if (targetID == "type" && event.value == "LINK") {
        console.log("Changed to Link");
        console.log(operation.predecessor);
        const pred = predOptions.find(
          (op) => op.value == operation.predecessor.value
        );
        const duration = pred.duration;
        const durationUnit = pred.durationUnit;

        newOp = { duration, durationUnit };
      }

      //When predicessor changes and LINK is selected, a new duration is automatically calculated
      if (targetID == "predecessor" && operation.type.value == "LINK") {
        const pred = predOptions.find((op) => op.value == event.value);
        const duration = pred.duration;
        const durationUnit = pred.durationUnit;

        newOp = { duration, durationUnit };
      }
      //When link is selected, duration needs to be automatically calulated

      field = targetID;
      value = {
        value: event.value,
        label: event.label,
        external: event.external,
      };
    } else {
      //for text inputs
      field = event.target.id;
      value = event.target.value;
    }
    const totalNewOp = { [field]: value, ...newOp };
    const newState = operations.map((op) => {
      if (op.id === operation.id) {
        // console.log(`Found operation with field ${field} and value ${value}`);
        return { ...op, ...totalNewOp };
      }
      //otherwise return object as is
      return op;
    });

    setOperations(newState);
  };

  const handleChangeResources = (operationID, res) => {
    console.log("Resource changed...: id:", operationID, "Resources:", res);
    const newState = operations.map((operation) => {
      if (operation.id === operationID) {
        // console.log(`Found operation with field ${field} and value ${value}`);
        return { ...operation, resources: res };
      }
      //otherwise return object as is
      return operation;
    });
    console.log("NewOperation", newState);
    setOperations(newState);
  };

  const handleAdd = () => {
    setOperations(addToArray(operations, defaultOperation));
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
    const { error, array } = solveGantt(operations);
    if (error.error) {
      setError({ error: true, ids: error.ids, message: error.message });
    } else {
      const duration = findEquipmentDuration(array);
      if (mode === "new") {
        addEquipment({
          id: generateId(),
          ...equipment,
          operations: array,
          duration: duration,
        });
      } else if (mode === "edit") {
        updateEquipment({
          ...equipment,
          operations: array,
          duration: duration,
        });
      }
      handleClose();
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <>
            <IconButton onClick={handleClose}>
              <CloseIcon sx={{ color: blueGrey[50] }} />
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
          autoFocus
        />
      </Box>
      <Divider />
      <Box sx={{ pl: 2, pt: 2, pb: 2 }}>
        <Table
          operations={operations}
          error={error}
          numColumns={10}
          handleChangeOperation={handleChangeOperation}
          handleChangeResources={handleChangeResources}
          externalOptions={externalOptions}
          selectedOperations={selectedOperations}
          handleToggle={handleToggle}
          handleToggleAll={handleToggleAll}
          handleAdd={handleAdd}
          handleDelete={handleDelete}
        />
      </Box>
      <Divider />
      <Box sx={{ pt: 2, px: 2 }}>
        {error.error > 0 && <Alert severity="error">{error.message}</Alert>}
      </Box>

      <Box sx={{ pt: 2, px: 2 }}>
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
  handleChangeResources,
  selectedOperations,
  externalOptions,
  handleToggle,
  handleToggleAll,
  handleAdd,
  handleDelete,
  error,
}) => {
  return (
    <>
      <TableTitle
        handleAdd={handleAdd}
        handleDelete={handleDelete}
        selectedOperations={selectedOperations}
      />

      <div className={styles.scrollX}>
        <TableHeader
          operations={operations}
          handleToggleAll={handleToggleAll}
        />
        {operations.length > 0 &&
          operations.map((operation) => {
            return (
              <OperationRow
                operations={operations}
                operation={operation}
                externalOptions={externalOptions}
                key={operation.id}
                numColumns={numColumns}
                handleChangeOperation={handleChangeOperation}
                handleChangeResources={handleChangeResources}
                selectedOperations={selectedOperations}
                handleToggle={handleToggle}
                error={error}
              />
            );
          })}
      </div>

      {operations.length > 0 && (
        <Button variant="outline" onClick={handleAdd} sx={{ mt: 2 }}>
          Add Operation
        </Button>
      )}
    </>
  );
};

const TableTitle = ({ handleAdd, handleDelete, selectedOperations }) => {
  return (
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
  );
};

const TableHeader = ({ operations, handleToggleAll }) => {
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
      {operations.length > 0 && (
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
      )}
    </>
  );
};

const OperationRow = ({
  operations,
  operation,
  numColumns,
  handleChangeOperation,
  handleChangeResources,
  selectedOperations,
  externalOptions,
  handleToggle,
  error,
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
  const isError = error.ids.includes(id);
  const internalOptions = [
    { value: 0, label: "Initial", external: false },
    ...getArrayOptions(operations, id),
  ];

  const predecessorOptions = [
    { label: "Internal", options: internalOptions },
    { label: "External", options: externalOptions },
  ];

  const handleChange = () => {
    handleToggle(id);
  };

  const onChangeValue = (targetID) => (event) => {
    const details = {
      targetID: targetID,
      operation: operation,
      event: event,
      predecessorOptions: predecessorOptions,
    };
    handleChangeOperation(details);
  };

  const label = { inputProps: { "aria-label": "selection" } };
  const style = {
    color: "#red",
    gridColumn: `2/4`,
    backgroundColor: "#red",
  };

  const formatGroupLabel = (data) => (
    <div style={styles.dropdownGroup}>
      <span>{data.label}</span>
      <span style={styles.dropdownBadge}>{data.options.length}</span>
    </div>
  );

  //For autofocusing on the next row title input
  const nameInput = useCallback((inputElement) => {
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  const disabled = type.value === "LINK";

  return (
    <div className={`${styles.chartRow} ${isError ? styles.error : ""}`}>
      <Checkbox {...label} checked={checked} onChange={handleChange} />
      <div className={styles.chartRowLabel}>
        <TextInput
          id="title"
          value={title}
          type="text"
          placeholder="Name"
          // onChange={handleChangeOperation(id)}
          onChange={onChangeValue()}
          ref={nameInput}
        />
      </div>
      <div className={styles.chartRowLabel}>
        <div className={styles.doubleCell}>
          <TextInput
            id="duration"
            value={duration}
            type="number"
            min="0"
            disabled={disabled}
            style={{ textAlign: "right" }}
            placeholder="Duration"
            // onChange={handleChangeOperation(id)}
            onChange={onChangeValue()}
          />
          <Dropdown
            id="durationUnit"
            value={durationUnit}
            disabled={disabled}
            // onChange={handleChangeOperation(id, "durationUnit")}
            onChange={onChangeValue("durationUnit")}
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
          // onChange={handleChangeOperation(id, "predecessor")}
          onChange={onChangeValue("predecessor")}
          options={predecessorOptions}
          isSearchable={true}
          // formatGroupLabel={formatGroupLabel}
        />
      </div>
      <div className={styles.chartRowLabel}>
        <Dropdown
          id="type"
          value={type}
          // onChange={handleChangeOperation(id, "type")}
          onChange={onChangeValue("type")}
          options={[
            { label: "Start-to-Finish", value: "SF" },
            { label: "Start-to-Start", value: "SS" },
            { label: "Finish-to-Finish", value: "FF" },
            { label: "Finish-to-Start", value: "FS" },
            { label: "Link", value: "LINK" },
          ]}
        />
      </div>
      <div className={styles.chartRowLabel}>
        <div className={styles.doubleCell}>
          <TextInput
            id="offset"
            value={offset}
            type="number"
            disabled={disabled}
            style={{ textAlign: "right" }}
            placeholder="Offset"
            onChange={handleChangeOperation(id)}
          />
          <Dropdown
            id="offsetUnit"
            value={offsetUnit}
            disabled={disabled}
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
        <ResourceSelector
          id="resources"
          value={resources}
          operationId={id}
          onChange={handleChangeResources}
        />
      </div>
    </div>
  );
};

export default EditEquipmentModal;
