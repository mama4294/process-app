import React from "react";
import styles from "../../styles/components.module.css";
import Select from "react-select";

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    // borderBottom: "2px dotted green",
    // color: state.isSelected ? "yellow" : "black",
    // backgroundColor: state.isSelected ? "green" : "white",
  }),
  control: (provided, state) => ({
    ...provided,
    height: "100%",
    borderRadius: "0px",
    border: state.isFocused ? "1px solid #0070f3" : 0,
    boxShadow: "none",
    "&:hover": {
      borderBottom: "1px solid black",
    },
  }),
  indicatorsContainer: () => null,
  dropdownIndicator: (styles) => ({ ...styles, width: "0%" }),
  indicatorSeparator: () => null, // Remove separator
};

const Dropdown = ({ id, options, value, onChange, defaultValue }) => {
  return (
    <Select
      options={options}
      styles={customStyles}
      className={styles.dropdown}
      inputId={id}
      value={{ label: value }}
      defaultValue={defaultValue}
      onChange={onChange}
    />
  );
};

export default Dropdown;
