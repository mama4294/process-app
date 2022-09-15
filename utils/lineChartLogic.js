import { LocalConvenienceStoreOutlined } from "@mui/icons-material";
import { convertToMinutes } from "./ganttLogic";

const createDatasets = (
  xAxis,
  operations,
  resourceTitle,
  offsetTime,
  cycleTime,
  batches,
  findEquipmentById,
  endPoint
) => {
  let dataset = [];
  operations.map((operation) => {
    const resource = findObjectByTitle(operation.resources, resourceTitle);
    const parentEquipment = findEquipmentById(operation.parentId);
    const lines = createLinesFromOp(operation, resourceTitle);
    const batchedLines = multiplyLinesByBatches(lines, batches, cycleTime);
    const points = convertLinesToPoints(batchedLines);
    const pointsWithEnds = addEndsToPoints(points, endPoint);

    dataset.push({
      label: `${parentEquipment.title} - ${operation.title}`,
      data: pointsWithEnds,
      unit: resource.unit,
      borderColor: "gray",
      pointRadius: 1,
      borderWidth: 1,
      fill: true,
      showLine: true,
    });
  });

  const lines = createLinesFromOps(operations, resourceTitle);
  const batchedLines = multiplyLinesByBatches(lines, batches, cycleTime);
  const totalPoints = createTotalsFromLines(batchedLines);
  const totalsWithEnds = addEndsToPoints(totalPoints, endPoint);

  if (operations.length > 1) {
    //add total row
    dataset.push({
      label: "Sum",
      data: totalsWithEnds,
      unit: "Total",
      borderColor: "#EB144C",
      borderDash: [1, 1],
      borderWidth: 1,
      pointRadius: 1,
      showLine: true,
    });
  }
  console.log("Dataset", dataset);
  return dataset;
};

export const filterOperationsByResource = (operations, resource) => {
  let newArray = [];
  operations.map((op) => {
    if (op.resources.some((r) => r.title === resource)) {
      newArray.push({ ...op });
    }
  });
  return newArray;
};

export const createXAxis = (length) => {
  const step = 1;
  const xAxis = [];
  let i = 0;
  while (i < length) {
    xAxis.push({ value: i, label: `${i} min` });
    i = i + step;
  }
  return xAxis;
};

export const createChartData = (
  xAxis,
  operations,
  resourceTitle,
  offsetTime,
  cycleTime,
  batches,
  findEquipmentById,
  endPoint
) => {
  const labels = createDataLabels(xAxis);
  const datasets = createDatasets(
    xAxis,
    operations,
    resourceTitle,
    offsetTime,
    cycleTime,
    batches,
    findEquipmentById,
    endPoint
  );
  const max = calcMax(datasets);
  const average = calcAverage(datasets);

  return {
    labels: labels,
    datasets: datasets,
    max: max,
    average: average,
  };
};

const createLinesFromOp = (operation, resourceTitle) => {
  let lines = [];
  const resource = operation.resources.find(
    (res) => res.title === resourceTitle
  );

  const value = Number(resource.amount);
  const start = { x: operation.start, y: value };
  const end = { x: operation.end, y: value };
  lines.push({ start, end });
  return lines;
};

const createLinesFromOps = (operations, resourceTitle) => {
  let lines = [];
  operations.map((operation) => {
    const resource = operation.resources.find(
      (res) => res.title === resourceTitle
    );

    const value = Number(resource.amount);
    const start = { x: operation.start, y: value };
    const end = { x: operation.end, y: value };
    lines.push({ start, end });
  });
  return lines;
};

const multiplyLinesByBatches = (lines, batches, cycleTime) => {
  const array = [];
  const numBatches = batches.length;

  for (let i = 0; i < numBatches; i++) {
    lines.map((line) => {
      const { start, end } = line;
      const newStart = { x: start.x + i * cycleTime, y: start.y };
      const newEnd = { x: end.x + i * cycleTime, y: end.y };
      array.push({ start: newStart, end: newEnd });
    });
  }

  return array;
};

const convertLinesToPoints = (lines) => {
  const points = [];
  lines.map((line) => {
    const p0 = { x: line.start.x - 1, y: 0 };
    const p1 = line.start;
    const p2 = line.end;
    const p3 = { x: line.end.x + 1, y: 0 };

    points.push(p0, p1, p2, p3);
  });
  return points;
};

const addEndsToPoints = (points, endpoint) => {
  return [{ x: 0, y: 0 }, ...points, { x: endpoint, y: 0 }];
};

