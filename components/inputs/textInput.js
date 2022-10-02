import React, { forwardRef } from "react";
import styles from "../../styles/components.module.css";

const TextInput = forwardRef((props, ref) => {
  return <input className={styles.textInput} ref={ref} {...props} />;
});
TextInput.displayName = "TextInput";

export default TextInput;
