import React from "react";
import styles from "../../styles/components.module.css";

const TextInput = ({
  id,
  value,
  name,
  placeholder,
  type,
  onChange,
  style,
  ...props
}) => {
  return (
    <input
      id={id}
      type={type}
      value={value}
      name={name}
      style={style}
      className={styles.textInput}
      placeholder={placeholder}
      onChange={onChange}
      {...props}
    />
  );
};

export default TextInput;
