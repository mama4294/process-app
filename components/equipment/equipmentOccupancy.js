import React, { useState, useEffect } from "react";
import styles from "../../styles/EOchart.module.css";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import ActionMenu from "./actionMenu";
import { useContext } from "react";
import { EquipmentContext } from "../../contexts/equipmentContext";
import { CampaignContext } from "../../contexts/campaignContext";
import EditEquipment from "./editEquipment";

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
  const { equipment, EOerror, drawer, closeForm } =
    useContext(EquipmentContext);
  const { error, message } = EOerror;

  return (
    <>
      {error && <Notification message={message} />}
      <div className={styles.container}>
        <div className={styles.chart}>
          <ProcedureTable EquipmentData={equipment} />
        </div>
      </div>
      {drawer.open && <EditEquipment drawer={drawer} handleClose={closeForm} />}
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
    EOerror,
    calcCycleTime,
    getMinEquipmentTime,
    moveUp,
    moveDown,
    duplicate,
    deleteEquipment,
    openFormEdit,
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
  const [anchorEl, setAnchorEl] = useState(null);
  const actionMenuOpen = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseActionMenu = () => {
    setAnchorEl(null);
  };

  const handleMoveUp = () => {
    moveUp(unit.id);
  };

  const handleMoveDown = () => {
    moveDown(unit.id);
  };

  const handleEdit = () => {
    openFormEdit(unit.id);
    setAnchorEl(null);
  };

  const handleDuplicate = () => {
    duplicate(unit.id);
  };

  const handleDelete = () => {
    deleteEquipment(unit.id);
    setAnchorEl(null);
  };

  //Hover logic
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    setIsHovering(true);
  };
  const handleMouseOut = () => {
    setIsHovering(false);
  };

  return (
    <div
      className={styles.chartRow}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <div className={styles.chartRowLabel} style={{ marginLeft: "1rem" }}>
        {unit.title}
      </div>
      {isHovering ? (
        <ActionMenu
          open={actionMenuOpen}
          handleClick={handleClick}
          handleClose={handleCloseActionMenu}
          handleMoveUp={handleMoveUp}
          handleMoveDown={handleMoveDown}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleDuplicate={handleDuplicate}
          anchorEl={anchorEl}
        />
      ) : (
        <div />
      )}
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
                handleEdit={handleEdit}
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
  handleEdit,
}) => {
  const { title, start, end } = operation;

  const backgroundColor = error ? "red" : color;
  const batchOffset = batchIndex * cycleTime;
  const correctedStart = start + batchOffset + negativeCorrection;
  const correctedEnd = end + batchOffset + negativeCorrection;

  const listItemStyle = {
    color: "#red",
    gridColumn: `${correctedStart}/${correctedEnd}`,
  };

  const operationStyle = {
    backgroundColor: backgroundColor,
  };

  return (
    <li
      className={`${styles.listItem} ${styles.tooltip}`}
      style={listItemStyle}
      onClick={handleEdit}
    >
      <Tooltip
        title={`Batch: ${
          batchIndex + 1
        }, Operation: ${title}, Start: ${correctedStart}, End: ${correctedEnd}`}
        arrow
      >
        <div className={styles.taskContainer} style={operationStyle}></div>
      </Tooltip>
    </li>
  );
};

const findLargestEndpoint = (array) => {
  return Math.max(...array.map((o) => o.end), 0);
};

export default EquipmentOccupancyChart;
