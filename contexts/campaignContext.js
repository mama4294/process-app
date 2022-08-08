import { useState, createContext, useEffect } from "react";
import { generateId } from "../utils/helperFunctions";
import {
  addToArray,
  toggleSelection,
  toggleAll,
  deleteByIds,
} from "../utils/arrayLogic";

export const CampaignContext = createContext({
  batches: null,
  setBatches: () => null,
  selection: null,
  setSelection: () => null,
  defaultBatch: null,
  handleAdd: () => null,
  handleToggle: () => null,
  handleEdit: () => null,
  handleToggleAll: () => null,
  handleDelete: () => null,
  saveBatches: () => null,
});

export const CampaignProvider = ({ children }) => {
  const getRandomColor = () => {
    const colors = [
      "#FF6900",
      "#FCB900",
      "#7BDCB5",
      "#00D084",
      "#8ED1FC",
      "#0693E3",
      "#ABB8C3",
      "#EB144C",
      "#F78DA7",
      "#9900EF",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  const [batches, setBatches] = useState([]);
  const [selection, setSelection] = useState([]);
  const defaultBatch = { id: generateId(), color: getRandomColor() };

  useEffect(() => {
    const getLocalData = () => {
      const localdata = localStorage.getItem("batches");
      return localdata
        ? JSON.parse(localdata)
        : [{ id: 1, color: getRandomColor() }];
    };
    setBatches(getLocalData());
  }, []);

  const saveBatches = () => {
    localStorage.setItem("batches", JSON.stringify(batches));
  };

  const handleAdd = () => {
    setBatches(addToArray(batches, defaultBatch));
  };

  const handleToggle = (id) => {
    setSelection(toggleSelection(selection, id));
  };

  const handleToggleAll = (checked) => {
    setSelection(toggleAll(selection, checked));
  };

  const handleEdit = (event, batchId) => {
    console.log("edit", batchId);
    let id = null;
    let value = null;

    if (event.target !== undefined) {
      id = event.target.id;
      value = event.target.value;
    } else if (event.hex !== undefined) {
      id = "color";
      value = event.hex;
    } else {
      throw new Error("Invalid event");
    }

    const newState = batches.map((batch) => {
      if (batch.id === batchId) {
        // console.log(`Found operation with field ${field} and value ${value}`);
        return { ...batch, [id]: value };
      }
      //otherwise return object as is
      return batch;
    });
    setBatches(newState);
  };

  const handleDelete = () => {
    setBatches(deleteByIds(batches, selection));
    setSelection([]);
  };

  useEffect(() => {
    console.log(batches);
  }, [batches]);

  return (
    <CampaignContext.Provider
      value={{
        batches,
        setBatches,
        selection,
        setSelection,
        defaultBatch,
        handleAdd,
        handleToggle,
        handleEdit,
        handleToggleAll,
        handleDelete,
        saveBatches,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};
