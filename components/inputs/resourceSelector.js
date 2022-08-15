import Select, { StylesConfig } from "react-select";
import { useState, useContext } from "react";
import { ResourceContext } from "../../contexts/resourceContext";
import { generateId } from "../../utils/helperFunctions";
import chroma from "chroma-js";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

export const ResourceSelector = ({ value, onChange, operationId }) => {
  const { resourceOptions } = useContext(ResourceContext);
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

  console.log("selected Resources for: ", operationId, value);
  const testArray = [
    { value: "taco", label: "taco", color: "blue" },
    { value: "burrito", label: "burrito", color: "green" },
  ];

  return (
    <div>
      <AddResourceMenu
        selectedResources={value}
        options={options}
        onChange={onChange}
        operationId={operationId}
      />
      <Select
        value={value}
        isMulti
        name="resources"
        options={options}
        className="basic-multi-select"
        classNamePrefix="select"
        styles={customStyles}
      />
    </div>
  );
};

const AddResourceMenu = ({
  options,
  selectedResources,
  onChange,
  operationId,
}) => {
  //For pop up menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //For state

  const [resourceToAdd, setResourceToAdd] = useState({
    ...options[0],
    amount: 0,
  });

  const handleChangeValue = (event) => {
    const amount = event.target.value;
    const newState = { ...resourceToAdd, amount: amount };
    console.log("New data", newState);
    setResourceToAdd(newState);
  };

  const handleChangeDropdown = (event) => {
    const { title, value, unit, color } = event;
    const newState = {
      ...resourceToAdd,
      label: title,
      value,
      unit,
      title,
      color,
    };
    console.log("New data", newState);
    setResourceToAdd(newState);
  };

  const handleAdd = () => {
    const newRes = {
      ...resourceToAdd,
      id: generateId(),
      label: `${resourceToAdd.title} - ${resourceToAdd.amount} ${resourceToAdd.unit}`,
      value: resourceToAdd.title,
    };
    const newResources = [...selectedResources, newRes];
    console.log("newResources", newResources);
    onChange(operationId, newResources);
    handleClose();
  };

  //For react-select styling

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
        <Select
          defaultValue={resourceToAdd}
          name="addresources"
          options={options}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={handleChangeDropdown}
          styles={customStyles}
        />
        <TextField
          id="outlined-basic"
          label="Value"
          variant="outlined"
          type="number"
          value={resourceToAdd.amount}
          onChange={handleChangeValue}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {resourceToAdd.unit}
              </InputAdornment>
            ),
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAdd}>
            Save
          </Button>
        </div>
      </Menu>
    </div>
  );
};
