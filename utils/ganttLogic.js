const convertToMinutes = (value, unit) => {
  if (unit.value === "min") return value;
  if (unit.value === "hr") return value * 60;
  if (unit.value === "day") return value * 60 * 24;
  return alert("Error with units");
};

const calcStartAndEnd = (procedure, startTime) => {
  const { duration, durationUnit, offset, offsetUnit } = procedure;
  const lagMin = convertToMinutes(offset, offsetUnit);
  const durationMin = convertToMinutes(duration, durationUnit);
  const start = startTime + lagMin;
  const end = startTime + durationMin + lagMin;
  const newProcedure = { ...procedure, start: start, end: end };
  return newProcedure;
};

export const calcGanttLogic = (array) => {
  let remainingArray = [...array];
  let finishedArray = [];
  let count = 0;
  while (remainingArray.length > 0 && count < 5) {
    remainingArray.map((procedure, index) => {
      const predecessorId = procedure.predecessor.value;
      const predecessorIndex = finishedArray.findIndex(
        (item) => item.id === predecessorId
      );
      console.log(
        `Beginning test for ${procedure.title}. Predessor ID: ${predecessorId}, Predessor Index: ${predecessorIndex}`
      );
      if (predecessorId === 0) {
        //initial
        console.log(`${procedure.title} is an Intial process`);
        const updatedProcedure = calcStartAndEnd(procedure, 0);
        finishedArray.push(updatedProcedure); //add to finished
        remainingArray.splice(index, 1); //remove from remaining
      } else if (predecessorIndex >= 0) {
        console.log(`Found a predessor for ${procedure.title}`);
        const endOfPrecedessor = remainingArray[index].end;
        const updatedProcedure = calcStartAndEnd(procedure, endOfPrecedessor);
        finishedArray.push(updatedProcedure); //add to finished
        remainingArray.splice(index, 1); //remove from remaining
      } else {
        console.log(`No luck for ${procedure.title}`);
      }
    });
    console.log(
      `Completed cycle: ${count} with ${remainingArray.length} / ${array.length} remaining`
    );
    console.log("Finished Array ", finishedArray);
    count++;
  }
};
