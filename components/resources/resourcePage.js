import React, { useContext } from "react";
import { EquipmentContext } from "../../contexts/equipmentContext";

const ResourcePage = () => {
  const { equipment } = useContext(EquipmentContext);
  const operations = equipment.flatMap((eq) => eq.operations);

  const filterOperationsByResource = (operations, resource) => {
    let newArray = [];
    operations.map((op) => {
      if (op.resources.some((r) => r.title === resource)) {
        newArray.push({ ...op });
      }
    });
    return newArray;
  };

  const steamOperations = filterOperationsByResource(operations, "Steam");
  console.log("steamOperations", steamOperations);

  return <h1>Resources</h1>;
};

export default ResourcePage;
