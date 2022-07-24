import { useState, createContext } from "react";

const defaultResources = {
  steam: {
    name: "Steam",
    defaultUnit: "kg/hr",
    type: "Mass flow rate",
  },
  water: {
    name: "Water",
    defaultUnit: "lpm",
    type: "Volumetric flow rate",
  },
  CIP: {
    name: "CIP",
    defaultUnit: "lpm",
    type: "Volumetric flow rate",
  },
};

const operationData = [
  {
    id: "1",
    start: 1,
    end: 2,
    bgColor: "#E5B8D0",
  },
  {
    id: "2",
    start: 3,
    end: 4,
    bgColor: "#A0C8C2",
  },
  {
    id: "3",
    start: 5,
    end: 6,
    bgColor: "#rgb(178,201,151)",
  },
  {
    id: "4",
    start: 6,
    end: 9,
    bgColor: "#F5CF6B",
  },
  {
    id: "5",
    start: 10,
    end: 15,
    bgColor: "blue",
  },
  {
    id: "6",
    start: 16,
    end: 150,
    bgColor: "gray",
  },
];

const defaultEquipmentData = [
  { id: 1, name: "Fermenter", operations: operationData },
  { id: 2, name: "Filler", operations: operationData },
  { id: 3, name: "Chiller", operations: operationData },
];

export const EquipmentContext = createContext({
  equipment: null,
  setEquipment: () => null,
  defaultResuserResourcesources: null,
  setUserResources: () => null,
  selectionIds: null,
  setSelectionIds: () => null,
});

export const EquipmentProvider = ({ children }) => {
  const [equipment, setEquipment] = useState(defaultEquipmentData);
  const [userResources, setUserResources] = useState(defaultResources);
  const [selectionIds, setSelectionIds] = useState([{ id: 2 }, { id: 3 }]);

  //Selection state functions

  const handleAdd = (array, newItem) => {
    return [...array, newItem];
  };

  const handleRemove = (array, itemToRemove) => {
    return array.filter((x) => x.id !== itemToRemove.id);
  };

  const toggleSelection = (id) => {
    if (isNaN(id)) return;
    const index = selectionIds.findIndex((item) => item.id === id);
    if (index > -1) {
      //remove selection
      setSelectionIds(handleRemove(selectionIds, selectionIds[index]));
    } else {
      //add selection
      const newSelection = { id: id };
      setSelectionIds(handleAdd(selectionIds, newSelection));
    }
  };

  //Equipment state functions

  const deleteEquipment = () => {
    console.log("Equipment", equipment);
    console.log("IDs", selectionIds);
    let remainingEquipment = equipment;
    selectionIds.map((selection) => {
      remainingEquipment = handleRemove(remainingEquipment, selection);
    });
    setEquipment(remainingEquipment);
    setSelectionIds([]);
  };

  return (
    <EquipmentContext.Provider
      value={{
        equipment,
        setEquipment,
        userResources,
        setUserResources,
        selectionIds,
        toggleSelection,
        deleteEquipment,
      }}
    >
      {children}
    </EquipmentContext.Provider>
  );
};
