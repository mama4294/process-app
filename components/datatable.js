import React, { useState, useCallback } from "react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import TextInput from "./inputs/textInput";
import { TwitterPicker } from "react-color";

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
  const { id, color } = object;
  const [showColorPicker, setShowColorPicker] = useState(false);

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

  const handleColor = (event, id) => {
    console.log(event);
    handleEdit(event, id);
    setShowColorPicker(false);
  };

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
          onChange={(event) => handleEdit(event, id)}
          style={{ textAlign: "center" }}
        />
      </div>
      <div className={stylesCampaign.chartRowLabel}>
        <Button
          onClick={() => setShowColorPicker(true)}
          sx={{
            height: "100%",
            width: "100%",
          }}
        >
          <div
            style={{
              background: color,
              height: "100%",
              width: "100%",
            }}
          />
        </Button>

        {showColorPicker && (
          <>
            <div style={{ position: "absolute", zIndex: 1203 }}>
              <TwitterPicker
                id="color"
                color={color}
                onChange={(event) => handleColor(event, id)}
              />
            </div>
            <div
              onClick={() => setShowColorPicker(false)}
              style={{
                position: "fixed",
                top: "0px",
                right: "0px",
                bottom: "0px",
                left: "0px",
                zIndex: 1202,
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default DataTable;
