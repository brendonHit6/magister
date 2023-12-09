import React from "react";

import styles from './styles.module.scss'

const FileSelector = ({ handleFileChange }) => {

  return (
    <div className={styles.wrapper}>
      <input type="file" accept=".castep, .CASTEP" className={styles.input} multiple={false} id="files" type="file" onChange={handleFileChange} />
      <label
        htmlFor="files"
        className={styles.selectBtn}
      >
        Виберіть файл з розширенням castep
      </label>
    </div>
  )
}

export default FileSelector;