import React from "react";
import { SpinnerCircular } from 'spinners-react';

import DataTable from 'react-data-table-component';

import styles from './styles.module.scss'

const Table = ({ loading, step }) => {

  const columns = [
    {
      name: 'Елемент',
      selector: row => row.element,
    },
    {
      name: '№ атома',
      selector: row => row.index,
    },
    {
      name: 'Кордина X',
      selector: row => row.x,
    },
    {
      name: 'Кордина Y',
      selector: row => row.y,
    },
    {
      name: 'Кордина Z',
      selector: row => row.z,
    },
];

  return (
    <div className={styles.table}>
      {loading && <SpinnerCircular />}
      <DataTable
        className={styles.myTable}
        columns={columns}
        data={step.realTable}
        noDataComponent="Не вибрано файл"
      />
    </div>
  )
}

export default Table;