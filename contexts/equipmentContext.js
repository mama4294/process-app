import { useState, createContext } from "react";
import { toggleSelection, deleteByIds } from "../utils/checkboxes";
import { calcGanttLogic } from "../utils/ganttLogic";

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

const sterilizerOperations = [
  {
    id: "asldfkj",
    title: "CIP",
    start: 1,
    end: 61,
    bgColor: "#E5B8D0",
  },
  {
    id: "2nmgd",
    title: "SIP",
    start: 62,
    end: 153,
    bgColor: "#E5B8D0",
  },
  {
    id: "kwklj",
    title: "Cool",
    start: 154,
    end: 184,
    bgColor: "#E5B8D0",
  },
  {
    id: "aanmse",
    title: "Fill",
    start: 184,
    end: 250,
    bgColor: "#E5B8D0",
  },
];

const fermenterOperations = [
  {
    id: "lkajsd",
    title: "CIP",
    start: 1,
    end: 31,
    bgColor: "#E5B8D0",
  },
  {
    id: "plkapsdlf",
    title: "SIP",
    start: 45,
    end: 165,
    bgColor: "#E5B8D0",
  },
  {
    id: "pasldkf",
    title: "Cool",
    start: 166,
    end: 183,
    bgColor: "#E5B8D0",
  },
  {
    id: "paksjdd",
    title: "Fill",
    start: 184,
    end: 250,
    bgColor: "#E5B8D0",
  },
  {
    id: "asdfnmddd",
    title: "Ferment",
    start: 251,
    end: 800,
    bgColor: "#E5B8D0",
  },
];

const decanterOperations = [
  {
    id: "lkjsldfj",
    title: "CIP",
    start: 740,
    end: 800,
    bgColor: "#E5B8D0",
  },
  {
    id: "lkasdfjjj",
    title: "Process",
    start: 801,
    end: 900,
    bgColor: "#E5B8D0",
  },
];

const defaultEquipmentData = [
  { id: 1, title: "Sterilizer", operations: sterilizerOperations },
  { id: 2, title: "Fermenter", operations: fermenterOperations },
  { id: 3, title: "Decanter", operations: decanterOperations },
];

export const EquipmentContext = createContext({
  equipment: null,
  setEquipment: () => null,
  defaultResuserResourcesources: null,
  setUserResources: () => null,
  selectionIds: null,
  setSelectionIds: () => null,
  addEquipment: () => null,
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

  const addEquipment = (newEquipment) => {
    setEquipment([...equipment, newEquipment]);
  };

  const updateEquipment = (equipmentToUpdate) => {
    const newArr = equipment.map((obj) => {
      if (obj.id === equipmentToUpdate.id) {
        return equipmentToUpdate;
      }
      return obj;
    });
    setEquipment(newArr);
  };

  const findSelectedEquipment = () => {
    const index = equipment.findIndex((item) => item.id === selectionIds[0].id);
    return equipment[index];
  };

  const findEquipmentById = (id) => {
    const index = equipment.findIndex((item) => item.id === id);
    return equipment[index];
  };

  const solveGantt = (array) => {
    return calcGanttLogic(array, equipment);
  };

  const findAllEquipmentOpOptions = () => {
    let newArray = [];
    equipment.map((equip) => {
      equip.operations.map((operation) => {
        newArray.push({
          label: `${equip.title} - ${operation.title}`,
          value: operation.id,
          external: true,
        });
      });
    });
    return newArray;
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
        addEquipment,
        updateEquipment,
        findSelectedEquipment,
        findEquipmentById,
        findAllEquipmentOpOptions,
        solveGantt,
      }}
    >
      {children}
    </EquipmentContext.Provider>
  );
};
