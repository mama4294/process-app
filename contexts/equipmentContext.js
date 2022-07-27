import { useState, createContext } from "react";
import { toggleSelection, deleteByIds } from "../utils/checkboxes";

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
    title: "Fill",
    start: 1,
    end: 2,
    bgColor: "#E5B8D0",
  },
  {
    id: "2",
    title: "Heat",
    start: 3,
    end: 4,
    bgColor: "#A0C8C2",
  },
  {
    id: "3",
    title: "Cool",
    start: 5,
    end: 6,
    bgColor: "#rgb(178,201,151)",
  },
  {
    id: "4",
    title: "Ferment",
    start: 6,
    end: 9,
    bgColor: "#F5CF6B",
  },
  {
    id: "5",
    title: "Heat Treat",
    start: 10,
    end: 15,
    bgColor: "blue",
  },
  {
    id: "6",
    title: "Transfer",
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
  const [selectionIds, setSelectionIds] = useState([]);

  //Selection state functions

  const handleToggle = (id) => {
    setSelectionIds(toggleSelection(selectionIds, id));
  };

  //Equipment state functions

  const deleteEquipment = () => {
    setEquipment(deleteByIds(equipment, selectionIds));
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
        handleToggle,
        deleteEquipment,
      }}
    >
      {children}
    </EquipmentContext.Provider>
  );
};
