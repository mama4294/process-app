import { useState, createContext, useEffect } from "react";
import { generateId } from "../utils/helperFunctions";
import { addToArray, deleteByIds } from "../utils/arrayLogic";

export const ResourceContext = createContext({
  resourceOptions: null,
  setResourceOptions: () => null,
  handleAdd: () => null,
  handleEdit: () => null,
  handleDelete: () => null,
  saveDefaultReources: () => null,
});

export const ResourceProvider = ({ children }) => {
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
  const [resourceOptions, setResourceOptions] = useState([]);

  const emptyResource = {
    title: "",
    id: generateId(),
    color: getRandomColor(),
    unit: "kg/hr",
  };

  const defaultResouces = [
    {
      title: "Water",
      id: generateId(),
      color: "#8ED1FC",
      unit: "lpm",
    },
    {
      title: "Steam",
      id: generateId(),
      color: "#EB144C",
      unit: "kg/hr",
    },
    {
      title: "Electricity",
      id: generateId(),
      color: "#FCB900",
      unit: "kW",
    },
  ];

  useEffect(() => {
    const getLocalData = () => {
      const localdata = localStorage.getItem("resourceOptions");
      return localdata ? JSON.parse(localdata) : defaultResouces;
    };
    setResourceOptions(getLocalData());
  }, []);

  useEffect(() => {
    console.log("resourceOptions", resourceOptions);
  }, [resourceOptions]);

  const saveResources = () => {
    localStorage.setItem("resourceOptions", JSON.stringify(resourceOptions));
  };

  const handleAdd = () => {
    if (resourceOptions.length < 10) {
      setResourceOptions(addToArray(resourceOptions, emptyResource));
    }
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

    const newState = resourceOptions.map((batch) => {
      if (batch.id === batchId) {
        // console.log(`Found operation with field ${field} and value ${value}`);
        return { ...batch, [id]: value };
      }
      //otherwise return object as is
      return batch;
    });
    setResourceOptions(newState);
  };

  const handleDelete = (id) => {
    if (resourceOptions.length > 1) {
      setResourceOptions(deleteByIds(resourceOptions, [{ id: id }]));
    }
  };

  useEffect(() => {
    console.log("resources", resourceOptions);
  }, [resourceOptions]);

  return (
    <ResourceContext.Provider
      value={{
        resourceOptions,
        handleAdd,
        handleEdit,
        handleDelete,
        saveResources,
      }}
    >
      {children}
    </ResourceContext.Provider>
  );
};
