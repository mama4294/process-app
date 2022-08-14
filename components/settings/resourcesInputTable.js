import React, { useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import TextInput from "../inputs/textInput";
import { TwitterPicker } from "react-color";

import styles from "../../styles/operations.module.css";
import stylesCampaign from "../../styles/campaign.module.css";

const DataTable = ({ data, headers, handleEdit, handleAdd, handleDelete }) => {
  console.log("Data", data);
  return (
    <>
      <TableHeader data={data} headers={headers} handleAdd={handleAdd} />
      {data.length > 0 &&
        data.map((object, index) => {
          return (
            <TableRow
              key={object.id}
              index={index}
              object={object}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
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

const TableHeader = ({ data, headers, handleAdd }) => {
  return (
    <>
      <div className={styles.titleContainer}>
        <div className={styles.title}>Add Default Resources</div>

        <IconButton onClick={handleAdd}>
          <AddIcon color="action" />
        </IconButton>
      </div>
      {data.length > 0 && (
        <div className={`${stylesCampaign.chartRow} ${styles.headerRow}`}>
          {headers.map((header, index) => {
            return (
              <div className={stylesCampaign.tableHeaderValue} key={index}>
                {header}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

const TableRow = ({ object, handleEdit, handleDelete, index }) => {
  const { id, title, color, unit } = object;
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleColor = (event, id) => {
    handleEdit(event, id);
    setShowColorPicker(false);
  };

  const handleRemove = (id) => {
    handleDelete(id);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "10ch 10ch 25ch 1fr",
        borderBottom: "1px solid #6E81AD",
        alignItems: "center",
      }}
    >
      <div className={styles.chartRowLabel}>
        <TextInput
          id="title"
          value={title}
          type="text"
          placeholder="Name"
          onChange={(event) => handleEdit(event, id)}
          style={{ textAlign: "center" }}
        />
      </div>
      <div className={styles.chartRowLabel}>
        <TextInput
          id="unit"
          value={unit}
          type="text"
          placeholder="Unit"
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
              height: "28px",
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
      <div className={styles.chartRowLabel}>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <IconButton onClick={() => handleRemove(id)}>
            <DeleteIcon color="action" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
