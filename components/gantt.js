import styles from "../styles/GanttChart.module.css";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import { useContext } from "react";
import { EquipmentContext } from "../contexts/equipmentContext";

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

const GanttChart = () => {
  const { equipment } = useContext(EquipmentContext);

  const numColumns = Math.max.apply(
    Math,
    equipment.map(function (row) {
      const max = findLargestEndpoint(row.operations);
      return max;
    })
  );

  return (
    <>
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
  const { selectionIds, toggleSelection } = useContext(EquipmentContext);
  let checked = selectionIds.some((item) => item.id === unit.id);

  const handleChange = () => {
    toggleSelection(unit.id);
  };

  const label = { inputProps: { "aria-label": "selection" } };
  return (
    <div className={styles.chartRow}>
      <Checkbox checked={checked} onChange={handleChange} {...label} />
      <div className={styles.chartRowLabel}>{unit.name}</div>
      <ul
        className={styles.chartRowBars}
        style={{ gridTemplateColumns: `repeat(${numColumns}, 1fr)` }}
      >
        {unit.operations.map((operation) => {
          return (
            <Operation
              key={operation.id}
              operation={operation}
              title={unit.name}
            />
          );
        })}
      </ul>
    </div>
  );
};

const Operation = ({ operation }) => {
  const { id, title, start, end, bgColor } = operation;

  const style = {
    color: "#red",
    gridColumn: `${start}/${end}`,
    backgroundColor: bgColor,
  };

  return (
    <li className={`${styles.listItem} ${styles.tooltip}`} style={style}>
      <Tooltip title={title} arrow>
        <div className={styles.taskContainer}>{/* <span>{title}</span> */}</div>
      </Tooltip>
    </li>
  );
};

const ToolTip = ({ text }) => {
  return (
    <span className="">
      <span className={styles.tooltiptext}>{text}</span>
    </span>
  );
};

// const ChartLines = ({ numColumns }) => {
//   var rows = [],
//     i = 0,
//     len = numColumns;
//   while (++i <= len) rows.push(i);
//   return (
//     <div
//       className={(styles.chartRow, styles.chartLines)}
//       style={{ gridTemplateColumns: `50px repeat(${numColumns}, 1fr)` }}
//     >
//       {rows.map((column, index) => {
//         return <span key={index}></span>;
//       })}
//     </div>
//   );
// };

// const ChartHeader = ({ numColumns }) => {
//   var rows = [],
//     i = 0,
//     len = numColumns;
//   while (++i <= len) rows.push(i);
//   return (
//     <div
//       className="chart-row chart-period"
//       style={{ gridTemplateColumns: `50px repeat(${numColumns}, 1fr)` }}
//     >
//       <div className="chart-row-item"></div>
//       {rows.map((column, index) => {
//         return <span key={index}>{index + 1}</span>;
//       })}
//     </div>
//   );
// };

const findLargestEndpoint = (array) => {
  return Math.max(...array.map((o) => o.end), 0);
};

export default GanttChart;
