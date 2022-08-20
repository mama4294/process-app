import React, { useContext } from "react";
import { EquipmentContext } from "../../contexts/equipmentContext";
import { ResourceContext } from "../../contexts/resourceContext";
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
  console.log("offsetTime", offsetTime);
  const xAxis = createXAxis(cycleTime, 2);

  return (
    <Box sx={{ minWidth: "650px", margin: "0 auto", padding: "10px 10px" }}>
      {resourceOptions.map((resource) => {
        return (
          <LineChartCard
            key={resource.id}
            resource={resource}
            operations={operations}
            xAxis={xAxis}
            offsetTime={offsetTime}
          />
        );
      })}
    </Box>
  );
};

const LineChartCard = ({ resource, operations, xAxis, offsetTime }) => {
  const filteredOperations = filterOperationsByResource(
    operations,
    resource.title
  );

  const hasData = filteredOperations.length > 0;

  const ChartData = createChartData(
    xAxis,
    filteredOperations,
    resource.title,
    offsetTime
  );
  // console.log("ChartData", ChartData);
  const ChartOptions = createChartOptions(resource);
  if (!hasData) return <></>;
  return (
    <Box
      sx={{
        background: "white",
        padding: "10px",
        borderRadius: "2px",
        mb: "20px",
      }}
    >
      <LineChart data={ChartData} options={ChartOptions} />
    </Box>
  );
};

export default ResourcePage;
