import { LocalConvenienceStoreOutlined } from "@mui/icons-material";
import { convertToMinutes } from "./ganttLogic";

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
  //Old method
  // let step = 15;
  // let timeUnit = "min";
  // let timeValue = 1;
  // console.log("length", length);

  // if (length > 60 * 24 * 6) {
  //   step = 60 * 3;
  //   timeUnit = "day";
  //   timeValue = 60 * 24;
  // } else if (length > 60 * 10) {
  //   step = 60;
  //   timeUnit = "hr";
  //   timeValue = 60;
  // } else if (length > 60 * 2) {
  //   step = 10;
  //   timeUnit = "min";
  // }

  // const xAxis = [];
  // let i = 0;
  // while (i < length) {
  //   xAxis.push({ value: i, label: `${i / timeValue} ${timeUnit}` });
  //   i = i + step;
  // }
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

  console.log(resourceTitle);
  console.log("average: ", average);
  console.log("dataset", datasets);

  return {
    labels: labels,
    datasets: datasets,
    max: max,
    average: average,
  };
};

const calcAverage = (datasets) => {
  if (datasets.length < 1) return null;
  const dataArray = datasets[datasets.length - 1].data;
  console.log("dataArray", dataArray);
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
    if (value > max) max = value;
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
  console.log("Columsn", columns);

  for (let i = 0; i < columns; i++) {
    let sum = 0;
    for (let j = 0; j < rows; j++) {
      sum = sum + dataset[j].data[i];
    }
    totalArray.push(sum);
  }
  return totalArray;
};

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
  const numBatches = batches.length;

  operations.map((operation) => {
    const resource = findObjectByTitle(operation.resources, resourceTitle);
    const parentEquipment = findEquipmentById(operation.parentId);

    dataset.push({
      label: `${parentEquipment.title} - ${operation.title}`,
      data: createResourceXYvalues(
        operation,
        resource.amount,
        cycleTime,
        numBatches,
        endPoint
      ),
      unit: resource.unit,
      borderColor: "gray",
      pointRadius: 1,
      borderWidth: 1,
      fill: true,
      showLine: true,
    });
  });

  // if (operations.length > 1) {
  //   //add total row
  //   dataset.push({
  //     label: "Sum",
  //     data: addTotalsToDataset(dataset),
  //     unit: "Total",
  //     borderColor: "#EB144C",
  //     borderDash: [1, 1],
  //     borderWidth: 1,
  //     pointRadius: 0,
  //   });
  // }
  console.log("Dataset", dataset);
  return dataset;
};

const createDummyData = () => {
  const duration = 1000;
  let data = new Array(duration);
  for (let i = 0; i < duration; ++i) data[i] = { x: i, y: 69 };
  return data;
};

const createResourceTimeline = (
  operation,
  xAxis,
  resourceAmount,
  offsetTime,
  cycleTime,
  numBatches
) => {
  //create empty array of 0's for each minute
  const totalCampaignDuration = cycleTime * numBatches + offsetTime;
  let data = new Array(totalCampaignDuration);
  for (let i = 0; i < totalCampaignDuration; ++i) data[i] = 0;

  //create array of process values
  const duration = convertToMinutes(operation.duration, operation.durationUnit);
  let processArray = new Array(duration);
  for (let i = 0; i < duration; ++i) processArray[i] = Number(resourceAmount);

  //Combine arrays
  for (let i = 0; i < numBatches; ++i) {
    data.splice(operation.start + i * cycleTime, duration, ...processArray);
  }

  console.log("Old Method");
  console.log("data", data);
  return data;
};

const createResourceXYvalues = (
  operation,
  resourceAmount,
  cycleTime,
  numBatches,
  endPoint
) => {
  //creates an array of x and y objects for an operation resource based on its process value, and operation start and end time.

  const value = Number(resourceAmount);
  let data = [];

  if (operation.start !== 0) {
    data.push({ x: 0, y: 0 });
  }
  for (let j = 0; j < numBatches; ++j) {
    const p0 = { x: operation.start - 1 + j * cycleTime, y: 0 };
    const p1 = { x: operation.start + j * cycleTime, y: value };
    const p2 = { x: operation.end + j * cycleTime, y: value };
    const p3 = { x: operation.end + 1 + j * cycleTime, y: 0 };
    console.log("Last Point:", p3);
    data.push(p0, p1, p2, p3);
  }

  if (operation.end !== endPoint) {
    data.push({ x: endPoint + cycleTime * (numBatches - 1), y: 0 });
  }
  console.log("New Method");
  console.log("data", data);
  return data;
};

const createResourceTimelineObjs = (
  operation,
  xAxis,
  resourceAmount,
  offsetTime,
  cycleTime,
  numBatches
) => {
  //create empty array of 0's for each minute
  const totalCampaignDuration = cycleTime * numBatches + offsetTime;
  const duration = convertToMinutes(operation.duration, operation.durationUnit);
  const value = Number(resourceAmount);
  let data = new Array(totalCampaignDuration);
  for (let j = 0; j < numBatches; ++j) {
    for (let i = 1; i < totalCampaignDuration + 1; ++i) {
      if (
        i >= operation.start + j * cycleTime &&
        i < operation.end + j * cycleTime
      ) {
        data[i] = { x: i, y: value };
      } else {
        data[i] = { x: i, y: 0 };
      }
    }
  }
  console.log("New Method");
  console.log("data", data);
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
