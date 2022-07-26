import React from "react";
import styles from "../../styles/components.module.css";

const TextInput = ({ id, value, name, placeholder, type, onChange }) => {
  return (
    <input
      id={id}
      type={type}
      value={value}
      name={name}
      className={styles.textInput}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
};

export default TextInput;
