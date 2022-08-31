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
  batches
) => {
  const labels = createDataLabels(xAxis);
  const datasets = createDatasets(
    xAxis,
    operations,
    resourceTitle,
    offsetTime,
    cycleTime,
    batches
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
  batches
) => {
  let dataset = [];
  const numBatches = batches.length;
  operations.map((operation) => {
    const resource = findObjectByTitle(operation.resources, resourceTitle);
    console.log("");
    console.log("-------resourceTitle-------", resourceTitle);
    dataset.push({
      label: operation.title,
      data: createResourceTimeline(
        operation,
        xAxis,
        resource.amount,
        offsetTime,
        cycleTime,
        numBatches
      ),
      unit: resource.unit,
    });
  });

  if (operations.length > 1) {
    //add total row
    dataset.push({
      label: "Total",
      data: addTotalsToDataset(dataset),
      unit: "Total",
    });
  }
  console.log("Dataset", dataset);
  return dataset;
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
    data.splice(
      operation.start + i * cycleTime,
      operation.duration,
      ...processArray
    );
  }

  return data;
};

const findObjectByTitle = (searchArray, title) => {
  return searchArray.find((item) => item.title === title);
};

export const createChartOptions = (resource) => {
  return {
    responsive: true,
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
      legend: {
        display: false,
        position: "top",
      },
      title: {
        display: false,
        text: resource.title,
        color: resource.color,
      },
    },
  };
};
