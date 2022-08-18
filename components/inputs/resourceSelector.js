import Select from "react-select";
import { useState, useContext, useEffect } from "react";
import { ResourceContext } from "../../contexts/resourceContext";
import { generateId } from "../../utils/helperFunctions";
import chroma from "chroma-js";
import styles from "../../styles/operations.module.css";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
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
    // control: (styles) => ({ ...styles, backgroundColor: "white" }),
    control: (provided, state) => ({
      ...provided,
      height: "100%",
      borderRadius: "0px",
      textAlign: "left",
      backgroundColor: "transparent",
      border: state.isFocused ? "1px solid #0070f3" : 0,
      boxShadow: "none",
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.color) || chroma("blue");
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
    valueContainer: (styles) => {
      return {
        ...styles,
        padding: "2px 0px",
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

    dropdownIndicator: () => ({ display: "none" }),
    // dropdownIndicator: (styles) => ({ ...styles, width: "0%", padding: "0px" }),
    indicatorSeparator: () => null, // Remove separator
    indicatorsContainer: () => null,
    Menu: () => null, // Remove menu
    MenuList: () => null,
  };

  const handleChange = (event) => {
    onChange(operationId, event);
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Select
        value={value}
        isMulti
        isClearable={false}
        isSearchable={false}
        placeholder="No resources"
        name="resources"
        noOptionsMessage={() => null}
        className="basic-multi-select"
        classNamePrefix="select"
        styles={customStyles}
        onChange={handleChange}
      />
      <AddResourceMenu
        selectedResources={value}
        options={options}
        onChange={onChange}
        operationId={operationId}
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
    console.log("event", event);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //For state
  const [resourceToAdd, setResourceToAdd] = useState({
    ...options[0],
    amount: "",
  });

  const handleChangeValue = (event) => {
    const amount = event.target.value;
    const newState = { ...resourceToAdd, amount: amount };
    console.log("Added new resource, ", newState);
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
    setResourceToAdd(newState);
  };

  const handleAdd = (event) => {
    event.preventDefault();
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
        zIndex: "2",
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
    menu: (styles, { data }) => {
      return {
        ...styles,
        zIndex: 2,
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
    <div style={{ display: "flex", paddingLeft: "8px" }}>
      <button
        id="add-resources-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="outlined"
        onClick={handleClick}
        className={styles.addResButton}
      >
        Add Resource
      </button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        components={{ Option }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
          disablePadding: true,
        }}
        sx={{ pt: "0px", pb: "0px" }}
      >
        <form onSubmit={handleAdd}>
          <AppBar position="static">
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose}>
                <CloseIcon />
              </IconButton>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, textAlign: "center" }}
              >
                Add Resource
              </Typography>
              <IconButton edge="end" color="inherit" type="submit">
                <CheckIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Box sx={{ margin: "12px" }}>
            <Stack spacing={2}>
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
            </Stack>
          </Box>
        </form>
      </Menu>
    </div>
  );
};
