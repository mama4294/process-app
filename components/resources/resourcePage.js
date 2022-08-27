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
    bottleneck.operations[0] ? bottleneck.operations[0].start : 0
  );
  const xAxis = createXAxis(cycleTime, 2);
  const hasOperations = operations.flatMap((op) => op.resources).length > 0;

  return (
    <Box
      sx={{
        minWidth: "650px",
        margin: "0 auto",
        padding: "10px 10px",
      }}
    >
      {hasOperations ? (
        resourceOptions.map((resource) => {
          const filteredOperations = filterOperationsByResource(
            operations,
            resource.title
          );
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
        borderRadius: "2px",
        mb: "20px",
      }}
    >
      <h2 style={{ color: resource.color }}>{resource.title}</h2>
      <h6>{`Max: ${chartData.max} ${resource.unit}`}</h6>
      <h6>{`Average: ${roundToTwo(chartData.average)} ${resource.unit}`}</h6>
      <LineChart data={chartData} options={chartOptions} />
    </Box>
  );
};

export default ResourcePage;
