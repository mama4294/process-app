import { useState, createContext, useEffect } from "react";
import { toggleSelection, deleteByIds, deleteById } from "../utils/arrayLogic";
import { calcGanttLogic, calcEOCLogic } from "../utils/ganttLogic";
import { generateId, exportToJsonFile } from "../utils/helperFunctions";

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

const defaultEquipmentData = [
  {
    id: "decd93e4",
    title: "Mixer",
    duration: 145,
    operations: [
      {
        duration: "15",
        durationUnit: { value: "min", label: "min" },
        end: 16,
        id: "971dc105",
        offset: 0,
        offsetUnit: { value: "hr", label: "hr" },
        parentId: "275d01f8",
        predecessor: { value: 0, label: "Initial" },
        resources: [],
        start: 1,
        title: "Load",
        type: { value: "SF", label: "Start-to-Finish" },
      },
      {
        duration: "1",
        durationUnit: { value: "hr", label: "hr" },
        end: 76,
        id: "86fc6543",
        offset: 0,
        offsetUnit: { value: "hr", label: "hr" },
        parentId: "275d01f8",
        predecessor: { value: "971dc105", label: "Load" },
        resources: [],
        start: 16,
        title: "Mix",
        type: { value: "SF", label: "Start-to-Finish" },
      },
      {
        duration: "10",
        durationUnit: { value: "min", label: "min" },
        end: 86,
        id: "da41da6e",
        offset: 0,
        offsetUnit: { value: "hr", label: "hr" },
        parentId: "275d01f8",
        predecessor: { value: "86fc6543", label: "Mix" },
        resources: [],
        start: 76,
        title: "Discharge",
        type: { value: "SF", label: "Start-to-Finish" },
      },
    ],
  },
  {
    title: "Former",
    duration: 330,
    id: "8865b56e",
    operations: [
      {
        duration: "30",
        durationUnit: { value: "min", label: "min" },
        end: 86,
        id: "eac61970",
        offset: 0,
        offsetUnit: { value: "hr", label: "hr" },
        parentId: "8865b56e",
        predecessor: { value: "445bee24", label: "Form" },
        resources: [],
        start: 56,
        title: "Form",
        type: { value: "FS", label: "Finish-to-Start" },
      },
      {
        duration: "5",
        durationUnit: { value: "hr", label: "hr" },
        end: 386,
        id: "445bee24",
        offset: 0,
        offsetUnit: { value: "hr", label: "hr" },
        parentId: "8865b56e",
        predecessor: {
          value: "da41da6e",
          label: "Mixer - Discharge",
          external: true,
        },
        resources: [],
        start: 86,
        title: "Form",
        type: { value: "SF", label: "Start-to-Finish" },
      },
    ],
  },
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
      return localdata ? JSON.parse(localdata) : [];
    };
    setEquipment(getLocalEquipment());
  }, []);

  const saveEquipment = (data) => {
    localStorage.setItem("equipment", JSON.stringify(data));
    // exportToJsonFile(equipment);
  };

  const resetEquipment = () => {
    setEquipment([]);
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

  const getMaxEndpoint = () => {
    if (equipment.length === 0) return 0;
    const operations = equipment.flatMap((eq) => eq.operations);
    let lastOperation = operations.reduce((max, obj) =>
      max.duration > obj.end ? max : obj
    );
    return lastOperation.end;
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
    const duration = Number(end - start);
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
          duration: operation.duration,
          durationUnit: operation.durationUnit,
          external: true,
        });
      });
    });
    return newArray;
  };

  const duplicate = (id) => {
    const copy = findEquipmentById(id);
    const copyWithNewIds = generateNewIds(copy);
    const finalizedCopy = alignPredecessorIds(copyWithNewIds);
    addEquipment({ ...finalizedCopy, title: copy.title + " (Copy)" });
  };

  const generateNewIds = (equipment) => {
    const newId = generateId();
    const operations = equipment.operations;
    const newOperations = operations.map((op) => {
      return {
        ...op,
        parentId: newId,
        id: generateId(),
        ancestorId: op.id,
      };
    });
    const updatedEquip = {
      ...equipment,
      id: newId,
      operations: newOperations,
    };
    return updatedEquip;
  };

  const alignPredecessorIds = (equipment) => {
    //For each operation with internal references, change the reference id to the duplicatedId
    const operations = equipment.operations;
    console.log("OPerations", operations);
    const newOperations = operations.map((op) => {
      if (op.predecessor.value === 0) {
        return op;
      }
      if (!op.predecessor.external) {
        console.log(
          "Looking for an op with this value: ",
          op.predecessor.value
        );
        const referenceOp = operations.find(
          (item) => item.ancestorId === op.predecessor.value
        );
        console.log("referenceOp", referenceOp);
        const newPredId = referenceOp.id;

        return {
          ...op,
          predecessor: {
            ...op.predecessor,
            value: newPredId,
          },
        };
      } else {
        return op;
      }
    });
    const updatedEquip = {
      ...equipment,
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
        getMaxEndpoint,
        resetEquipment,
      }}
    >
      {children}
    </EquipmentContext.Provider>
  );
};
