import Select, { StylesConfig } from "react-select";
import { useState, useContext } from "react";
import { ResourceContext } from "../../contexts/resourceContext";
import chroma from "chroma-js";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Menu from "@mui/material/Menu";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

export const ResourceSelector = () => {
  const { resourceOptions } = useContext(ResourceContext);

  const selectedResources = resourceOptions.map((resource) => {
    const { title, unit } = resource;
    return {
      ...resource,
      label: `${title} - 55 ${unit}`,
      value: title,
    };
  });

  const options = resourceOptions.map((resource) => {
    const { title, unit } = resource;
    return {
      ...resource,
      label: title,
      value: title,
    };
  });

  const customStyles = {
    control: (styles) => ({ ...styles, backgroundColor: "white" }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isDisabled
          ? undefined
          : isSelected
          ? data.color
          : isFocused
          ? color.alpha(0.1).css()
          : undefined,
        color: isDisabled
          ? "#ccc"
          : isSelected
          ? chroma.contrast(color, "white") > 2
            ? "white"
            : "black"
          : data.color,
        cursor: isDisabled ? "not-allowed" : "default",

        ":active": {
          ...styles[":active"],
          backgroundColor: !isDisabled
            ? isSelected
              ? data.color
              : color.alpha(0.3).css()
            : undefined,
        },
      };
    },
    multiValue: (styles, { data }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: color.alpha(0.1).css(),
      };
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: data.color,
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: data.color,
      ":hover": {
        backgroundColor: data.color,
        color: "white",
      },
    }),
  };

  return (
    <div>
      <AddResourceMenu options={options} />
      <Select
        defaultValue={selectedResources[0]}
        isMulti
        name="resources"
        options={selectedResources}
        className="basic-multi-select"
        classNamePrefix="select"
        styles={customStyles}
      />
    </div>
  );
};

const AddResourceMenu = ({ options }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <AddIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <div style={{ display: "flex" }}>
          <Select
            defaultValue={options[0]}
            isMulti
            name="addresources"
            options={options}
            className="basic-multi-select"
            classNamePrefix="select"
          />
          <TextField
            id="outlined-basic"
            label="Value"
            variant="outlined"
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
          />
        </div>
        {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem> */}
      </Menu>
    </div>
  );
};
