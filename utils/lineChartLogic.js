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
  let step = 15;
  let timeUnit = "min";
  let timeValue = 1;

  if (length > 60 * 24 * 6) {
    step = 60 * 3;
    timeUnit = "day";
    timeValue = 60 * 24;
  } else if (length > 60 * 4) {
    step = 60;
    timeUnit = "hr";
    timeValue = 60;
  } else if (length > 60 * 2) {
    step = 30;
    timeUnit = "min";
  }

  const xAxis = [];
  let i = 0;
  while (i < length) {
    xAxis.push({ value: i, label: `${i / timeValue} ${timeUnit}` });
    i = i + step;
  }
  return xAxis;
};

export const createChartData = (
  xAxis,
  operations,
  resourceTitle,
  offsetTime
) => {
  return {
    labels: createDataLabels(xAxis),
    datasets: createDatasets(xAxis, operations, resourceTitle, offsetTime),
  };
};

const createDataLabels = (xAxis) => {
  return xAxis.map((timepoint) => timepoint.label);
};

const calculateTotals = (dataset) => {
  let totalArray = [];
  if (!dataset[0]) return totalArray;
  console.log("dataset", dataset);
  const length = dataset[0].data.length;
  let i = 0;
  while (i < length) {
    const subtotal = dataset.reduce((acc, set) => acc + set.data[i]);
    totalArray.push(subtotal);
    i++;
  }
  console.log("totalArray", totalArray);
};

const createDatasets = (xAxis, operations, resourceTitle, offsetTime) => {
  let dataset = [];
  operations.map((operation) => {
    const resource = findObjectByTitle(operation.resources, resourceTitle);
    dataset.push({
      label: operation.title,
      data: createResourceTimeline(
        operation,
        xAxis,
        resource.amount,
        offsetTime
      ),
      unit: resource.unit,
    });
  });
  console.log("calculateTotals", calculateTotals(dataset));
  return dataset;
};

const createResourceTimeline = (
  operation,
  xAxis,
  resourceAmount,
  offsetTime
) => {
  let data = [];
  xAxis.map((timepoint) => {
    let amount = 0;
    if (
      timepoint.value > operation.start + offsetTime &&
      timepoint.value < operation.end + offsetTime
    ) {
      amount = Number(resourceAmount);
    }
    data.push(amount);
  });
  return data;
};

const findObjectByTitle = (searchArray, title) => {
  return searchArray.find((item) => item.title === title);
};

export const createChartOptions = (resource) => {
  return {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      title: {
        display: true,
        text: resource.title,
        color: resource.color,
      },
    },
  };
};