const createTotalsFromLines = (lines) => {
  //create array of x-values of interest from lines
  let xValues = [];
  lines.map((line) => {
    const xstart = line.start.x;
    const xend = line.end.x;
    xValues.push(xstart - 1, xstart, xend, xend + 1);
  });

  //remove duplicates
  const uniqueXvalues = [...new Set(xValues)];
  console.log("uniqueXvalues", uniqueXvalues);

  //sort array
  uniqueXvalues.sort(function (a, b) {
    return a - b;
  });

  //Loop through each unique x and sum the totals
  let totalsPoints = [];
  uniqueXvalues.map((x) => {
    let total = 0;
    lines.map((line) => {
      const { start, end } = line;
      if (start.x <= x && end.x >= x) {
        total = total + start.y;
      }
    });
    totalsPoints.push({ x, y: total });
  });

  console.log("totalsPoints", totalsPoints);
  return totalsPoints;
};

const calcAverage = (datasets) => {
  if (datasets.length < 1) return null;
  const dataArray = datasets[datasets.length - 1].data;
  let sum = 0;
  dataArray.map((value) => {
    sum = sum + value;
  });
  return sum / dataArray.length;
};

const calcMax = (datasets) => {
  if (datasets.length < 1) return null;
  const dataArray = datasets[datasets.length - 1].data;
  let max = -9999999;
  dataArray.map((value) => {
    if (value.y > max) max = value.y;
  });
  return max;
};

const createDataLabels = (xAxis) => {
  return xAxis.map((timepoint) => timepoint.label);
};

const addTotalsToDataset = (dataset) => {
  let totalArray = [];
  if (!dataset[0]) return totalArray;
  const rows = dataset.length;
  const columns = dataset[0].data.length;

  for (let i = 0; i < columns; i++) {
    let sum = 0;
    for (let j = 0; j < rows; j++) {
      sum = sum + dataset[j].data[i];
    }
    totalArray.push(sum);
  }
  return totalArray;
};

const addCriticalPointsToData = (
  data,
  operation,
  resourceAmount,
  cycleTime,
  numBatches,
  endPoint
) => {
  let newArr = [];

  data.map((point) => {
    if (point.type === "startPoint") {
      const startPoint = { x: point.x - 1, y: 0 };
      newArr.push(startPoint, point);
    }
  });

  if (operation.start !== 0) {
    data.push({ x: 0, y: 0, type: null });
  }

  for (let j = 0; j < numBatches; ++j) {
    const p0 = { x: operation.start - 1 + j * cycleTime, y: 0, type: null };
    const p1 = {
      x: operation.start + j * cycleTime,
      y: value,
      type: "startPoint",
    };
    const p2 = { x: operation.end + j * cycleTime, y: value, type: "endPoint" };
    const p3 = { x: operation.end + 1 + j * cycleTime, y: 0, type: null };
    data.push(p0, p1, p2, p3);
  }

  if (operation.end !== endPoint) {
    data.push({ x: endPoint + cycleTime * (numBatches - 1), y: 0, type: null });
  }
  return data;
};

const createIndividualChartPoints = (
  operation,
  resourceAmount,
  cycleTime,
  numBatches,
  endPoint
) => {
  //creates an array of x and y objects for an operation resource based on its process value, and operation start and end time.

  const value = Number(resourceAmount);
  let data = [];

  for (let j = 0; j < numBatches; ++j) {
    const p1 = {
      x: operation.start + j * cycleTime,
      y: value,
      type: "startPoint",
    };
    const p2 = { x: operation.end + j * cycleTime, y: value, type: "endPoint" };
    data.push(p1, p2);
  }
  return data;
};

const findObjectByTitle = (searchArray, title) => {
  return searchArray.find((item) => item.title === title);
};

export const createChartOptions = (resource) => {
  return {
    // responsive: true,
    parsing: false,
    // normalized: true,
    animation: true,
    // interaction: {
    //   mode: "nearest",
    //   axis: "x",
    //   intersect: false,
    // },
    scales: {
      x: {
        display: true,
        title: {
          display: false,
          text: "Time",
        },
        grid: {
          display: false,
          drawBorder: false,
          drawOnChartArea: false,
          drawTicks: false,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: resource.unit,
        },
        grid: {
          display: false,
          drawBorder: false,
          drawOnChartArea: false,
          drawTicks: false,
        },
      },
    },
    plugins: {
      decimation: {
        enabled: true,
        algorithm: "lttb",
        samples: 10,
      },
      legend: {
        display: false,
        position: "top",
      },
      title: {
        display: false,
        text: resource.title,
        color: resource.color,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";

            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += `${context.parsed.y} ${resource.unit}, time: ${context.parsed.x}`;
            }
            return label;
          },
          // footer: footer,
        },
      },
    },
  };
};

const footer = (tooltipItems) => {
  let sum = 0;

  tooltipItems.forEach(function (tooltipItem) {
    sum += tooltipItem.parsed.y;
  });
  return "Sum: " + sum;
};
