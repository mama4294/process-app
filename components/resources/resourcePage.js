import React, { useContext } from "react";
import { EquipmentContext } from "../../contexts/equipmentContext";
import { ResourceContext } from "../../contexts/resourceContext";
import { roundToTwo } from "../../utils/helperFunctions";
import Box from "@mui/material/Box";
import { LineChart } from "../charts/LineChart";
import {
  filterOperationsByResource,
  createXAxis,
  createChartData,
  createChartOptions,
} from "../../utils/lineChartLogic";

const ResourcePage = () => {
  const { equipment, calcCycleTime } = useContext(EquipmentContext);
  const { resourceOptions } = useContext(ResourceContext);
  const operations = equipment.flatMap((eq) => eq.operations);

  const bottleneck = calcCycleTime();
  const cycleTime = bottleneck.duration;
  const offsetTime = Math.abs(
    bottleneck.operations[0].start < 0 ? bottleneck.operations[0].start : 0
  );
  const xAxis = createXAxis(cycleTime, 2);
  const hasOperations = operations.flatMap((op) => op.resources).length > 0;

  return (
    <Box
      sx={{
        minWidth: "650px",
        margin: "0 auto",
        padding: "10px 10px",
        display: "flex",
        flexWrap: "wrap",
        backgroundColor: "#dddddd",
      }}
    >
      {hasOperations ? (
        resourceOptions.map((resource) => {
          const filteredOperations = filterOperationsByResource(
            operations,
            resource.title
          );
          console.log("Filtered by: ", resource.title);
          console.log("filteredOperations", filteredOperations);
          const hasResources = filteredOperations.length > 0;
          if (!hasResources) return <></>;
          return (
            <LineChartCard
              key={resource.id}
              resource={resource}
              operations={filteredOperations}
              xAxis={xAxis}
              offsetTime={offsetTime}
            />
          );
        })
      ) : (
        <NoResourcesCard />
      )}
    </Box>
  );
};

const NoResourcesCard = () => {
  return (
    <Box
      sx={{
        background: "white",
        padding: "20px",
        borderRadius: "2px",
        mb: "20px",
      }}
    >
      <h6>No operations use a resource</h6>
    </Box>
  );
};

const LineChartCard = ({ resource, operations, xAxis, offsetTime }) => {
  const chartData = createChartData(
    xAxis,
    operations,
    resource.title,
    offsetTime
  );

  const chartOptions = createChartOptions(resource);
  return (
    <Box
      sx={{
        background: "white",
        padding: "20px",
        borderRadius: "4px",
        m: "20px",
        boxShadow:
          "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      }}
    >
      <h2 style={{ color: resource.color, textAlign: "center" }}>
        {resource.title}
      </h2>
      <LineChart data={chartData} options={chartOptions} />
      <p style={{ color: resource.color, textAlign: "center" }}>
        Max:{" "}
        <span
          style={{ fontWeight: "bold" }}
        >{`${chartData.max} ${resource.unit}`}</span>
        <span></span>
      </p>
      <p style={{ color: resource.color, textAlign: "center" }}>
        Average:
        <span style={{ fontWeight: "bold" }}>
          {" "}
          {`${roundToTwo(chartData.average)} ${resource.unit}`}{" "}
        </span>
      </p>
    </Box>
  );
};

export default ResourcePage;
