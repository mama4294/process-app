import styles from "../styles/GanttChart.module.css";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
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

  const numColumns = Math.max.apply(
    Math,
    equipment.map(function (row) {
      const max = findLargestEndpoint(row.operations);
      return max;
    })
  );

  return (
    <>
      {error && <Notification message={message} />}
      <div className={styles.container}>
        <div className={styles.chart}>
          {/* <ChartHeader numColumns={numColumns}/> */}
          {/* <ChartLines numColumns={numColumns}/> */}
          <ProcedureTable EquipmentData={equipment} numColumns={numColumns} />
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

const ProcedureTable = ({ EquipmentData, numColumns }) => {
  return (
    <>
      {EquipmentData.map((unit) => {
        return <UnitRow unit={unit} key={unit.id} numColumns={numColumns} />;
      })}
    </>
  );
};

const UnitRow = ({ unit, numColumns }) => {
  const { selectionIds, handleToggle, EOerror } = useContext(EquipmentContext);
  const { batches } = useContext(CampaignContext);
  const { ids: errorIds } = EOerror;
  let checked = selectionIds.some((item) => item.id === unit.id);

  const handleChange = () => {
    handleToggle(unit.id);
  };

  const color = batches[0] !== undefined ? batches[0].color : "#A9C0E4";

  const label = { inputProps: { "aria-label": "selection" } };
  return (
    <div className={styles.chartRow}>
      <Checkbox checked={checked} onChange={handleChange} {...label} />
      <div className={styles.chartRowLabel}>{unit.title}</div>
      <ul
        className={styles.chartRowBars}
        style={{ gridTemplateColumns: `repeat(${numColumns}, 1fr)` }}
      >
        {unit.operations.map((operation) => {
          const isError = errorIds.includes(operation.id);
          return (
            <Operation
              key={operation.id}
              operation={operation}
              error={isError}
              color={color}
            />
          );
        })}
      </ul>
    </div>
  );
};

const Operation = ({ operation, error, color }) => {
  const { title, start, end } = operation;

  const backgroundColor = error ? "red" : color;

  const style = {
    color: "#red",
    gridColumn: `${start}/${end}`,
    backgroundColor: backgroundColor,
  };

  return (
    <li className={`${styles.listItem} ${styles.tooltip}`} style={style}>
      <Tooltip title={title} arrow>
        <div className={styles.taskContainer}>{/* <span>{title}</span> */}</div>
      </Tooltip>
    </li>
  );
};

const findLargestEndpoint = (array) => {
  return Math.max(...array.map((o) => o.end), 0);
};

export default EquipmentOccupancyChart;
