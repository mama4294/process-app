import { v4 as uuid } from "uuid";

export const generateId = () => {
  const unique_id = uuid();
  const small_id = unique_id.slice(0, 8);
  return small_id;
};

export const sortArrayByStart = (array) => {
  return array.sort((a, b) => a.start - b.start);
};

export const roundToTwo = (num) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

export const minToFreindlyTime = (min) => {
  if (min === 1) return `${roundToTwo(min)} minute`;
  if (min < 60) return `${roundToTwo(min)} minutes`;
  if (min < 60 * 24) return `${roundToTwo(min / 60)} hours`;
  if (min < 60 * 24 * 7) return `${roundToTwo(min / 60 / 24)} days`;
  if (min < 60 * 24 * 7 * 52) return `${roundToTwo(min / 60 / 24 / 7)} weeks`;
  return `${roundToTwo(min / 60 / 24 / 7 / 52)} years`;
};

export const exportToJsonFile = (jsonData) => {
  let dataStr = JSON.stringify(jsonData);
  let dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  let exportFileDefaultName = "data.json";

  let linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();
};
