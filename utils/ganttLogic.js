import { sortArrayByStart } from "../utils/helperFunctions";

const convertToMinutes = (value, unit) => {
  if (unit.value === "min") return value;
  if (unit.value === "hr") return value * 60;
  if (unit.value === "day") return value * 60 * 24;
  return alert("Error with units");
};

const handleRemove = (array, itemToRemove) => {
  return array.filter((x) => x.id !== itemToRemove.id);
};

const calcStartAndEnd = (operation, predecessor) => {
  console.log("Pred", predecessor);
  const { duration, durationUnit, offset, offsetUnit, type } = operation;
  const offsetMin = convertToMinutes(offset, offsetUnit);
  const durationMin = convertToMinutes(duration, durationUnit);

  let [startMin, endMin] = [0, 0];

  if (type.value === "SF") {
    //Start of new is end of old
    startMin = predecessor.end;
    endMin = startMin + durationMin;
  } else if (type.value === "SS") {
    startMin = predecessor.start;
    endMin = startMin + durationMin;
  } else if (type.value === "FF") {
    endMin = predecessor.end;
    startMin = endMin - durationMin;
  } else if (type.value === "FS") {
    endMin = predecessor.start;
    startMin = endMin - durationMin;
  } else if (type.value === "LINK") {
    startMin = predecessor.start;
    endMin = predecessor.end;
  }

  //add lag
  const start = startMin + offsetMin;
  const end = endMin + offsetMin;

  //   console.log(
  //     `${title}--- predStart: ${predecessor.start}, predEnd: ${predecessor.end}, duration: ${durationMin}, offset: ${offsetMin}, startMin: ${startMin}, endMin: ${endMin}`
  //   );

  const newOperation = { ...operation, start, end };
  return newOperation;
};

const addColor = (operation, color) => {
  return { ...operation, bgColor: color };
};

const findIndexById = (searchArray, id) => {
  return searchArray.findIndex((item) => item.id === id);
};

const findObjectById = (searchArray, id) => {
  return searchArray.find((item) => item.id === id);
};

const findPredecessor = (
  operation,
  predecessorId,
  externalMap,
  internalMap
) => {
  if (predecessorId == 0) {
    //Inital Operation
    return { start: 1, end: 1 };
  }

  if (operation.predecessor.external) {
    //external predecessor
    return findObjectById(externalMap, predecessorId);
  }

  if (!operation.predecessor.external) {
    //external predecessor
    return findObjectById(internalMap, predecessorId);
  }

  console.log("Couldnt match a pred");
  return undefined;
};

export const calcGanttLogic = (array, equipment) => {
  let loopArray = [...array];
  let remainingArray = [...array];
  let finishedArray = [];
  const externalMap = equipment.flatMap((eq) => eq.operations);
  let count = 1;
  while (remainingArray.length > 0 && count < remainingArray.length + 2) {
    loopArray.map((operation, index) => {
      console.log("remaining array:", remainingArray);
      console.log("finished array:", finishedArray);
      const predecessorId = operation.predecessor.value;
      const predecessorObj = findPredecessor(
        operation,
        predecessorId,
        externalMap,
        finishedArray
      );

      console.log("Predecessor....", predecessorObj);

      console.log(
        `Round: ${count}, Test: ${index}... Test for ${operation.title}. Predessor ID: ${predecessorId}`
      );

      if (predecessorObj !== undefined) {
        //found predecessor
        const updatedOperation = calcStartAndEnd(operation, predecessorObj);
        const coloredOperation = addColor(updatedOperation, "#A9C0E4");
        finishedArray.push(coloredOperation); //add to finished
        remainingArray = handleRemove(remainingArray, operation); //remove from remaining
        console.log(`Found a home for ${operation.title}`);
      } else {
        //predessor not found yet
        console.log(`No predecessors yet for ${operation.title}`);
      }
    });
    console.log(
      `Completed cycle: ${count} with ${remainingArray.length} / ${array.length} remaining`
    );
    loopArray = [...remainingArray];
    count++;
  }

  const error = remainingArray.length !== 0 || finishedArray.length === 0;
  const initialIndex = array.findIndex((item) => item.predecessor.value === 0);
  const message =
    initialIndex >= 0
      ? "Recursive Error: Could not find a solution"
      : "Error: No inital operation";

  console.log(message);
  console.log("Finished Array ", finishedArray);
  return {
    error: {
      error: error,
      message: message,
      ids: remainingArray.map((a) => a.id), //Array of ids
    },
    array: sortArrayByStart(finishedArray),
  };
};
