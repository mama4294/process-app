import React from "react";
import styles from "../../styles/components.module.css";
import Select from "react-select";

const Dropdown = ({ id, options, value, onChange, defaultValue }) => {
  return (
    <Select
      options={options}
      inputId={id}
      value={value}
      className={styles.textInput}
      defaultValue={defaultValue}
      onChange={onChange}
    />
  );
};

export default Dropdown;
