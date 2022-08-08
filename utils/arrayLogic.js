const handleAdd = (array, newItem) => {
  return [...array, newItem];
};

const handleRemove = (array, itemToRemove) => {
  return array.filter((x) => x.id !== itemToRemove.id);
};

export const toggleSelection = (array, id) => {
  const index = array.findIndex((item) => item.id === id);
  if (index > -1) {
    //remove selection
    return handleRemove(array, array[index]);
  } else {
    //add selection
    const newSelection = { id: id };
    return handleAdd(array, newSelection);
  }
};

export const toggleAll = (array, checked) => {
  let newArray = [];
  if (checked) {
    //select all
    array.map((item) => {
      newArray.push({ id: item.id });
    });
  }
  return newArray;
};

export const addToArray = (array, item) => {
  return [...array, item];
};

export const deleteByIds = (array, ids) => {
  if (!Array.isArray(ids)) throw new Error("id array is not an array");
  let newArray = array;
  ids.map((selection) => {
    newArray = handleRemove(newArray, selection);
  });
  return newArray;
};

export const getArrayOptions = (array, id) => {
  let newArray = [];
  array.map((item) => {
    if (item.id !== id) {
      newArray.push({ label: item.title, value: item.id, external: false });
    }
  });
  return newArray;
};
