import React, { useState, useEffect } from "react";
import styles from "../styles/EOchart.module.css";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import ActionMenu from "./actionMenu";
import { useContext } from "react";
import { EquipmentContext } from "../contexts/equipmentContext";
import { CampaignContext } from "../contexts/campaignContext";

//ISA 88 Terminology

// Equipment Model
// - Process Cell
// - Unit (equipment)
// - Equipment Module

// Operational Model
// - Procedure
// - Unit Procedure
// - Operation
// - Phase

// Process Model
// Process
// Process Stage
// Process Operation
// Process Action

const EquipmentOccupancyChart = () => {
  const { equipment, EOerror } = useContext(EquipmentContext);
  const { error, message } = EOerror;

  return (
    <>
      {error && <Notification message={message} />}
      <div className={styles.container}>
        <div className={styles.chart}>
          <ProcedureTable EquipmentData={equipment} />
        </div>
      </div>
    </>
  );
};

const Notification = ({ message }) => {
  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      <Alert severity="error">{message}</Alert>
    </Stack>
  );
};

const ProcedureTable = ({ EquipmentData }) => {
  return (
    <>
      {EquipmentData.map((unit) => {
        return <UnitRow unit={unit} key={unit.id} />;
      })}
    </>
  );
};

const UnitRow = ({ unit }) => {
  const {
    selectionIds,
    handleToggle,
    EOerror,
    calcCycleTime,
    getMinEquipmentTime,
  } = useContext(EquipmentContext);
  const { batches } = useContext(CampaignContext);
  const { ids: errorIds } = EOerror;
  const bottleneck = calcCycleTime();
  const cycleTime = bottleneck.duration;
  const offsetTime = Math.abs(
    bottleneck.operations[0] ? bottleneck.operations[0].start : 0
  );
  const minOperation = getMinEquipmentTime();
  const negativeCorrection = minOperation <= 0 ? Math.abs(minOperation) + 1 : 0;
  const numColumns = cycleTime * batches.length + offsetTime;

  let checked = selectionIds.some((item) => item.id === unit.id);

  const handleChange = () => {
    handleToggle(unit.id);
  };

  const label = { inputProps: { "aria-label": "selection" } };

  const options = ["None", "Atria", "Callisto", "Pyxis"];

  const [anchorEl, setAnchorEl] = useState(null);
  const actionMenuOpen = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseActionMenu = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    console.log("anchorEl", anchorEl);
  }, [anchorEl]);

  return (
    <div className={styles.chartRow}>
      {/* <Checkbox checked={checked} onChange={handleChange} {...label} /> */}
      <ActionMenu
        open={actionMenuOpen}
        handleClick={handleClick}
        handleClose={handleCloseActionMenu}
        anchorEl={anchorEl}
      />
      <div className={styles.chartRowLabel}>{unit.title}</div>
      <ul
        className={styles.chartRowBars}
        style={{ gridTemplateColumns: `repeat(${numColumns}, 1fr)` }}
      >
        {batches.map((batch, index) => {
          const color = batch.color !== undefined ? batch.color : "#A9C0E4";
          return unit.operations.map((operation) => {
            const isError = errorIds.includes(operation.id);
            return (
              <Operation
                key={operation.id}
                operation={operation}
                error={isError}
                color={color}
                batchIndex={index}
                cycleTime={cycleTime}
                negativeCorrection={negativeCorrection}
              />
            );
          });
        })}
      </ul>
    </div>
  );
};

const Operation = ({
  operation,
  error,
  color,
  batchIndex,
  cycleTime,
  negativeCorrection,
}) => {
  const { title, start, end } = operation;

  const backgroundColor = error ? "red" : color;
  const batchOffset = batchIndex * cycleTime;

  const listItemStyle = {
    color: "#red",
    gridColumn: `${start + batchOffset + negativeCorrection}/${
      end + batchOffset + negativeCorrection
    }`,
  };

  const operationStyle = {
    backgroundColor: backgroundColor,
  };

  return (
    <li
      className={`${styles.listItem} ${styles.tooltip}`}
      style={listItemStyle}
    >
      <Tooltip title={`Batch: ${batchIndex + 1}, Operation: ${title}`} arrow>
        <div className={styles.taskContainer} style={operationStyle}></div>
      </Tooltip>
    </li>
  );
};

const findLargestEndpoint = (array) => {
  return Math.max(...array.map((o) => o.end), 0);
};

export default EquipmentOccupancyChart;
