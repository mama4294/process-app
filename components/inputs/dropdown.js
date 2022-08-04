import React from "react";
import styles from "../../styles/components.module.css";
import Select from "react-select";

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    textAlign: "left",
    // borderBottom: "2px dotted green",
    // color: state.isSelected ? "yellow" : "black",
    // backgroundColor: state.isSelected ? "green" : "white",
  }),
  singleValue: (provided) => ({
    ...provided,
    width: "100%",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "2px 0px",
  }),
  control: (provided, state) => ({
    ...provided,
    height: "100%",
    borderRadius: "0px",
    textAlign: "left",
    backgroundColor: "transparent",
    border: state.isFocused ? "1px solid #0070f3" : 0,
    boxShadow: "none",
    "&:hover": {
      borderBottom: "1px solid black",
    },
  }),
  indicatorsContainer: () => null,
  indicatorsContainer: (styles) => ({
    ...styles,
    padding: "0 0",
    width: "0px",
  }),
  dropdownIndicator: (styles) => ({ ...styles, width: "0%" }),
  indicatorSeparator: () => null, // Remove separator
};

const Dropdown = ({ ...props }) => {
  return (
    <Select styles={customStyles} className={styles.dropdown} {...props} />
  );
};

export default Dropdown;
