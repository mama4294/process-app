import { useState, createContext } from "react";
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
});

export const CampaignProvider = ({ children }) => {
  const [batches, setBatches] = useState([
    { id: 1, title: "Batch 1", color: "red" },
    { id: 2, title: "Batch 2", color: "blue" },
  ]);
  const [selection, setSelection] = useState([]);

  const defaultBatch = { id: generateId(), title: "", color: "blue" };

  const handleAdd = () => {
    setBatches(addToArray(batches, defaultBatch));
  };

  const handleToggle = (id) => {
    setSelection(toggleSelection(selection, id));
  };

  const handleToggleAll = (checked) => {
    setSelection(toggleAll(selection, checked));
  };

  const handleEdit = (batchId) => (event) => {
    console.log("edit", batchId);

    const { id, value } = event.target;

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
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};
