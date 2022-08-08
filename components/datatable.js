import React, { useCallback } from "react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import TextInput from "./inputs/textInput";

import styles from "../styles/operations.module.css";
import stylesCampaign from "../styles/campaign.module.css";

const DataTable = ({
  data,
  headers,
  handleEdit,
  selection,
  handleToggle,
  handleToggleAll,
  handleAdd,
  handleDelete,
}) => {
  return (
    <>
      <TableHeader
        data={data}
        headers={headers}
        handleToggleAll={handleToggleAll}
        selection={selection}
        handleAdd={handleAdd}
        handleDelete={handleDelete}
      />
      {data.length > 0 &&
        data.map((object, index) => {
          return (
            <TableRow
              key={object.id}
              index={index}
              object={object}
              selection={selection}
              handleEdit={handleEdit}
              handleToggle={handleToggle}
            />
          );
        })}

      {data.length > 0 && (
        <Button variant="outline" onClick={handleAdd} sx={{ mt: 2 }}>
          Add
        </Button>
      )}
    </>
  );
};

const TableHeader = ({
  data,
  headers,
  handleToggleAll,
  selection,
  handleAdd,
  handleDelete,
}) => {
  const handleChange = (event) => {
    handleToggleAll(event.target.checked);
  };
  const label = { inputProps: { "aria-label": "selection" } };
  return (
    <>
      <div className={styles.titleContainer}>
        <div className={styles.title}>Batches</div>

        {selection.length > 0 ? (
          <IconButton onClick={handleDelete}>
            <DeleteIcon color="action" />
          </IconButton>
        ) : (
          <IconButton onClick={handleAdd}>
            <AddIcon color="action" />
          </IconButton>
        )}
      </div>
      {data.length > 0 && (
        <div className={`${stylesCampaign.chartRow} ${styles.headerRow}`}>
          <div>
            <Checkbox {...label} onChange={handleChange} />
          </div>
          {headers.map((header, index) => {
            return (
              <div className={styles.tableHeaderValue} key={index}>
                {header}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

const TableRow = ({ object, handleEdit, selection, handleToggle, index }) => {
  const { title, id, color } = object;

  const checked = selection.some((item) => item.id === id);

  const handleChange = () => {
    handleToggle(id);
  };
  const label = { inputProps: { "aria-label": "selection" } };
  const style = {
    color: "#red",
    gridColumn: `2/4`,
    backgroundColor: "#red",
  };

  //For autofocusing on the next row title input
  const nameInput = useCallback((inputElement) => {
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  return (
    <div className={`${stylesCampaign.chartRow}`}>
      <Checkbox {...label} checked={checked} onChange={handleChange} />
      <div className={styles.chartRowLabel}>
        <TextInput
          id="id"
          value={index + 1}
          disabled
          type="text"
          placeholder="Name"
          onChange={handleEdit(id)}
        />
      </div>
      <div className={styles.chartRowLabel}>
        <TextInput
          id="title"
          value={title}
          type="text"
          placeholder="Name"
          onChange={handleEdit(id)}
          ref={nameInput}
        />
      </div>
      <div className={styles.chartRowLabel}>
        <TextInput
          id="color"
          value={color}
          type="text"
          placeholder="Color"
          onChange={handleEdit(id)}
        />
      </div>
    </div>
  );
};

export default DataTable;
