const handleAdd = (array, newItem) => {
  return [...array, newItem];
};

const handleRemove = (array, itemToRemove) => {
  return array.filter((x) => x.id !== itemToRemove.id);
};

export const toggleSelection = (array, id) => {
  if (isNaN(id)) return array;
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
  console.log("Array", array);
  console.log("IDs", ids);
  let newArray = array;
  ids.map((selection) => {
    newArray = handleRemove(newArray, selection);
  });
  return newArray;
};
