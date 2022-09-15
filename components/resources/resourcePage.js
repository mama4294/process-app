import React, { useContext, useState, useEffect } from "react";
import ActionMenu from "./actionmenu";
import { EquipmentContext } from "../../contexts/equipmentContext";
import { ResourceContext } from "../../contexts/resourceContext";
import { CampaignContext } from "../../contexts/campaignContext";
import { roundToTwo } from "../../utils/helperFunctions";
import Box from "@mui/material/Box";
import { LineChart } from "../charts/LineChart";
import CircularProgress from "@mui/material/CircularProgress";
import {
  filterOperationsByResource,
  createChartData,
  createChartOptions,
} from "../../utils/lineChartLogic";
import {
  AlignVerticalCenterTwoTone,
  ReorderOutlined,
} from "@mui/icons-material";

const ResourcePage = () => {
  const { equipment, calcCycleTime, getMaxEndpoint } =
    useContext(EquipmentContext);
  const { resourceOptions } = useContext(ResourceContext);
  const { batches } = useContext(CampaignContext);
  const operations = equipment.flatMap((eq) => eq.operations);
  const endPoint = getMaxEndpoint();

  const bottleneck = calcCycleTime();
  const cycleTime = bottleneck.duration;
  const offsetTime = Math.abs(
    bottleneck.operations[0].start < 0 ? bottleneck.operations[0].start : 0
  );
  // const xAxis = createXAxis(cycleTime * batches.length + offsetTime);
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
              cycleTime={cycleTime}
              offsetTime={offsetTime}
              batches={batches}
              endPoint={endPoint}
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

const LineChartCard = ({
  resource,
  operations,
  offsetTime,
  cycleTime,
  batches,
  endPoint,
}) => {
  const { findEquipmentById } = useContext(EquipmentContext);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showTotals, setShowTotals] = useState(false);
  const actionMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    setIsLoading(true);
    setChartData({ data: loadData(), options: createChartOptions(resource) });
    setIsLoading(false);
  }, [showTotals, batches]);

  const loadData = () => {
    const data = createChartData({
      operations: operations,
      resourceTitle: resource.title,
      offsetTime: offsetTime,
      cycleTime: cycleTime,
      batches: batches,
      findEquipmentById: findEquipmentById,
      endPoint: endPoint,
      showTotals: showTotals,
    });

    return data;
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseActionMenu = () => {
    setAnchorEl(null);
  };

  const handleToggleTotals = () => {
    setShowTotals((prev) => !prev);
    setAnchorEl(null);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          background: "white",
          width: "340px",
          height: "342.328px",
          padding: "20px",
          borderRadius: "4px",
          m: "20px",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  } else {
    const { data, options } = chartData;
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
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <ActionMenu
            open={actionMenuOpen}
            handleClick={handleClick}
            handleClose={handleCloseActionMenu}
            anchorEl={anchorEl}
            showTotals={showTotals}
            handleToggleTotals={handleToggleTotals}
          />
          <h2 style={{ color: resource.color, textAlign: "center" }}>
            {resource.title}
          </h2>
          <div style={{ width: "24px", height: "24px" }} />
        </div>
        <LineChart data={data} options={options} />
        <p style={{ color: resource.color, textAlign: "center" }}>
          Max:{" "}
          <span
            style={{ fontWeight: "bold" }}
          >{`${data.max} ${resource.unit}`}</span>
          <span></span>
        </p>
        <p style={{ color: resource.color, textAlign: "center" }}>
          Average:
          <span style={{ fontWeight: "bold" }}>
            {" "}
            {`${roundToTwo(data.average)} ${resource.unit}`}{" "}
          </span>
        </p>
      </Box>
    );
  }
};

export default ResourcePage;
