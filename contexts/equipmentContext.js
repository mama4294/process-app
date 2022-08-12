import { useState, createContext, useEffect } from "react";
import { toggleSelection, deleteByIds, deleteById } from "../utils/arrayLogic";
import { calcGanttLogic, calcEOCLogic } from "../utils/ganttLogic";
import { generateId } from "../utils/helperFunctions";

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
  selectionId: null,
  setSelectionId: () => null,
  findSelectedEquipment: () => null,
  addEquipment: () => null,
  findEquipmentDuration: () => null,
  getMinEquipmentTime: () => null,
  duplicate: () => null,
  drawer: null,
  setDrawer: () => null,
  openFormNew: () => null,
  openFormEdit: () => null,
  closeForm: () => null,
});

export const EquipmentProvider = ({ children }) => {
  const [equipment, setEquipment] = useState([]);
  const [EOerror, setOEError] = useState({
    error: false,
    ids: [],
    message: "",
  });
  const [userResources, setUserResources] = useState(defaultResources);
  const [selectionId, setSelectionId] = useState();
  const [drawer, setDrawer] = useState({ open: false, mode: "new" });

  //Equipment Form fuctions
  const openFormNew = () => setDrawer({ open: true, mode: "new" });
  const openFormEdit = (id) => {
    setSelectionId(id);
    setDrawer({ open: true, mode: "edit" });
  };
  const closeForm = () => setDrawer({ open: false, mode: "new" });

  //Local storage functions

  useEffect(() => {
    const getLocalEquipment = () => {
      const localdata = localStorage.getItem("equipment");
      return localdata ? JSON.parse(localdata) : defaultEquipmentData;
    };
    setEquipment(getLocalEquipment());
  }, []);

  const saveEquipment = () => {
    localStorage.setItem("equipment", JSON.stringify(equipment));
  };

  //Equipment state functions

  const deleteEquipment = (id) => {
    console.log("delete");
    setEquipment(deleteById(equipment, id));
    setSelectionId(null);
  };

  const addEquipment = (newEquipment) => {
    const updatedEquip = addIdToOperations([...equipment, newEquipment]);
    setEquipment(updatedEquip);
  };

  const addIdToOperations = (array) => {
    const newArray = array.map((equip) => {
      const newOps = equip.operations.map((op) => {
        return { ...op, parentId: equip.id };
      });
      return { ...equip, operations: newOps };
    });

    return newArray;
  };

  const getLongestEquipmentDuration = (equipment) => {
    if (equipment.length === 0) return { duration: 0 };
    // return Math.max(...equipment.map((obj) => obj.duration));
    let longestEquip = equipment.reduce((max, obj) =>
      max.duration > obj.duration ? max : obj
    );
    // console.log("Longest Equip", longestEquip);
    return longestEquip;
  };

  const calcCycleTime = () => {
    return getLongestEquipmentDuration(equipment);
  };

  const updateEquipment = (equipmentToUpdate) => {
    const newArr = equipment.map((obj) => {
      if (obj.id === equipmentToUpdate.id) {
        return equipmentToUpdate;
      }
      return obj;
    });
    const updatedEquip = addIdToOperations(newArr);
    setEquipment(updatedEquip);
  };

  const findSelectedEquipment = () => {
    const index = equipment.findIndex((item) => item.id === selectionId);
    return equipment[index];
  };

  const findEquipmentById = (id) => {
    const index = equipment.findIndex((item) => item.id === id);
    return equipment[index];
  };

  const findEquipmentIndexById = (id) => {
    const index = equipment.findIndex((item) => item.id === id);
    return index;
  };

  const findEquipmentDuration = (operations) => {
    const start = operations[0].start;
    const end = operations[operations.length - 1].end;
    const duration = end - start;
    return duration;
  };

  const solveGantt = (array) => {
    return calcGanttLogic(array, equipment);
  };

  const findById = (array, id) => {
    return array.find((item) => item.id === id);
  };

  const getMinEquipmentTime = () => {
    return Math.min(...equipment.map((obj) => obj.operations[0].start));
  };

  const solveEquipmentOccupancy = () => {
    const { error, array } = calcEOCLogic(equipment);

    if (error.error) {
      setOEError({ error: true, ids: error.ids, message: error.message });
    } else {
      setOEError({ error: false, ids: [], message: "" });
      const newArray = equipment.map((equip) => {
        const newOps = equip.operations.map((op) => {
          return findById(array, op.id);
        });
        return { ...equip, operations: newOps };
      });
      setEquipment(newArray);
    }
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

  const duplicate = (id) => {
    const copy = findEquipmentById(id);
    const updatedCopy = generateNewIds(copy);
    addEquipment({ ...updatedCopy, title: copy.title + "(Copy)" });
  };

  const generateNewIds = (equipment) => {
    const operations = equipment.operations;
    const newOperations = operations.map((op) => {
      return { ...op, id: generateId() };
    });
    const updatedEquip = {
      ...equipment,
      id: generateId(),
      operations: newOperations,
    };
    return updatedEquip;
  };

  const moveUp = (id) => {
    const index = findEquipmentIndexById(id);
    if (index === 0) return;
    let newArr = [...equipment];
    newArr.splice(index - 1, 0, newArr.splice(index, 1)[0]);
    setEquipment(newArr);
  };
  const moveDown = (id) => {
    const index = findEquipmentIndexById(id);
    if (index === equipment.length - 1) return;
    let newArr = [...equipment];
    newArr.splice(index + 1, 0, newArr.splice(index, 1)[0]);
    setEquipment(newArr);
  };

  return (
    <EquipmentContext.Provider
      value={{
        equipment,
        EOerror,
        setEquipment,
        userResources,
        setUserResources,
        selectionId,
        findSelectedEquipment,
        deleteEquipment,
        addEquipment,
        updateEquipment,
        findEquipmentById,
        findAllEquipmentOpOptions,
        solveGantt,
        solveEquipmentOccupancy,
        saveEquipment,
        moveUp,
        moveDown,
        duplicate,
        findEquipmentDuration,
        calcCycleTime,
        getMinEquipmentTime,
        drawer,
        openFormNew,
        openFormEdit,
        closeForm,
      }}
    >
      {children}
    </EquipmentContext.Provider>
  );
};
